import React, { useMemo, useState } from 'react';
import { Search, Eye, Trash2, X } from 'lucide-react';
import {
  BOOKING_STATUSES,
  BookingEnquiry,
  BookingStatus,
  Room,
} from '../../types/hotel';
import { deleteBooking, updateBooking } from '../../services/hotelService';
import { useToast } from '../../components/common/Toast';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

interface AdminBookingsProps {
  bookings: BookingEnquiry[];
  rooms: Room[];
}

export function AdminBookings({ bookings, rooms }: AdminBookingsProps) {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | BookingStatus>('All');
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'checkIn'>('newest');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [selected, setSelected] = useState<BookingEnquiry | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<BookingEnquiry | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = bookings.filter((b) => {
      if (statusFilter !== 'All' && b.status !== statusFilter) return false;
      if (dateFilter && b.checkInDate !== dateFilter && b.checkOutDate !== dateFilter) return false;
      if (q) {
        const hit =
          b.guestName.toLowerCase().includes(q) ||
          b.email.toLowerCase().includes(q) ||
          b.phone.toLowerCase().includes(q) ||
          b.roomType.toLowerCase().includes(q);
        if (!hit) return false;
      }
      return true;
    });
    if (sortBy === 'checkIn') {
      return [...list].sort((a, b) => a.checkInDate.localeCompare(b.checkInDate));
    }
    return list;
  }, [bookings, search, statusFilter, dateFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSaveDetail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    try {
      await updateBooking(selected.id, {
        guestName: selected.guestName,
        phone: selected.phone,
        email: selected.email,
        checkInDate: selected.checkInDate,
        checkOutDate: selected.checkOutDate,
        adults: selected.adults,
        children: selected.children,
        roomId: selected.roomId,
        roomType: selected.roomType,
        specialRequests: selected.specialRequests,
        status: selected.status,
        adminNotes: selected.adminNotes,
      });
      showToast('Booking enquiry updated.', 'success');
      setSelected(null);
    } catch (err) {
      console.error(err);
      showToast('Failed to update booking.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteBooking(deleteTarget.id);
      showToast('Booking enquiry deleted.', 'success');
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      showToast('Failed to delete booking.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
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
              placeholder="Search guest, phone, email..."
              className="pl-9 pr-3 py-2 border border-slate-300 bg-white text-sm w-64 focus:outline-none focus:border-slate-900"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as 'All' | BookingStatus);
              setPage(1);
            }}
            className="px-3 py-2 border border-slate-300 bg-white text-sm"
          >
            <option value="All">All Statuses</option>
            {BOOKING_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by check-in or check-out date"
            className="px-3 py-2 border border-slate-300 bg-white text-sm"
          />

          {dateFilter && (
            <button
              type="button"
              onClick={() => setDateFilter('')}
              className="text-xs text-slate-600 underline"
            >
              Clear date
            </button>
          )}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-3 py-2 border border-slate-300 bg-white text-sm"
        >
          <option value="newest">Sort: Latest Received</option>
          <option value="checkIn">Sort: Check-in Date</option>
        </select>
      </div>

      <div className="bg-white border border-slate-200 overflow-hidden">
        {paginated.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">
            No booking enquiries match the current filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500">
                  <th className="py-3 px-4 font-medium">Guest</th>
                  <th className="py-3 px-4 font-medium">Room</th>
                  <th className="py-3 px-4 font-medium">Stay Dates</th>
                  <th className="py-3 px-4 font-medium text-right">Party</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-900">{b.guestName}</p>
                      <p className="text-xs text-slate-500">
                        {b.phone} · {b.email}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{b.roomType}</td>
                    <td className="py-3 px-4 font-mono text-xs tabular-nums text-slate-700 whitespace-nowrap">
                      {b.checkInDate} &rarr; {b.checkOutDate}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs tabular-nums text-slate-700">
                      {b.adults}A / {b.children}C
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-xs font-medium ${
                          b.status === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : b.status === 'New'
                            ? 'bg-amber-50 text-amber-800'
                            : b.status === 'Cancelled'
                            ? 'bg-red-50 text-red-700'
                            : b.status === 'Completed'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelected({ ...b })}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 border border-slate-300 hover:bg-slate-100 mr-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(b)}
                        aria-label={`Delete enquiry from ${b.guestName}`}
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

      {/* View / Edit Booking Modal */}
      {selected && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200">
              <div>
                <p className="text-xs font-mono text-slate-500">
                  Enquiry #{selected.id.slice(0, 8).toUpperCase()}
                </p>
                <h2 className="text-lg font-semibold text-slate-900">
                  Manage Booking Enquiry
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDetail} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Guest Name</label>
                  <input
                    type="text"
                    required
                    value={selected.guestName}
                    onChange={(e) => setSelected({ ...selected, guestName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={selected.status}
                    onChange={(e) =>
                      setSelected({ ...selected, status: e.target.value as BookingStatus })
                    }
                    className="w-full px-3 py-2 border border-slate-300 text-sm font-medium"
                  >
                    {BOOKING_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={selected.phone}
                    onChange={(e) => setSelected({ ...selected, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={selected.email}
                    onChange={(e) => setSelected({ ...selected, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Check-In</label>
                  <input
                    type="date"
                    required
                    value={selected.checkInDate}
                    onChange={(e) => setSelected({ ...selected, checkInDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Check-Out</label>
                  <input
                    type="date"
                    required
                    value={selected.checkOutDate}
                    onChange={(e) => setSelected({ ...selected, checkOutDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Room Type</label>
                  <select
                    value={selected.roomType}
                    onChange={(e) => {
                      const found = rooms.find((r) => r.name === e.target.value);
                      setSelected({
                        ...selected,
                        roomType: e.target.value,
                        roomId: found?.id || selected.roomId,
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-300 text-sm"
                  >
                    {!rooms.some((r) => r.name === selected.roomType) && (
                      <option value={selected.roomType}>{selected.roomType}</option>
                    )}
                    {rooms.map((r) => (
                      <option key={r.id} value={r.name}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Adults</label>
                    <input
                      type="number"
                      min={1}
                      value={selected.adults}
                      onChange={(e) =>
                        setSelected({ ...selected, adults: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-slate-300 text-sm tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Children</label>
                    <input
                      type="number"
                      min={0}
                      value={selected.children}
                      onChange={(e) =>
                        setSelected({ ...selected, children: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 border border-slate-300 text-sm tabular-nums"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Guest Special Requests
                </label>
                <textarea
                  rows={2}
                  value={selected.specialRequests}
                  onChange={(e) =>
                    setSelected({ ...selected, specialRequests: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Internal Admin Notes
                </label>
                <textarea
                  rows={3}
                  maxLength={2000}
                  value={selected.adminNotes}
                  onChange={(e) => setSelected({ ...selected, adminNotes: e.target.value })}
                  placeholder="Room assignment, deposit notes, follow-up call summary..."
                  className="w-full px-3 py-2 border border-slate-300 text-sm bg-slate-50"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 text-sm text-slate-700 bg-slate-100 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Update Enquiry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Booking Enquiry"
        description={`Delete booking enquiry from ${deleteTarget?.guestName}? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
