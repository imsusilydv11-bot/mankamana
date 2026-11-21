import React, { useMemo, useState } from 'react';
import { Plus, Search, Pencil, Trash2, X, Star } from 'lucide-react';
import { Room } from '../../types/hotel';
import { createRoom, deleteRoom, slugify, updateRoom } from '../../services/hotelService';
import { useToast } from '../../components/common/Toast';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { ImageUploadField } from '../../components/admin/ImageUploadField';

interface AdminRoomsProps {
  rooms: Room[];
  hasLiveRooms: boolean;
}

const emptyRoomForm = {
  name: '',
  slug: '',
  type: 'Deluxe',
  description: '',
  priceNpr: 4500,
  maxGuests: 2,
  bedType: '1 King Bed',
  sizeSqFt: 320,
  amenitiesText: 'High-Speed Fiber Wi-Fi, Air Conditioning, En-suite Bathroom',
  images: [] as string[],
  isAvailable: true,
  isFeatured: true,
  displayOrder: 1,
};

export function AdminRooms({ rooms, hasLiveRooms }: AdminRoomsProps) {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'order' | 'priceAsc' | 'priceDesc' | 'name'>('order');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyRoomForm);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Room | null>(null);
  const [deleting, setDeleting] = useState(false);

  const liveRoomsOnly = useMemo(() => (hasLiveRooms ? rooms : []), [rooms, hasLiveRooms]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = liveRoomsOnly.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        r.bedType.toLowerCase().includes(q)
    );
    return [...list].sort((a, b) => {
      if (sortBy === 'priceAsc') return a.priceNpr - b.priceNpr;
      if (sortBy === 'priceDesc') return b.priceNpr - a.priceNpr;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
    });
  }, [liveRoomsOnly, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyRoomForm, displayOrder: liveRoomsOnly.length + 1 });
    setNewImageUrl('');
    setModalOpen(true);
  };

  const openEdit = (room: Room) => {
    setEditingId(room.id);
    setForm({
      name: room.name,
      slug: room.slug,
      type: room.type,
      description: room.description,
      priceNpr: room.priceNpr,
      maxGuests: room.maxGuests,
      bedType: room.bedType,
      sizeSqFt: room.sizeSqFt,
      amenitiesText: room.amenities.join(', '),
      images: room.images,
      isAvailable: room.isAvailable,
      isFeatured: room.isFeatured,
      displayOrder: room.displayOrder,
    });
    setNewImageUrl('');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2 || form.description.trim().length < 10) {
      showToast('Room name (>= 2 chars) and description (>= 10 chars) are required.', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        slug: slugify(form.slug || form.name),
        type: form.type.trim() || 'Deluxe',
        description: form.description.trim(),
        priceNpr: Number(form.priceNpr) || 0,
        maxGuests: Number(form.maxGuests) || 2,
        bedType: form.bedType.trim() || '1 King Bed',
        sizeSqFt: Number(form.sizeSqFt) || 300,
        amenities: form.amenitiesText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        images: form.images.filter(Boolean),
        isAvailable: form.isAvailable,
        isFeatured: form.isFeatured,
        displayOrder: Number(form.displayOrder) || 0,
      };

      if (editingId) {
        await updateRoom(editingId, payload);
        showToast('Room updated in Firestore.', 'success');
      } else {
        await createRoom(payload);
        showToast('New room created in Firestore.', 'success');
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast('Failed to save room.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteRoom(deleteTarget.id);
      showToast('Room deleted.', 'success');
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      showToast('Failed to delete room.', 'error');
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
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search rooms..."
              className="pl-9 pr-3 py-2 border border-slate-300 bg-white text-sm w-60 focus:outline-none focus:border-slate-900"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 border border-slate-300 bg-white text-sm"
          >
            <option value="order">Sort: Display Order</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Room</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 overflow-hidden">
        {paginated.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">
            No live rooms in Firestore yet. Click &ldquo;Add New Room&rdquo; or initialize sample data from Dashboard Overview.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500">
                  <th className="py-3 px-4 font-medium">Room</th>
                  <th className="py-3 px-4 font-medium">Type</th>
                  <th className="py-3 px-4 font-medium text-right">Rate (NPR)</th>
                  <th className="py-3 px-4 font-medium text-right">Max Guests</th>
                  <th className="py-3 px-4 font-medium">Availability</th>
                  <th className="py-3 px-4 font-medium">Featured</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.map((room) => (
                  <tr key={room.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-9 bg-slate-200 shrink-0 overflow-hidden">
                          {room.images[0] && (
                            <img
                              src={room.images[0]}
                              alt={room.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{room.name}</p>
                          <p className="text-xs text-slate-500">{room.bedType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{room.type}</td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-900">
                      NPR {room.priceNpr.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-700">
                      {room.maxGuests}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-medium ${
                          room.isAvailable
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {room.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {room.isFeatured ? (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-700 font-medium">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>Featured</span>
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Standard</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => openEdit(room)}
                        aria-label={`Edit ${room.name}`}
                        className="p-1.5 text-slate-600 hover:text-slate-900 mr-1"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(room)}
                        aria-label={`Delete ${room.name}`}
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

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span className="tabular-nums">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 border border-slate-300 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 border border-slate-300 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                {editingId ? 'Edit Room' : 'Add New Room'}
              </h2>
              <button type="button" onClick={() => setModalOpen(false)} className="text-slate-500 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Room Name *</label>
                  <input
                    type="text"
                    required
                    maxLength={120}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Room Type *</label>
                  <input
                    type="text"
                    required
                    maxLength={60}
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    placeholder="Deluxe / Executive Suite / Twin"
                    className="w-full px-3 py-2 border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Price per Night (NPR) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={form.priceNpr}
                    onChange={(e) => setForm({ ...form, priceNpr: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 text-sm tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Max Guests *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={20}
                    value={form.maxGuests}
                    onChange={(e) => setForm({ ...form, maxGuests: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 text-sm tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Bed Type *</label>
                  <input
                    type="text"
                    required
                    maxLength={80}
                    value={form.bedType}
                    onChange={(e) => setForm({ ...form, bedType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Size (sq ft) & Order</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min={50}
                      value={form.sizeSqFt}
                      onChange={(e) => setForm({ ...form, sizeSqFt: Number(e.target.value) })}
                      placeholder="Sq Ft"
                      className="w-full px-3 py-2 border border-slate-300 text-sm tabular-nums"
                    />
                    <input
                      type="number"
                      min={0}
                      value={form.displayOrder}
                      onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                      placeholder="Order"
                      className="w-full px-3 py-2 border border-slate-300 text-sm tabular-nums"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  minLength={10}
                  maxLength={3000}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Amenities (comma-separated)
                </label>
                <input
                  type="text"
                  value={form.amenitiesText}
                  onChange={(e) => setForm({ ...form, amenitiesText: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 text-sm"
                />
              </div>

              {/* Multi-image manager */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <ImageUploadField
                  label="Upload or Add Room Photograph"
                  value={newImageUrl}
                  onChange={(url) => {
                    if (url && !form.images.includes(url) && form.images.length < 10) {
                      setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
                      setNewImageUrl('');
                    } else {
                      setNewImageUrl(url);
                    }
                  }}
                  folder="rooms"
                />
                {newImageUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!form.images.includes(newImageUrl)) {
                        setForm((prev) => ({ ...prev, images: [...prev.images, newImageUrl] }));
                      }
                      setNewImageUrl('');
                    }}
                    className="px-3 py-1.5 bg-slate-100 text-slate-800 text-xs font-medium hover:bg-slate-200"
                  >
                    + Add URL to Room Gallery
                  </button>
                )}

                {form.images.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {form.images.map((img, i) => (
                      <div key={`${img}-${i}`} className="relative border border-slate-200 aspect-[4/3] bg-slate-100">
                        <img src={img} alt={`Room ${i + 1}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, idx) => idx !== i),
                            }))
                          }
                          aria-label="Remove image"
                          className="absolute top-1 right-1 p-1 bg-black/75 text-white hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-6 pt-2">
                <label className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isAvailable}
                    onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                    className="w-4 h-4 accent-slate-900"
                  />
                  <span>Available for Booking Enquiries</span>
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-slate-900"
                  />
                  <span>Featured on Homepage</span>
                </label>
              </div>

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
                  {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Room"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action removes the listing permanently from Firestore.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
