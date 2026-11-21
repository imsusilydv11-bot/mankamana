import { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Database, ArrowRight } from 'lucide-react';
import {
  BOOKING_STATUSES,
  BookingEnquiry,
  ContactMessage,
  Room,
} from '../../types/hotel';
import { seedInitialHotelDatabase } from '../../services/hotelService';
import { useToast } from '../../components/common/Toast';

interface AdminOverviewProps {
  rooms: Room[];
  hasLiveRooms: boolean;
  bookings: BookingEnquiry[];
  messages: ContactMessage[];
  onNavigate: (tab: string) => void;
}

export function AdminOverview({
  rooms,
  hasLiveRooms,
  bookings,
  messages,
  onNavigate,
}: AdminOverviewProps) {
  const { showToast } = useToast();
  const [seeding, setSeeding] = useState(false);

  const stats = useMemo(() => {
    const newEnquiries = bookings.filter((b) => b.status === 'New').length;
    const confirmedBookings = bookings.filter((b) => b.status === 'Confirmed').length;
    const availableRooms = rooms.filter((r) => r.isAvailable).length;
    const unreadMessages = messages.filter((m) => !m.isRead).length;
    return {
      totalEnquiries: bookings.length,
      newEnquiries,
      confirmedBookings,
      totalRooms: rooms.length,
      availableRooms,
      unreadMessages,
    };
  }, [bookings, rooms, messages]);

  const statusChartData = useMemo(() => {
    return BOOKING_STATUSES.map((status) => ({
      status,
      count: bookings.filter((b) => b.status === status).length,
    }));
  }, [bookings]);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await seedInitialHotelDatabase();
      showToast('Sample rooms, facilities, gallery, testimonials, and settings saved to Firestore.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to initialize Firestore data.', 'error');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      {!hasLiveRooms && (
        <div className="bg-amber-50 border border-amber-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-amber-950">
              Initialize Firestore Hotel Catalog
            </h2>
            <p className="text-xs text-amber-800 mt-1">
              Your Firestore database does not have live rooms saved yet. Populate starter rooms, facilities, gallery items, testimonials, and website settings into Firebase so you can edit or delete them directly.
            </p>
          </div>
          <button
            type="button"
            disabled={seeding}
            onClick={handleSeed}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 disabled:opacity-60 whitespace-nowrap shrink-0"
          >
            <Database className="w-4 h-4 text-[#C9A461]" />
            <span>{seeding ? 'Initializing...' : 'Initialize Hotel Data'}</span>
          </button>
        </div>
      )}

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 p-5">
          <p className="text-xs text-slate-500">Total Enquiries</p>
          <p className="font-mono text-2xl font-semibold text-slate-900 mt-2 tabular-nums">
            {stats.totalEnquiries}
          </p>
        </div>
        <div className="bg-white border border-slate-200 p-5">
          <p className="text-xs text-slate-500">New Enquiries</p>
          <p className="font-mono text-2xl font-semibold text-amber-700 mt-2 tabular-nums">
            {stats.newEnquiries}
          </p>
        </div>
        <div className="bg-white border border-slate-200 p-5">
          <p className="text-xs text-slate-500">Confirmed Bookings</p>
          <p className="font-mono text-2xl font-semibold text-emerald-700 mt-2 tabular-nums">
            {stats.confirmedBookings}
          </p>
        </div>
        <div className="bg-white border border-slate-200 p-5">
          <p className="text-xs text-slate-500">Total Rooms</p>
          <p className="font-mono text-2xl font-semibold text-slate-900 mt-2 tabular-nums">
            {stats.totalRooms}
          </p>
        </div>
        <div className="bg-white border border-slate-200 p-5">
          <p className="text-xs text-slate-500">Available Rooms</p>
          <p className="font-mono text-2xl font-semibold text-slate-900 mt-2 tabular-nums">
            {stats.availableRooms}
          </p>
        </div>
      </div>

      {/* Chart & Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-1">
            Enquiries by Status
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            Live breakdown across booking workflow stages
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusChartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="status" tick={{ fontSize: 11, fill: '#475569' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#475569' }} />
                <Tooltip />
                <Bar dataKey="count" fill="#0F172A" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Recent Enquiries</h2>
              <p className="text-xs text-slate-500">Latest guest reservation requests</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('bookings')}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 hover:text-slate-900"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {bookings.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500 border border-dashed border-slate-200">
              No booking enquiries received yet. Enquiries submitted on the public site appear here immediately.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs text-slate-500">
                    <th className="py-2.5 pr-4 font-medium">Guest</th>
                    <th className="py-2.5 pr-4 font-medium">Room</th>
                    <th className="py-2.5 pr-4 font-medium">Dates</th>
                    <th className="py-2.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.slice(0, 6).map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="py-3 pr-4">
                        <p className="font-medium text-slate-900">{b.guestName}</p>
                        <p className="text-xs text-slate-500 tabular-nums">{b.phone}</p>
                      </td>
                      <td className="py-3 pr-4 text-slate-700">{b.roomType}</td>
                      <td className="py-3 pr-4 font-mono text-xs text-slate-600 tabular-nums whitespace-nowrap">
                        {b.checkInDate} &rarr; {b.checkOutDate}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-block px-2 py-0.5 text-xs font-medium ${
                            b.status === 'Confirmed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : b.status === 'New'
                              ? 'bg-amber-50 text-amber-800'
                              : b.status === 'Cancelled'
                              ? 'bg-red-50 text-red-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
