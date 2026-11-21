import React, { useMemo, useState } from 'react';
import { Plus, Search, Pencil, Trash2, X } from 'lucide-react';
import { Facility } from '../../types/hotel';
import {
  createFacility,
  deleteFacility,
  updateFacility,
} from '../../services/hotelService';
import { useToast } from '../../components/common/Toast';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { FacilityIcon } from '../../components/common/FacilityIcon';
import { ImageUploadField } from '../../components/admin/ImageUploadField';

interface AdminFacilitiesProps {
  items: Facility[];
}

const ICON_OPTIONS = [
  'Wifi',
  'Wind',
  'Car',
  'ConciergeBell',
  'Clock',
  'Utensils',
  'Coffee',
  'ShieldCheck',
  'Tv',
  'Sparkles',
];

const emptyFacilityForm = {
  name: '',
  category: 'Comfort',
  description: '',
  iconName: 'Sparkles',
  imageUrl: '',
  isEnabled: true,
  displayOrder: 1,
};

export function AdminFacilities({ items }: AdminFacilitiesProps) {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyFacilityForm);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Facility | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter(
      (f) =>
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q)
    );
  }, [items, search]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyFacilityForm, displayOrder: items.length + 1 });
    setModalOpen(true);
  };

  const openEdit = (item: Facility) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      category: item.category,
      description: item.description,
      iconName: item.iconName || 'Sparkles',
      imageUrl: item.imageUrl || '',
      isEnabled: item.isEnabled,
      displayOrder: item.displayOrder,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2 || form.description.trim().length < 4) {
      showToast('Facility name and description are required.', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        category: form.category.trim() || 'Hospitality',
        description: form.description.trim(),
        iconName: form.iconName || 'Sparkles',
        imageUrl: form.imageUrl.trim(),
        isEnabled: form.isEnabled,
        displayOrder: Number(form.displayOrder) || 0,
      };
      if (editingId) {
        await updateFacility(editingId, payload);
        showToast('Facility updated.', 'success');
      } else {
        await createFacility(payload);
        showToast('Facility added.', 'success');
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast('Failed to save facility.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteFacility(deleteTarget.id);
      showToast('Facility deleted.', 'success');
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      showToast('Failed to delete facility.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search facilities..."
            className="pl-9 pr-3 py-2 border border-slate-300 bg-white text-sm w-64 focus:outline-none focus:border-slate-900"
          />
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add Facility</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">
            No live facilities in Firestore yet. Click &ldquo;Add Facility&rdquo; or initialize sample data from Dashboard Overview.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500">
                  <th className="py-3 px-4 font-medium">Facility</th>
                  <th className="py-3 px-4 font-medium">Category</th>
                  <th className="py-3 px-4 font-medium">Description</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                          <FacilityIcon name={item.iconName} className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-slate-900">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{item.category}</td>
                    <td className="py-3 px-4 text-slate-600 max-w-md truncate">{item.description}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-medium ${
                          item.isEnabled
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.isEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        aria-label={`Edit ${item.name}`}
                        className="p-1.5 text-slate-600 hover:text-slate-900 mr-1"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(item)}
                        aria-label={`Delete ${item.name}`}
                        className="p-1.5 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingId ? 'Edit Facility' : 'Add Facility'}
              </h2>
              <button type="button" onClick={() => setModalOpen(false)} className="text-slate-500 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Facility Name *</label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    maxLength={60}
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Connectivity / Dining / Comfort"
                    className="w-full px-3 py-2 border border-slate-300 text-sm"
                  />
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

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Icon</label>
                <div className="grid grid-cols-5 gap-2">
                  {ICON_OPTIONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setForm({ ...form, iconName: icon })}
                      className={`p-2.5 border flex flex-col items-center gap-1 text-[10px] ${
                        form.iconName === icon
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 text-slate-600 hover:border-slate-400'
                      }`}
                    >
                      <FacilityIcon name={icon} className="w-4 h-4" />
                      <span className="truncate w-full text-center">{icon}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  maxLength={1000}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 text-sm"
                />
              </div>

              <ImageUploadField
                label="Optional Photograph"
                value={form.imageUrl}
                onChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
                folder="facilities"
              />

              <label className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isEnabled}
                  onChange={(e) => setForm({ ...form, isEnabled: e.target.checked })}
                  className="w-4 h-4 accent-slate-900"
                />
                <span>Enabled on Public Website</span>
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
                  {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Facility'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Facility"
        description={`Delete "${deleteTarget?.name}" from Firestore?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
