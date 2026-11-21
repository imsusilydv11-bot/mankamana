import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowRight, Star } from 'lucide-react';
import { useHotel } from '../../context/HotelContext';
import { HeroPavilionCanvas } from '../../components/three/HeroPavilionCanvas';
import { Ambient3DBanner } from '../../components/three/Ambient3DBanner';
import { SmartImage } from '../../components/common/SmartImage';
import { TiltCard3D } from '../../components/common/TiltCard3D';
import { RoomCard } from '../../components/public/RoomCard';
import { GalleryLightbox } from '../../components/public/GalleryLightbox';
import { BirgunjLocationMap } from '../../components/maps/BirgunjLocationMap';
import { BookingEnquiryForm } from '../../components/public/BookingEnquiryForm';
import { FacilityIcon } from '../../components/common/FacilityIcon';

gsap.registerPlugin(ScrollTrigger);

export function HomePage() {
  const { settings, rooms, facilities, gallery, testimonials, t } = useHotel();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Mouse 3D Hero Parallax & Interactive Cursor Spotlight
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.5);
  const smoothX = useSpring(pointerX, { stiffness: 120, damping: 24 });
  const smoothY = useSpring(pointerY, { stiffness: 120, damping: 24 });

  const bgShiftX = useTransform(smoothX, [0, 1], [18, -18]);
  const bgShiftY = useTransform(smoothY, [0, 1], [12, -12]);
  const contentTiltX = useTransform(smoothY, [0, 1], [1.6, -1.6]);
  const contentTiltY = useTransform(smoothX, [0, 1], [-1.8, 1.8]);
  const spotX = useTransform(smoothX, [0, 1], ['15%', '85%']);
  const spotY = useTransform(smoothY, [0, 1], ['15%', '85%']);
  const heroSpotlight = useMotionTemplate`radial-gradient(620px circle at ${spotX} ${spotY}, rgba(200, 160, 85, 0.2), transparent 65%)`;

  const featuredRooms = rooms.filter((r) => r.isFeatured).slice(0, 3);
  const displayRooms = featuredRooms.length > 0 ? featuredRooms : rooms.slice(0, 3);

  const handleHeroPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    const rect = e.currentTarget.getBoundingClientRect();
    pointerX.set((e.clientX - rect.left) / Math.max(1, rect.width));
    pointerY.set((e.clientY - rect.top) / Math.max(1, rect.height));
  };

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !rootRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.hero-stagger', {
        y: 28,
        opacity: 0,
        duration: 0.9,
        stagger: 0.11,
        ease: 'power3.out',
        delay: 0.25,
      });

      gsap.to('.hero-parallax-img', {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.utils.toArray<HTMLElement>('.reveal-section').forEach((sec) => {
        gsap.from(sec, {
          y: 28,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sec,
            start: 'top 86%',
            once: true,
          },
        });

        const cards = sec.querySelectorAll('.stagger-item');
        if (cards.length > 0) {
          gsap.from(cards, {
            y: 24,
            opacity: 0,
            duration: 0.65,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sec,
              start: 'top 82%',
              once: true,
            },
          });
        }
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const whyChoosePillars = [
    {
      num: '01.',
      title: 'Prime Birgunj Location',
      text: 'Positioned with quiet access away from main road clatter while keeping transit hubs, business corridors, and border gateways close.',
    },
    {
      num: '02.',
      title: 'Architectural Stillness',
      text: 'Natural teak woodwork, acoustic wall detailing, and warm indirect illumination crafted for deep uninterrupted rest.',
    },
    {
      num: '03.',
      title: 'Round-the-Clock Care',
      text: '24-hour front desk support, gated courtyard parking, and attentive housekeeping tailored for solo executives and families.',
    },
    {
      num: '04.',
      title: 'Transparent NPR Rates',
      text: 'Clear nightly rates in Nepalese Rupees with personal desk confirmation and attentive arrival coordination.',
    },
  ];

  return (
    <div ref={rootRef} className="overflow-x-hidden">
      {/* 1. Full-Screen Cinematic 3D Hero with Mouse 3D Parallax */}
      <section
        onPointerMove={handleHeroPointerMove}
        className="hero-section relative min-h-screen flex items-end pb-16 pt-28 md:pb-24 bg-[#11100F] text-[#FAF9F6] overflow-hidden"
      >
        <motion.div
          style={{ x: bgShiftX, y: bgShiftY }}
          className="hero-parallax-img absolute -inset-6 will-change-transform"
        >
          <SmartImage
            src={settings.heroImageUrl}
            alt={settings.hotelName}
            fallbackLabel={settings.hotelName}
            priority
            className="w-full h-full object-cover opacity-80"
          />
        </motion.div>

        {/* Measured Contrast Scrim preserving twilight courtyard radiance while ensuring crisp text contrast */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#11100F] via-[#11100F]/65 to-[#11100F]/35"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#11100F]/75 via-[#11100F]/30 to-transparent"
        />

        {/* Mouse 3D Ambient Golden Light Plane */}
        <motion.div
          aria-hidden="true"
          style={{ background: heroSpotlight }}
          className="pointer-events-none absolute inset-0"
        />

        {/* Interactive 3D Architectural Pavilion & Kinetic Motes */}
        <HeroPavilionCanvas />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-5 md:px-8" style={{ perspective: 1200 }}>
          <motion.div
            style={{ rotateX: contentTiltX, rotateY: contentTiltY }}
            className="max-w-3xl will-change-transform"
          >
            <p className="hero-stagger text-xs sm:text-sm font-semibold tracking-[0.24em] text-[#FAF9F6] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] uppercase mb-3 flex items-center gap-3">
              <span className="inline-block w-6 h-[1.5px] bg-[#E8C57B] shrink-0" aria-hidden="true" />
              <span>{settings.hotelName} · {settings.locationLabel}</span>
            </p>
            <h1 className="hero-stagger font-display text-4xl sm:text-6xl lg:text-7xl font-medium leading-[1.06] tracking-tight text-[#FAF9F6] drop-shadow-[0_2px_14px_rgba(0,0,0,0.75)] [text-wrap:balance] mb-6">
              {settings.heroTitle}
            </h1>
            <p className="hero-stagger text-base sm:text-lg text-stone-100/95 leading-relaxed max-w-2xl mb-9 drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]">
              {settings.heroIntro}
            </p>

            <div className="hero-stagger flex flex-wrap items-center gap-4">
              <Link
                to="/rooms"
                className="cta-sheen group inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#C8A055] text-[#11100F] text-sm font-semibold hover:bg-[#DBB66D] transition-colors whitespace-nowrap"
              >
                <span>{t.hero.exploreRooms}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/book"
                className="inline-flex items-center justify-center px-7 py-3.5 border border-white/35 bg-[#11100F]/40 text-[#FAF9F6] text-sm font-medium hover:border-[#C8A055] hover:text-[#C8A055] transition-colors whitespace-nowrap"
              >
                {t.hero.bookYourStay}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Welcome & About Section on Pearl Alabaster */}
      <section className="reveal-section py-20 md:py-28 bg-[#FAF9F6] text-[#181614]">
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-center">
            <p className="text-xs tracking-[0.22em] uppercase text-[#8E682A] mb-3 font-medium">
              {t.sections.welcomeEyebrow}
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-medium leading-[1.1] [text-wrap:balance] mb-6">
              {settings.aboutHeading}
            </h2>
            <p className="text-base text-[#3D3731] leading-relaxed mb-5">
              {settings.aboutBody}
            </p>
            <p className="text-sm text-[#5C544C] leading-relaxed mb-8">
              {settings.hospitalityNote}
            </p>
            <div>
              <Link
                to="/about"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-[#181614] border-b border-[#181614]/35 pb-1 hover:text-[#8E682A] hover:border-[#8E682A] transition-colors"
              >
                <span>Discover Our Hospitality</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <TiltCard3D maxTilt={5} glareOpacity={0.14} className="h-full">
              <div className="w-full h-full min-h-[340px] lg:min-h-[460px] overflow-hidden bg-[#181614] border border-[#181614]/10">
                <SmartImage
                  src={settings.aboutImageUrl}
                  alt={settings.aboutHeading}
                  fallbackLabel={settings.hotelName}
                  className="w-full h-full object-cover"
                />
              </div>
            </TiltCard3D>
          </div>
        </div>
      </section>

      {/* 3. Featured Rooms on Warm Limestone */}
      <section className="reveal-section py-20 md:py-28 bg-[#F1EEE8]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-xs tracking-[0.22em] uppercase text-[#8E682A] mb-2 font-medium">
                Accommodations
              </p>
              <h2 className="font-display text-3xl sm:text-5xl font-medium text-[#181614] [text-wrap:balance]">
                {t.sections.featuredRoomsTitle}
              </h2>
              <p className="text-sm sm:text-base text-[#4A443E] mt-3 max-w-xl">
                {t.sections.featuredRoomsSubtitle}
              </p>
            </div>
            <Link
              to="/rooms"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[#181614] hover:text-[#8E682A] whitespace-nowrap"
            >
              <span>{t.sections.viewAllRooms}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {displayRooms.map((room) => (
              <div key={room.id} className="stagger-item h-full">
                <RoomCard room={room} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Hotel Facilities on Pure Silk White */}
      <section className="reveal-section py-20 md:py-28 bg-white text-[#181614]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-xs tracking-[0.22em] uppercase text-[#8E682A] mb-2 font-medium">
                Amenities & Services
              </p>
              <h2 className="font-display text-3xl sm:text-5xl font-medium [text-wrap:balance]">
                {t.sections.facilitiesTitle}
              </h2>
              <p className="text-sm sm:text-base text-[#4A443E] mt-3 max-w-xl">
                {t.sections.facilitiesSubtitle}
              </p>
            </div>
            <Link
              to="/facilities"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[#181614] hover:text-[#8E682A] whitespace-nowrap"
            >
              <span>All Facilities</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((fac) => (
              <div key={fac.id} className="stagger-item h-full">
                <TiltCard3D maxTilt={4.5} glareOpacity={0.14} className="h-full">
                  <div className="group h-full bg-[#FAF9F6] border border-[#181614]/10 p-7 hover:border-[#C8A055]/60 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-medium text-[#8E682A]">{fac.category}</span>
                      <FacilityIcon
                        name={fac.iconName}
                        className="w-5 h-5 text-[#181614] group-hover:text-[#C8A055] group-hover:scale-110 transition-all"
                      />
                    </div>
                    <h3 className="font-display text-2xl font-medium text-[#181614] mb-2">
                      {fac.name}
                    </h3>
                    <p className="text-sm text-[#4A443E] leading-relaxed">{fac.description}</p>
                  </div>
                </TiltCard3D>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Why Choose Us with Ambient Interactive 3D Brass & Light Sculpture */}
      <section className="reveal-section relative py-20 md:py-28 bg-[#181512] text-[#FAF9F6] overflow-hidden">
        <Ambient3DBanner />

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8">
          <div className="max-w-2xl mb-12">
            <p className="text-xs tracking-[0.22em] uppercase text-[#C8A055] mb-2">
              Birgunj Hospitality
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-medium [text-wrap:balance]">
              {t.sections.whyChooseTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {whyChoosePillars.map((pillar) => (
              <div
                key={pillar.num}
                className="stagger-item bg-[#161412]/88 border border-white/12 p-6 hover:border-[#C8A055]/60 transition-colors"
              >
                <p className="font-mono text-xs text-[#E8C57B] mb-3">{pillar.num}</p>
                <h3 className="font-display text-2xl font-medium text-[#FAF9F6] mb-2">{pillar.title}</h3>
                <p className="text-sm text-stone-300 leading-relaxed">{pillar.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Image Gallery Preview with Mouse 3D Cards */}
      <section className="reveal-section py-20 md:py-28 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-xs tracking-[0.22em] uppercase text-[#8E682A] mb-2 font-medium">
                Visual Archive
              </p>
              <h2 className="font-display text-3xl sm:text-5xl font-medium text-[#181614] [text-wrap:balance]">
                {t.sections.galleryTitle}
              </h2>
            </div>
            <Link
              to="/gallery"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-[#181614] hover:text-[#8E682A] whitespace-nowrap"
            >
              <span>Open Full Gallery</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.slice(0, 6).map((item, idx) => (
              <div key={item.id} className="stagger-item">
                <TiltCard3D maxTilt={6} glareOpacity={0.18}>
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    className="group relative w-full aspect-[4/3] overflow-hidden bg-[#181614] text-left cursor-pointer block border border-[#181614]/10"
                  >
                    <SmartImage
                      src={item.imageUrl}
                      alt={item.title}
                      fallbackLabel={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#11100F]/85 via-[#11100F]/20 to-transparent opacity-85 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-4 left-4 right-4 text-[#FAF9F6]">
                      <p className="text-xs text-[#C8A055]">{item.category}</p>
                      <p className="font-display text-xl">{item.title}</p>
                    </div>
                  </button>
                </TiltCard3D>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Guest Testimonials on Warm Limestone */}
      {testimonials.length > 0 && (
        <section className="reveal-section py-20 md:py-24 bg-[#F1EEE8] text-[#181614]">
          <div className="max-w-7xl mx-auto px-5 md:px-8">
            <div className="mb-12">
              <p className="text-xs tracking-[0.22em] uppercase text-[#8E682A] mb-2 font-medium">
                Verified Stays
              </p>
              <h2 className="font-display text-3xl sm:text-5xl font-medium [text-wrap:balance]">
                {t.sections.testimonialsTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {testimonials.slice(0, 3).map((item) => (
                <div key={item.id} className="stagger-item h-full">
                  <TiltCard3D maxTilt={4.5} glareOpacity={0.12} className="h-full">
                    <blockquote className="h-full bg-white border border-[#181614]/10 p-7 flex flex-col justify-between">
                      <div>
                        <div
                          className="flex items-center gap-1 text-[#C8A055] mb-4"
                          aria-label={`${item.rating} out of 5 stars`}
                        >
                          {Array.from({ length: item.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <p className="text-sm sm:text-base text-[#2E2925] leading-relaxed mb-6">
                          "{item.quote}"
                        </p>
                      </div>
                      <footer className="border-t border-[#181614]/10 pt-4">
                        <p className="font-medium text-sm text-[#181614]">{item.guestName}</p>
                        <p className="text-xs text-[#6B6257] mt-0.5">
                          {item.guestOrigin}
                          {item.stayType ? ` · ${item.stayType}` : ''}
                        </p>
                      </footer>
                    </blockquote>
                  </TiltCard3D>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. Location & Booking Enquiry */}
      <section className="reveal-section py-20 md:py-28 bg-[#FAF9F6]">
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-6">
            <p className="text-xs tracking-[0.22em] uppercase text-[#8E682A] mb-2 font-medium">
              Find Us
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-[#181614] mb-3">
              {settings.hotelName} · {t.sections.locationTitle}
            </h2>
            <p className="text-sm text-[#4A443E] mb-6">
              {settings.address || 'Birgunj, Nepal'}
            </p>

            <BirgunjLocationMap
              hotelName={settings.hotelName}
              address={settings.address}
              lat={settings.mapLat}
              lng={settings.mapLng}
              googleMapsUrl={settings.googleMapsUrl}
              directionsLabel={t.sections.getDirections}
            />
          </div>

          <div className="lg:col-span-6">
            <p className="text-xs tracking-[0.22em] uppercase text-[#8E682A] mb-2 font-medium">
              Reservations Desk
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-[#181614] mb-3">
              {t.sections.bookingEnquiryTitle}
            </h2>
            <p className="text-sm text-[#4A443E] mb-6">
              {t.sections.bookingEnquirySubtitle}
            </p>

            <BookingEnquiryForm />
          </div>
        </div>
      </section>

      <GalleryLightbox
        items={gallery}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}
