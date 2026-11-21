import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { uploadHotelImage } from '../../services/hotelService';
import { useToast } from '../common/Toast';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: 'rooms' | 'gallery' | 'facilities' | 'branding';
  placeholder?: string;
}

export function ImageUploadField({
  label,
  value,
  onChange,
  folder,
  placeholder = 'https://... or /src/assets/images/...',
}: ImageUploadFieldProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file.', 'error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('Image must be under 10 MB.', 'error');
      return;
    }

    setUploading(true);
    setProgress(0);
    try {
      const url = await uploadHotelImage(file, folder, setProgress);
      onChange(url);
      showToast('Image uploaded to Firebase Storage.', 'success');
    } catch (err) {
      console.error(err);
      showToast(
        'Firebase Storage upload failed. Check storage.rules or paste an image URL directly.',
        'error'
      );
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-slate-700">{label}</label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          maxLength={1000}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-slate-900"
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 disabled:opacity-60 whitespace-nowrap"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>{uploading ? `Uploading ${progress}%` : 'Upload Image'}</span>
        </button>
      </div>

      {value && (
        <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200">
          <img
            src={value}
            alt={label}
            referrerPolicy="no-referrer"
            className="w-16 h-12 object-cover bg-slate-200 shrink-0"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
          <span className="text-xs text-slate-500 truncate flex-1">{value}</span>
        </div>
      )}
      {!value && (
        <p className="text-xs text-slate-400 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Upload a photo or enter a hosted image path.</span>
        </p>
      )}
    </div>
  );
}
