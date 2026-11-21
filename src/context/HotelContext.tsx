import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, BOOTSTRAPPED_ADMIN_EMAIL, db } from '../lib/firebase';
import {
  DEFAULT_SETTINGS,
  SAMPLE_FACILITIES,
  SAMPLE_GALLERY,
  SAMPLE_ROOMS,
  SAMPLE_TESTIMONIALS,
} from '../lib/seedData';
import {
  subscribeFacilities,
  subscribeGallery,
  subscribeRooms,
  subscribeSettings,
  subscribeTestimonials,
} from '../services/hotelService';
import { translations, TranslationDictionary } from '../i18n/translations';
import {
  Facility,
  GalleryItem,
  LanguageCode,
  Room,
  Testimonial,
  WebsiteSettings,
} from '../types/hotel';

interface HotelContextValue {
  settings: WebsiteSettings;
  hasLiveSettings: boolean;
  rooms: Room[];
  hasLiveRooms: boolean;
  facilities: Facility[];
  gallery: GalleryItem[];
  testimonials: Testimonial[];
  loading: boolean;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: TranslationDictionary;
  user: User | null;
  isAdmin: boolean;
  authReady: boolean;
}

const HotelContext = createContext<HotelContextValue | null>(null);

export function HotelProvider({ children }: { children: React.ReactNode }) {
  const [liveSettings, setLiveSettings] = useState<WebsiteSettings | null>(null);
  const [liveRooms, setLiveRooms] = useState<Room[]>([]);
  const [liveFacilities, setLiveFacilities] = useState<Facility[]>([]);
  const [liveGallery, setLiveGallery] = useState<GalleryItem[]>([]);
  const [liveTestimonials, setLiveTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<LanguageCode>('en');

  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  // Auth listener & admin role check
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setIsAdmin(false);
        setAuthReady(true);
        return;
      }

      const emailVerified = currentUser.emailVerified;
      const isBootstrapped =
        emailVerified && currentUser.email?.toLowerCase() === BOOTSTRAPPED_ADMIN_EMAIL.toLowerCase();

      if (isBootstrapped) {
        setIsAdmin(true);
        setAuthReady(true);
        return;
      }

      if (emailVerified) {
        try {
          const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid));
          setIsAdmin(adminDoc.exists());
        } catch {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  // Public Firestore listeners
  useEffect(() => {
    let loadedCount = 0;
    const markLoaded = () => {
      loadedCount += 1;
      if (loadedCount >= 2) setLoading(false);
    };

    const unsubSettings = subscribeSettings((data) => {
      setLiveSettings(data);
      if (data?.defaultLanguage) {
        setLanguage((prev) => prev || data.defaultLanguage);
      }
      markLoaded();
    });

    const unsubRooms = subscribeRooms((data) => {
      setLiveRooms(data);
      markLoaded();
    });

    const unsubFacilities = subscribeFacilities(true, setLiveFacilities);
    const unsubGallery = subscribeGallery(true, setLiveGallery);
    const unsubTestimonials = subscribeTestimonials(true, setLiveTestimonials);

    return () => {
      unsubSettings();
      unsubRooms();
      unsubFacilities();
      unsubGallery();
      unsubTestimonials();
    };
  }, []);

  // Dynamic document title & meta description updates from WebsiteSettings
  const settings = useMemo(() => {
    const base = liveSettings || DEFAULT_SETTINGS;
    if (base.heroImageUrl?.includes('hero_mankamana_exterior_1795256701619')) {
      return {
        ...base,
        heroImageUrl: DEFAULT_SETTINGS.heroImageUrl,
      };
    }
    return base;
  }, [liveSettings]);

  // Dynamic SEO title, description, OpenGraph, and JSON-LD are managed per-route by SeoHead

  const rooms = useMemo<Room[]>(() => {
    if (liveRooms.length > 0) return liveRooms;
    return SAMPLE_ROOMS.map((r, i) => ({ ...r, id: `sample-room-${i + 1}` }));
  }, [liveRooms]);

  const facilities = useMemo<Facility[]>(() => {
    const base =
      liveFacilities.length > 0
        ? liveFacilities
        : SAMPLE_FACILITIES.map((f, i) => ({ ...f, id: `sample-fac-${i + 1}` }));
    return settings.diningEnabled
      ? base
      : base.filter((f) => !f.category.toLowerCase().includes('dining') && !f.category.toLowerCase().includes('restaurant'));
  }, [liveFacilities, settings.diningEnabled]);

  const gallery = useMemo<GalleryItem[]>(() => {
    const base =
      liveGallery.length > 0
        ? liveGallery
        : SAMPLE_GALLERY.map((g, i) => ({ ...g, id: `sample-gal-${i + 1}` }));
    return base.map((item) =>
      item.imageUrl?.includes('hero_mankamana_exterior_1795256701619')
        ? { ...item, imageUrl: DEFAULT_SETTINGS.heroImageUrl }
        : item
    );
  }, [liveGallery]);

  const testimonials = useMemo<Testimonial[]>(() => {
    if (liveTestimonials.length > 0) return liveTestimonials;
    return SAMPLE_TESTIMONIALS.map((tItem, i) => ({ ...tItem, id: `sample-test-${i + 1}` }));
  }, [liveTestimonials]);

  const value: HotelContextValue = {
    settings,
    hasLiveSettings: liveSettings !== null,
    rooms,
    hasLiveRooms: liveRooms.length > 0,
    facilities,
    gallery,
    testimonials,
    loading,
    language,
    setLanguage,
    t: translations[language],
    user,
    isAdmin,
    authReady,
  };

  return <HotelContext.Provider value={value}>{children}</HotelContext.Provider>;
}

export function useHotel() {
  const ctx = useContext(HotelContext);
  if (!ctx) throw new Error('useHotel must be used inside HotelProvider');
  return ctx;
}
