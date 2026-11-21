import { useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { GalleryItem } from '../../types/hotel';
import { SmartImage } from '../common/SmartImage';

interface GalleryLightboxProps {
  items: GalleryItem[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export function GalleryLightbox({
  items,
  activeIndex,
  onClose,
  onNavigate,
}: GalleryLightboxProps) {
  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate((activeIndex + 1) % items.length);
      if (e.key === 'ArrowLeft') onNavigate((activeIndex - 1 + items.length) % items.length);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, items.length, onClose, onNavigate]);

  if (activeIndex === null || !items[activeIndex]) return null;
  const current = items[activeIndex];

  return (
    <div
      className="fixed inset-0 z-[115] bg-[#0D0C0B]/95 flex flex-col justify-between p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={current.title}
    >
      <div className="flex items-center justify-between text-[#F8F5F0]">
        <div className="text-xs text-stone-400">
          <span className="text-[#C9A461]">{current.category}</span>
          <span className="mx-2" aria-hidden="true">·</span>
          <span className="tabular-nums">
            {activeIndex + 1} / {items.length}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close lightbox"
          className="p-2 text-stone-300 hover:text-white border border-white/15 hover:border-white/40 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="relative flex-1 flex items-center justify-center my-4 min-h-0">
        {items.length > 1 && (
          <button
            type="button"
            onClick={() => onNavigate((activeIndex - 1 + items.length) % items.length)}
            aria-label="Previous image"
            className="absolute left-2 sm:left-4 z-10 p-3 bg-[#0D0C0B]/80 border border-white/15 text-white hover:border-[#C9A461] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        <div className="max-w-5xl max-h-full w-full h-full flex items-center justify-center">
          <SmartImage
            src={current.imageUrl}
            alt={current.title}
            fallbackLabel={current.title}
            priority
            className="max-h-[75vh] max-w-full object-contain"
          />
        </div>

        {items.length > 1 && (
          <button
            type="button"
            onClick={() => onNavigate((activeIndex + 1) % items.length)}
            aria-label="Next image"
            className="absolute right-2 sm:right-4 z-10 p-3 bg-[#0D0C0B]/80 border border-white/15 text-white hover:border-[#C9A461] transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="text-center text-[#F8F5F0]">
        <h3 className="font-display text-2xl">{current.title}</h3>
        {current.caption && <p className="text-sm text-stone-400 mt-1">{current.caption}</p>}
      </div>
    </div>
  );
}
