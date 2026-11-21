import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { Menu, X, Globe, MapPin, Phone, Mail } from 'lucide-react';
import { useHotel } from '../../context/HotelContext';
import { Preloader } from '../common/Preloader';
import { MouseCursorEffect } from '../common/MouseCursorEffect';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const { settings, language, setLanguage, t } = useHotel();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
    });

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const headerSolid = !isHome || scrolled || mobileMenuOpen;

  const navLinks = [
    { to: '/rooms', label: t.nav.rooms },
    { to: '/facilities', label: t.nav.facilities },
    { to: '/gallery', label: t.nav.gallery },
    { to: '/about', label: t.nav.about },
    { to: '/contact', label: t.nav.contact },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#181614] overflow-x-clip">
      <Preloader hotelName={settings.hotelName} />
      <MouseCursorEffect />

      {/* Strict 3-Zone Top Bar Contract */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
          headerSolid
            ? 'bg-[#11100F]/95 border-b border-white/10 text-[#FAF9F6]'
            : 'bg-gradient-to-b from-[#11100F]/80 to-transparent text-[#FAF9F6]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 md:h-20 flex items-center justify-between gap-8">
          <Link
            to="/"
            className="font-display text-xl md:text-2xl tracking-wide font-semibold whitespace-nowrap shrink-0 hover:text-[#C8A055] transition-colors"
          >
            {settings.hotelName}
          </Link>

          <nav className="hidden lg:flex items-center gap-7" aria-label="Main navigation">
            {navLinks.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`text-sm font-medium whitespace-nowrap shrink-0 transition-colors relative py-1 group ${
                    active ? 'text-[#C8A055]' : 'text-stone-200 hover:text-white'
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute left-0 right-0 bottom-0 h-[1px] bg-[#C8A055] transition-transform duration-300 origin-left ${
                      active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/book"
              className="cta-sheen hidden sm:inline-flex items-center justify-center px-5 py-2.5 bg-[#C8A055] text-[#11100F] text-xs font-semibold tracking-wide hover:bg-[#DBB66D] transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.bookStay}
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-[#FAF9F6] border border-white/15 hover:border-[#C8A055] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#11100F] border-t border-white/10 px-5 py-6 space-y-2">
            <Link
              to="/"
              className="block py-3 text-base font-medium text-stone-200 hover:text-[#C8A055] border-b border-white/10"
            >
              {t.nav.home}
            </Link>
            {navLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block py-3 text-base font-medium text-stone-200 hover:text-[#C8A055] border-b border-white/10"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4">
              <Link
                to="/book"
                className="cta-sheen block w-full text-center py-3.5 bg-[#C8A055] text-[#11100F] text-sm font-semibold"
              >
                {t.nav.bookStay}
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      {/* Quiet Editorial Footer */}
      <footer className="bg-[#11100F] text-[#FAF9F6] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <p className="text-xs tracking-[0.2em] uppercase text-[#C8A055] mb-2">
              {settings.locationLabel}
            </p>
            <h2 className="font-display text-3xl font-medium mb-3">{settings.hotelName}</h2>
            <p className="text-sm text-stone-400 leading-relaxed max-w-md mb-6">
              {settings.footerNote}
            </p>

            <div className="inline-flex items-center gap-2 border border-white/15 p-1">
              <Globe className="w-3.5 h-3.5 text-[#C8A055] ml-2" />
              <span className="text-xs text-stone-400 mr-1">{t.footer.languageLabel}:</span>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                  language === 'en' ? 'bg-[#C8A055] text-[#11100F]' : 'text-stone-300 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('ne')}
                className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                  language === 'ne' ? 'bg-[#C8A055] text-[#11100F]' : 'text-stone-300 hover:text-white'
                }`}
              >
                नेपाली
              </button>
            </div>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-xs uppercase tracking-[0.18em] text-[#C8A055] mb-4">
              {t.footer.navigation}
            </h3>
            <ul className="space-y-2.5 text-sm text-stone-300">
              <li><Link to="/" className="hover:text-[#C8A055] transition-colors">{t.nav.home}</Link></li>
              <li><Link to="/rooms" className="hover:text-[#C8A055] transition-colors">{t.nav.rooms}</Link></li>
              <li><Link to="/facilities" className="hover:text-[#C8A055] transition-colors">{t.nav.facilities}</Link></li>
              <li><Link to="/gallery" className="hover:text-[#C8A055] transition-colors">{t.nav.gallery}</Link></li>
              <li><Link to="/about" className="hover:text-[#C8A055] transition-colors">{t.nav.about}</Link></li>
              <li><Link to="/book" className="hover:text-[#C8A055] transition-colors">{t.nav.bookStay}</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-xs uppercase tracking-[0.18em] text-[#C8A055] mb-4">
              {t.footer.contact}
            </h3>
            <div className="space-y-3 text-sm text-stone-300">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C8A055] shrink-0 mt-0.5" />
                <span>{settings.address || 'Birgunj, Nepal'}</span>
              </p>
              {settings.phone ? (
                <p className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#C8A055] shrink-0" />
                  <a href={`tel:${settings.phone}`} className="hover:text-[#C8A055] tabular-nums">
                    {settings.phone}
                  </a>
                </p>
              ) : null}
              {settings.email ? (
                <p className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#C8A055] shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:text-[#C8A055]">
                    {settings.email}
                  </a>
                </p>
              ) : null}
              {!settings.phone && !settings.email && (
                <p className="text-xs text-stone-500">
                  Direct phone & email can be configured by hotel management in Website Content.
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center gap-4 text-xs text-stone-400">
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C8A055]"
                >
                  Facebook
                </a>
              )}
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#C8A055]"
                >
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-5 md:px-8 py-5 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500">
            <p>© {new Date().getFullYear()} {settings.hotelName}. All rights reserved.</p>
            <Link to="/admin" className="hover:text-[#C8A055] transition-colors">
              {t.footer.managementPortal}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
