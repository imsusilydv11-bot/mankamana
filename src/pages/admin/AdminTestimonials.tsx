import React, { useState } from 'react';
import { Plus, Pencil, Trash2, X, Star } from 'lucide-react';
import { Testimonial } from '../../types/hotel';
import {
  createTestimonial,
  deleteTestimonial,
  updateTestimonial,
} from '../../services/hotelService';
import { useToast } from '../../components/common/Toast';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

interface AdminTestimonialsProps {
  items: Testimonial[];
}

const emptyTestimonialForm = {
  guestName: '',
  guestOrigin: '',
  rating: 5,
  stayType: '',
  quote: '',
  isEnabled: true,
};

export function AdminTestimonials({ items }: AdminTestimonialsProps) {
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyTestimonialForm);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyTestimonialForm);
    setModalOpen(true);
  };

  const openEdit = (item: Testimonial) => {
    setEditingId(item.id);
    setForm({
      guestName: item.guestName,
      guestOrigin: item.guestOrigin,
      rating: item.rating,
      stayType: item.stayType,
      quote: item.quote,
      isEnabled: item.isEnabled,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.guestName.trim().length < 2 || form.quote.trim().length < 5) {
      showToast('Guest name and review quote are required.', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        guestName: form.guestName.trim(),
        guestOrigin: form.guestOrigin.trim(),
        rating: Number(form.rating) || 5,
        stayType: form.stayType.trim(),
        quote: form.quote.trim(),
        isEnabled: form.isEnabled,
      };
      if (editingId) {
        await updateTestimonial(editingId, payload);
        showToast('Testimonial updated.', 'success');
      } else {
        await createTestimonial(payload);
        showToast('Testimonial added.', 'success');
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast('Failed to save testimonial.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteTestimonial(deleteTarget.id);
      showToast('Testimonial deleted.', 'success');
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      showToast('Failed to delete testimonial.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-600">
          Manage guest reviews featured on the homepage.
        </p>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-slate-200 p-12 text-center text-sm text-slate-500">
          No live testimonials in Firestore yet. Click &ldquo;Add Testimonial&rdquo; or initialize sample data from Dashboard Overview.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-slate-200 p-5 flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: item.rating }).map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span
                    className={`px-2 py-0.5 text-xs font-medium ${
                      item.isEnabled ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.isEnabled ? 'Published' : 'Hidden'}
                  </span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.guestName}</p>
                  <p className="text-xs text-slate-500">
                    {[item.guestOrigin, item.stayType].filter(Boolean).join(' · ')}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    aria-label={`Edit testimonial by ${item.guestName}`}
                    className="p-1.5 text-slate-600 hover:text-slate-900"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
                    aria-label={`Delete testimonial by ${item.guestName}`}
                    className="p-1.5 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 max-w-lg w-full p-6">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingId ? 'Edit Testimonial' : 'Add Testimonial'}
              </h2>
              <button type="button" onClick={() => setModalOpen(false)} className="text-slate-500 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Guest Name *</label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={form.guestName}
                    onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">City / Origin</label>
                  <input
                    type="text"
                    maxLength={100}
                    value={form.guestOrigin}
                    onChange={(e) => setForm({ ...form, guestOrigin: e.target.value })}
                    placeholder="Kathmandu, Nepal"
                    className="w-full px-3 py-2 border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Rating (1-5)</label>
                  <select
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 text-sm bg-white"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} Stars
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Stay Type</label>
                  <input
                    type="text"
                    maxLength={80}
                    value={form.stayType}
                    onChange={(e) => setForm({ ...form, stayType: e.target.value })}
                    placeholder="Deluxe King · Business Stay"
                    className="w-full px-3 py-2 border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Guest Quote *</label>
                <textarea
                  rows={4}
                  required
                  maxLength={1000}
                  value={form.quote}
                  onChange={(e) => setForm({ ...form, quote: e.target.value })}
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
                <span>Display on Public Homepage</span>
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
                  {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Testimonial"
        description={`Delete the review by "${deleteTarget?.guestName}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
