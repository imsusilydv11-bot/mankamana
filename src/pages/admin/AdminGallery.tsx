import React, { useMemo, useState } from 'react';
import { Plus, Search, Pencil, Trash2, X, Eye, EyeOff } from 'lucide-react';
import { GALLERY_CATEGORIES, GalleryCategory, GalleryItem } from '../../types/hotel';
import {
  createGalleryItem,
  deleteGalleryItem,
  updateGalleryItem,
} from '../../services/hotelService';
import { useToast } from '../../components/common/Toast';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { ImageUploadField } from '../../components/admin/ImageUploadField';

interface AdminGalleryProps {
  items: GalleryItem[];
}

const emptyGalleryForm = {
  title: '',
  category: 'Exterior' as GalleryCategory,
  imageUrl: '',
  caption: '',
  displayOrder: 1,
  isEnabled: true,
};

export function AdminGallery({ items }: AdminGalleryProps) {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'All' | GalleryCategory>('All');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyGalleryForm);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.caption.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    });
  }, [items, search, categoryFilter]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyGalleryForm, displayOrder: items.length + 1 });
    setModalOpen(true);
  };

  const openEdit = (item: GalleryItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      category: item.category,
      imageUrl: item.imageUrl,
      caption: item.caption,
      displayOrder: item.displayOrder,
      isEnabled: item.isEnabled,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.title.trim().length < 2 || !form.imageUrl.trim()) {
      showToast('Photo title and image URL are required.', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        category: form.category,
        imageUrl: form.imageUrl.trim(),
        caption: form.caption.trim(),
        displayOrder: Number(form.displayOrder) || 0,
        isEnabled: form.isEnabled,
      };
      if (editingId) {
        await updateGalleryItem(editingId, payload);
        showToast('Gallery item updated.', 'success');
      } else {
        await createGalleryItem(payload);
        showToast('Gallery item added.', 'success');
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast('Failed to save gallery item.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleEnabled = async (item: GalleryItem) => {
    try {
      await updateGalleryItem(item.id, {
        title: item.title,
        category: item.category,
        imageUrl: item.imageUrl,
        caption: item.caption,
        displayOrder: item.displayOrder,
        isEnabled: !item.isEnabled,
      });
      showToast(item.isEnabled ? 'Photo hidden from public site.' : 'Photo enabled on public site.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to update photo visibility.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteGalleryItem(deleteTarget.id);
      showToast('Gallery item deleted.', 'success');
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      showToast('Failed to delete gallery item.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search gallery..."
              className="pl-9 pr-3 py-2 border border-slate-300 bg-white text-sm w-56 focus:outline-none focus:border-slate-900"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as 'All' | GalleryCategory)}
            className="px-3 py-2 border border-slate-300 bg-white text-sm"
          >
            <option value="All">All Categories</option>
            {GALLERY_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add Photograph</span>
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 p-12 text-center text-sm text-slate-500">
          No live gallery items in Firestore yet. Click &ldquo;Add Photograph&rdquo; or initialize sample data from Dashboard Overview.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 overflow-hidden flex flex-col">
              <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                {!item.isEnabled && (
                  <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
                    <span className="px-2.5 py-1 bg-white text-slate-900 text-xs font-medium">
                      Hidden
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1">
                    <span className="font-medium text-amber-800">{item.category}</span>
                    <span className="font-mono tabular-nums">Order #{item.displayOrder}</span>
                  </div>
                  <h3 className="font-medium text-slate-900 text-sm">{item.title}</h3>
                  {item.caption && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.caption}</p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleToggleEnabled(item)}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900"
                  >
                    {item.isEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{item.isEnabled ? 'Visible' : 'Hidden'}</span>
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      aria-label={`Edit ${item.title}`}
                      className="p-1.5 text-slate-600 hover:text-slate-900"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(item)}
                      aria-label={`Delete ${item.title}`}
                      className="p-1.5 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingId ? 'Edit Photograph' : 'Add Gallery Photograph'}
              </h2>
              <button type="button" onClick={() => setModalOpen(false)} className="text-slate-500 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Photo Title *</label>
                <input
                  type="text"
                  required
                  maxLength={120}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as GalleryCategory })}
                    className="w-full px-3 py-2 border border-slate-300 text-sm bg-white"
                  >
                    {GALLERY_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    min={0}
                    value={form.displayOrder}
                    onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 text-sm tabular-nums"
                  />
                </div>
              </div>

              <ImageUploadField
                label="Photograph *"
                value={form.imageUrl}
                onChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
                folder="gallery"
              />

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Caption</label>
                <textarea
                  rows={2}
                  maxLength={400}
                  value={form.caption}
                  onChange={(e) => setForm({ ...form, caption: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 text-sm"
                />
              </div>

              <label className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isEnabled}
                  onChange={(e) => setForm({ ...form, isEnabled: e.target.checked })}
                  className="w-4 h-4 accent-slate-900"
                />
                <span>Show on Public Gallery</span>
              </label>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-700 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-60"
                >
                  {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Gallery Photograph"
        description={`Delete "${deleteTarget?.title}" from the Firestore gallery?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
