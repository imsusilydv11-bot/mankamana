import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  Images,
  Sparkles,
  Quote,
  FileEdit,
  Settings as SettingsIcon,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { auth } from '../../lib/firebase';
import { useHotel } from '../../context/HotelContext';
import {
  subscribeAdmins,
  subscribeBookings,
  subscribeContactMessages,
  subscribeFacilities,
  subscribeGallery,
  subscribeTestimonials,
} from '../../services/hotelService';
import {
  AdminUser,
  BookingEnquiry,
  ContactMessage,
  Facility,
  GalleryItem,
  Testimonial,
} from '../../types/hotel';
import { AdminLoginPage } from './AdminLoginPage';
import { AdminOverview } from './AdminOverview';
import { AdminRooms } from './AdminRooms';
import { AdminBookings } from './AdminBookings';
import { AdminGallery } from './AdminGallery';
import { AdminFacilities } from './AdminFacilities';
import { AdminTestimonials } from './AdminTestimonials';
import { AdminContent } from './AdminContent';
import { AdminSettings } from './AdminSettings';
import { AdminMessages } from './AdminMessages';

type AdminTab =
  | 'overview'
  | 'rooms'
  | 'bookings'
  | 'gallery'
  | 'facilities'
  | 'testimonials'
  | 'content'
  | 'settings'
  | 'messages';

export function AdminShell() {
  const { authReady, user, isAdmin, rooms, hasLiveRooms, settings } = useHotel();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [bookings, setBookings] = useState<BookingEnquiry[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [adminGallery, setAdminGallery] = useState<GalleryItem[]>([]);
  const [adminFacilities, setAdminFacilities] = useState<Facility[]>([]);
  const [adminTestimonials, setAdminTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    if (!authReady || !user || !isAdmin) return;

    const unsubBookings = subscribeBookings(setBookings);
    const unsubMessages = subscribeContactMessages(setMessages);
    const unsubAdmins = subscribeAdmins(setAdmins);
    const unsubGallery = subscribeGallery(false, setAdminGallery);
    const unsubFacilities = subscribeFacilities(false, setAdminFacilities);
    const unsubTestimonials = subscribeTestimonials(false, setAdminTestimonials);

    return () => {
      unsubBookings();
      unsubMessages();
      unsubAdmins();
      unsubGallery();
      unsubFacilities();
      unsubTestimonials();
    };
  }, [authReady, user, isAdmin]);

  if (!authReady) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm text-slate-600">
        Verifying administrator session...
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <AdminLoginPage />;
  }

  const newBookingsCount = bookings.filter((b) => b.status === 'New').length;
  const unreadMessagesCount = messages.filter((m) => !m.isRead).length;

  const navItems: Array<{
    id: AdminTab;
    label: string;
    icon: typeof LayoutDashboard;
    badge?: number;
  }> = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'rooms', label: 'Rooms', icon: BedDouble },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck, badge: newBookingsCount },
    { id: 'gallery', label: 'Gallery', icon: Images },
    { id: 'facilities', label: 'Facilities', icon: Sparkles },
    { id: 'testimonials', label: 'Testimonials', icon: Quote },
    { id: 'content', label: 'Website Content', icon: FileEdit },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: unreadMessagesCount },
  ];

  const currentNav = navItems.find((item) => item.id === activeTab);

  const handleSelectTab = (tab: AdminTab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[#0F172A] text-slate-100 flex flex-col transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="px-5 py-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#C9A461]">
              Admin Portal
            </p>
            <h2 className="font-display text-lg font-medium text-white truncate max-w-[175px]">
              {settings.hotelName}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-slate-800 text-[#C9A461]'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </span>
                {item.badge && item.badge > 0 ? (
                  <span className="px-1.5 py-0.5 bg-[#C9A461] text-[#0F172A] text-[11px] font-mono font-semibold tabular-nums">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800 space-y-1">
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Public Website</span>
          </Link>
          <button
            type="button"
            onClick={() => void signOut(auth)}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs text-red-300 hover:bg-slate-800 hover:text-red-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="bg-white border-b border-slate-200 px-5 lg:px-8 h-16 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              className="lg:hidden p-2 -ml-2 text-slate-700 hover:text-slate-900"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-slate-900">
              {currentNav?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span className="hidden sm:inline truncate max-w-[220px]">{user.email}</span>
          </div>
        </header>

        <main className="flex-1 p-5 lg:p-8">
          {activeTab === 'overview' && (
            <AdminOverview
              rooms={rooms}
              hasLiveRooms={hasLiveRooms}
              bookings={bookings}
              messages={messages}
              onNavigate={(tab) => setActiveTab(tab as AdminTab)}
            />
          )}
          {activeTab === 'rooms' && (
            <AdminRooms rooms={rooms} hasLiveRooms={hasLiveRooms} />
          )}
          {activeTab === 'bookings' && (
            <AdminBookings bookings={bookings} rooms={rooms} />
          )}
          {activeTab === 'gallery' && <AdminGallery items={adminGallery} />}
          {activeTab === 'facilities' && <AdminFacilities items={adminFacilities} />}
          {activeTab === 'testimonials' && <AdminTestimonials items={adminTestimonials} />}
          {activeTab === 'content' && <AdminContent settings={settings} />}
          {activeTab === 'settings' && (
            <AdminSettings settings={settings} admins={admins} />
          )}
          {activeTab === 'messages' && <AdminMessages messages={messages} />}
        </main>
      </div>
    </div>
  );
}
