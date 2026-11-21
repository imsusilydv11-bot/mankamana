import { useEffect, useState } from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ToastProvider } from './components/common/Toast';
import { HotelProvider } from './context/HotelContext';
import { SeoHead } from './components/common/SeoHead';
import { PublicLayout } from './components/public/PublicLayout';
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { RoomsPage } from './pages/public/RoomsPage';
import { RoomDetailPage } from './pages/public/RoomDetailPage';
import { FacilitiesPage } from './pages/public/FacilitiesPage';
import { GalleryPage } from './pages/public/GalleryPage';
import { ContactPage } from './pages/public/ContactPage';
import { BookPage } from './pages/public/BookPage';
import { AdminShell } from './pages/admin/AdminShell';

function NotFoundView() {
  return (
    <div className="pt-28 pb-24 px-5 text-center max-w-xl mx-auto">
      <p className="text-xs uppercase tracking-[0.2em] text-[#8F7038] mb-3">
        Page Not Found
      </p>
      <h1 className="font-display text-4xl sm:text-5xl font-medium text-[#1B1917] mb-4">
        This corridor doesn&apos;t exist.
      </h1>
      <p className="text-sm text-stone-600 mb-8">
        The page you requested could not be found. Return to the main Mankamana Guest House experience or browse our rooms.
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link
          to="/"
          className="px-6 py-3 bg-[#0D0C0B] text-[#F8F5F0] text-sm font-medium hover:bg-stone-800 transition-colors"
        >
          Return Home
        </Link>
        <Link
          to="/rooms"
          className="px-6 py-3 border border-stone-300 text-sm font-medium hover:border-[#0D0C0B] transition-colors"
        >
          Explore Rooms
        </Link>
      </div>
    </div>
  );
}

function PublicRouteShell() {
  const location = useLocation();
  return (
    <PublicLayout>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/rooms/:id" element={<RoomDetailPage />} />
            <Route path="/facilities" element={<FacilitiesPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/book" element={<BookPage />} />
            <Route path="*" element={<NotFoundView />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </PublicLayout>
  );
}

export default function App() {
  const [mapsQuotaExceeded, setMapsQuotaExceeded] = useState(false);

  useEffect(() => {
    const onQuotaExceeded = () => setMapsQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', onQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', onQuotaExceeded);
  }, []);

  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <ToastProvider>
          <HotelProvider>
            {mapsQuotaExceeded && (
              <div
                role="alert"
                className="sticky top-0 z-[120] bg-amber-950 text-amber-50 border-b border-amber-700 px-4 py-2.5 text-xs flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2.5 flex-wrap">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Google Maps usage limit or key restriction reached. Review quota settings in{' '}
                    <a
                      href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-medium text-amber-200 hover:text-white"
                    >
                      Google Maps Platform Quota Guide
                    </a>
                    .
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMapsQuotaExceeded(false)}
                  aria-label="Dismiss maps warning"
                  className="text-amber-300 hover:text-white shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <BrowserRouter>
              <SeoHead />
              <Routes>
                <Route path="/admin/*" element={<AdminShell />} />
                <Route path="/*" element={<PublicRouteShell />} />
              </Routes>
            </BrowserRouter>
          </HotelProvider>
        </ToastProvider>
      </MotionConfig>
    </ErrorBoundary>
  );
}
