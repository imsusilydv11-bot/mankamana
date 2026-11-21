import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import {
  db,
  handleFirestoreError,
  OperationType,
  storage,
} from '../lib/firebase';
import {
  DEFAULT_SETTINGS,
  SAMPLE_FACILITIES,
  SAMPLE_GALLERY,
  SAMPLE_ROOMS,
  SAMPLE_TESTIMONIALS,
} from '../lib/seedData';
import {
  AdminUser,
  BookingEnquiry,
  BookingStatus,
  ContactMessage,
  Facility,
  GalleryItem,
  Room,
  Testimonial,
  WebsiteSettings,
} from '../types/hotel';

function clampStr(value: string, max: number): string {
  return value.trim().slice(0, max);
}

export function slugify(text: string): string {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
  return base || `room-${Date.now()}`;
}

// ==========================================
// SETTINGS
// ==========================================

export function subscribeSettings(
  onData: (settings: WebsiteSettings | null) => void
) {
  const settingsRef = doc(db, 'websiteSettings', 'main');
  return onSnapshot(
    settingsRef,
    (snap) => {
      if (snap.exists()) {
        onData({ ...DEFAULT_SETTINGS, ...(snap.data() as WebsiteSettings) });
      } else {
        onData(null);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'websiteSettings/main');
    }
  );
}

export async function saveSettings(settings: Partial<WebsiteSettings>) {
  const path = 'websiteSettings/main';
  try {
    const payload: Record<string, unknown> = {
      hotelName: clampStr(settings.hotelName || DEFAULT_SETTINGS.hotelName, 120),
      tagline: clampStr(settings.tagline ?? DEFAULT_SETTINGS.tagline, 160),
      locationLabel: clampStr(settings.locationLabel ?? DEFAULT_SETTINGS.locationLabel, 100),
      heroTitle: clampStr(settings.heroTitle || DEFAULT_SETTINGS.heroTitle, 180),
      heroSubtitle: clampStr(settings.heroSubtitle ?? DEFAULT_SETTINGS.heroSubtitle, 240),
      heroIntro: clampStr(settings.heroIntro ?? DEFAULT_SETTINGS.heroIntro, 800),
      heroImageUrl: clampStr(settings.heroImageUrl ?? DEFAULT_SETTINGS.heroImageUrl, 1000),
      aboutTitle: clampStr(settings.aboutTitle ?? DEFAULT_SETTINGS.aboutTitle, 160),
      aboutHeading: clampStr(settings.aboutHeading ?? DEFAULT_SETTINGS.aboutHeading, 180),
      aboutBody: clampStr(settings.aboutBody ?? DEFAULT_SETTINGS.aboutBody, 3000),
      hospitalityNote: clampStr(settings.hospitalityNote ?? DEFAULT_SETTINGS.hospitalityNote, 1500),
      comfortNote: clampStr(settings.comfortNote ?? DEFAULT_SETTINGS.comfortNote, 1500),
      aboutImageUrl: clampStr(settings.aboutImageUrl ?? DEFAULT_SETTINGS.aboutImageUrl, 1000),
      phone: clampStr(settings.phone ?? '', 60),
      whatsapp: clampStr(settings.whatsapp ?? '', 60),
      email: clampStr(settings.email ?? '', 160),
      address: clampStr(settings.address ?? DEFAULT_SETTINGS.address, 300),
      googleMapsUrl: clampStr(settings.googleMapsUrl ?? DEFAULT_SETTINGS.googleMapsUrl, 1000),
      mapLat: Number.isFinite(Number(settings.mapLat)) ? Number(settings.mapLat) : 27.0104,
      mapLng: Number.isFinite(Number(settings.mapLng)) ? Number(settings.mapLng) : 84.8774,
      facebookUrl: clampStr(settings.facebookUrl ?? '', 500),
      instagramUrl: clampStr(settings.instagramUrl ?? '', 500),
      currency: clampStr(settings.currency || 'NPR', 12),
      defaultLanguage: settings.defaultLanguage === 'ne' ? 'ne' : 'en',
      seoTitle: clampStr(settings.seoTitle ?? DEFAULT_SETTINGS.seoTitle, 120),
      seoDescription: clampStr(settings.seoDescription ?? DEFAULT_SETTINGS.seoDescription, 320),
      diningEnabled: Boolean(settings.diningEnabled),
      bookingNotice: clampStr(settings.bookingNotice ?? DEFAULT_SETTINGS.bookingNotice, 600),
      footerNote: clampStr(settings.footerNote ?? DEFAULT_SETTINGS.footerNote, 400),
      updatedAt: serverTimestamp(),
    };
    await setDoc(doc(db, 'websiteSettings', 'main'), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// ==========================================
// ROOMS
// ==========================================

export function subscribeRooms(onData: (rooms: Room[]) => void) {
  const q = query(collection(db, 'rooms'), orderBy('displayOrder', 'asc'));
  return onSnapshot(
    q,
    (snap) => {
      onData(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Room, 'id'>) })));
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'rooms');
    }
  );
}

export async function getRoomById(id: string): Promise<Room | null> {
  try {
    const snap = await getDoc(doc(db, 'rooms', id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...(snap.data() as Omit<Room, 'id'>) };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `rooms/${id}`);
  }
}

export async function createRoom(data: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const payload = {
      name: clampStr(data.name, 120),
      slug: slugify(data.slug || data.name),
      type: clampStr(data.type, 60),
      description: clampStr(data.description, 3000),
      priceNpr: Math.max(0, Math.min(1000000, Number(data.priceNpr) || 0)),
      maxGuests: Math.max(1, Math.min(20, Math.round(Number(data.maxGuests) || 2))),
      bedType: clampStr(data.bedType, 80),
      sizeSqFt: Math.max(50, Math.min(10000, Math.round(Number(data.sizeSqFt) || 250))),
      amenities: data.amenities.map((a) => clampStr(a, 80)).filter(Boolean).slice(0, 20),
      images: data.images.map((i) => clampStr(i, 1000)).filter(Boolean).slice(0, 10),
      isAvailable: Boolean(data.isAvailable),
      isFeatured: Boolean(data.isFeatured),
      displayOrder: Math.max(0, Math.min(1000, Math.round(Number(data.displayOrder) || 0))),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, 'rooms'), payload);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'rooms');
  }
}

export async function updateRoom(id: string, data: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    await updateDoc(doc(db, 'rooms', id), {
      name: clampStr(data.name, 120),
      slug: slugify(data.slug || data.name),
      type: clampStr(data.type, 60),
      description: clampStr(data.description, 3000),
      priceNpr: Math.max(0, Math.min(1000000, Number(data.priceNpr) || 0)),
      maxGuests: Math.max(1, Math.min(20, Math.round(Number(data.maxGuests) || 2))),
      bedType: clampStr(data.bedType, 80),
      sizeSqFt: Math.max(50, Math.min(10000, Math.round(Number(data.sizeSqFt) || 250))),
      amenities: data.amenities.map((a) => clampStr(a, 80)).filter(Boolean).slice(0, 20),
      images: data.images.map((i) => clampStr(i, 1000)).filter(Boolean).slice(0, 10),
      isAvailable: Boolean(data.isAvailable),
      isFeatured: Boolean(data.isFeatured),
      displayOrder: Math.max(0, Math.min(1000, Math.round(Number(data.displayOrder) || 0))),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `rooms/${id}`);
  }
}

export async function deleteRoom(id: string) {
  try {
    await deleteDoc(doc(db, 'rooms', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `rooms/${id}`);
  }
}

// ==========================================
// BOOKINGS
// ==========================================

export async function submitBookingEnquiry(input: {
  guestName: string;
  phone: string;
  email: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  roomId: string;
  roomType: string;
  specialRequests: string;
}) {
  try {
    const payload = {
      guestName: clampStr(input.guestName, 120),
      phone: clampStr(input.phone, 30),
      email: clampStr(input.email, 160),
      checkInDate: clampStr(input.checkInDate, 10),
      checkOutDate: clampStr(input.checkOutDate, 10),
      adults: Math.max(1, Math.min(20, Math.round(Number(input.adults) || 1))),
      children: Math.max(0, Math.min(20, Math.round(Number(input.children) || 0))),
      roomId: clampStr(input.roomId || 'general', 128),
      roomType: clampStr(input.roomType, 120),
      specialRequests: clampStr(input.specialRequests || '', 1500),
      status: 'New' as BookingStatus,
      adminNotes: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, 'bookings'), payload);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'bookings');
  }
}

export function subscribeBookings(onData: (bookings: BookingEnquiry[]) => void) {
  const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      onData(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<BookingEnquiry, 'id'>) })));
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'bookings');
    }
  );
}

export async function updateBooking(
  id: string,
  data: {
    guestName: string;
    phone: string;
    email: string;
    checkInDate: string;
    checkOutDate: string;
    adults: number;
    children: number;
    roomId: string;
    roomType: string;
    specialRequests: string;
    status: BookingStatus;
    adminNotes: string;
  }
) {
  try {
    await updateDoc(doc(db, 'bookings', id), {
      guestName: clampStr(data.guestName, 120),
      phone: clampStr(data.phone, 30),
      email: clampStr(data.email, 160),
      checkInDate: clampStr(data.checkInDate, 10),
      checkOutDate: clampStr(data.checkOutDate, 10),
      adults: Math.max(1, Math.min(20, Math.round(Number(data.adults) || 1))),
      children: Math.max(0, Math.min(20, Math.round(Number(data.children) || 0))),
      roomId: clampStr(data.roomId || 'general', 128),
      roomType: clampStr(data.roomType, 120),
      specialRequests: clampStr(data.specialRequests || '', 1500),
      status: data.status,
      adminNotes: clampStr(data.adminNotes || '', 2000),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `bookings/${id}`);
  }
}

export async function deleteBooking(id: string) {
  try {
    await deleteDoc(doc(db, 'bookings', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `bookings/${id}`);
  }
}

// ==========================================
// GALLERY
// ==========================================

export function subscribeGallery(
  publicOnly: boolean,
  onData: (items: GalleryItem[]) => void
) {
  const base = collection(db, 'gallery');
  const q = publicOnly
    ? query(base, where('isEnabled', '==', true))
    : query(base, orderBy('displayOrder', 'asc'));

  return onSnapshot(
    q,
    (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<GalleryItem, 'id'>) }));
      rows.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
      onData(rows);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'gallery');
    }
  );
}

export async function createGalleryItem(data: Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    await addDoc(collection(db, 'gallery'), {
      title: clampStr(data.title, 120),
      category: data.category,
      imageUrl: clampStr(data.imageUrl, 1000),
      caption: clampStr(data.caption || '', 400),
      displayOrder: Math.max(0, Math.min(1000, Math.round(Number(data.displayOrder) || 0))),
      isEnabled: Boolean(data.isEnabled),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'gallery');
  }
}

export async function updateGalleryItem(
  id: string,
  data: Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt'>
) {
  try {
    await updateDoc(doc(db, 'gallery', id), {
      title: clampStr(data.title, 120),
      category: data.category,
      imageUrl: clampStr(data.imageUrl, 1000),
      caption: clampStr(data.caption || '', 400),
      displayOrder: Math.max(0, Math.min(1000, Math.round(Number(data.displayOrder) || 0))),
      isEnabled: Boolean(data.isEnabled),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `gallery/${id}`);
  }
}

export async function deleteGalleryItem(id: string) {
  try {
    await deleteDoc(doc(db, 'gallery', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `gallery/${id}`);
  }
}

// ==========================================
// FACILITIES
// ==========================================

export function subscribeFacilities(
  publicOnly: boolean,
  onData: (items: Facility[]) => void
) {
  const base = collection(db, 'facilities');
  const q = publicOnly
    ? query(base, where('isEnabled', '==', true))
    : query(base, orderBy('displayOrder', 'asc'));

  return onSnapshot(
    q,
    (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Facility, 'id'>) }));
      rows.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
      onData(rows);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'facilities');
    }
  );
}

export async function createFacility(data: Omit<Facility, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    await addDoc(collection(db, 'facilities'), {
      name: clampStr(data.name, 100),
      category: clampStr(data.category, 60),
      description: clampStr(data.description, 1000),
      iconName: clampStr(data.iconName || 'Sparkles', 50),
      imageUrl: clampStr(data.imageUrl || '', 1000),
      isEnabled: Boolean(data.isEnabled),
      displayOrder: Math.max(0, Math.min(1000, Math.round(Number(data.displayOrder) || 0))),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'facilities');
  }
}

export async function updateFacility(
  id: string,
  data: Omit<Facility, 'id' | 'createdAt' | 'updatedAt'>
) {
  try {
    await updateDoc(doc(db, 'facilities', id), {
      name: clampStr(data.name, 100),
      category: clampStr(data.category, 60),
      description: clampStr(data.description, 1000),
      iconName: clampStr(data.iconName || 'Sparkles', 50),
      imageUrl: clampStr(data.imageUrl || '', 1000),
      isEnabled: Boolean(data.isEnabled),
      displayOrder: Math.max(0, Math.min(1000, Math.round(Number(data.displayOrder) || 0))),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `facilities/${id}`);
  }
}

export async function deleteFacility(id: string) {
  try {
    await deleteDoc(doc(db, 'facilities', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `facilities/${id}`);
  }
}

// ==========================================
// TESTIMONIALS
// ==========================================

export function subscribeTestimonials(
  publicOnly: boolean,
  onData: (items: Testimonial[]) => void
) {
  const base = collection(db, 'testimonials');
  const q = publicOnly
    ? query(base, where('isEnabled', '==', true))
    : query(base, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Testimonial, 'id'>) }));
      onData(rows);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'testimonials');
    }
  );
}

export async function createTestimonial(
  data: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>
) {
  try {
    await addDoc(collection(db, 'testimonials'), {
      guestName: clampStr(data.guestName, 100),
      guestOrigin: clampStr(data.guestOrigin || '', 100),
      rating: Math.max(1, Math.min(5, Math.round(Number(data.rating) || 5))),
      quote: clampStr(data.quote, 1000),
      stayType: clampStr(data.stayType || '', 80),
      isEnabled: Boolean(data.isEnabled),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'testimonials');
  }
}

export async function updateTestimonial(
  id: string,
  data: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>
) {
  try {
    await updateDoc(doc(db, 'testimonials', id), {
      guestName: clampStr(data.guestName, 100),
      guestOrigin: clampStr(data.guestOrigin || '', 100),
      rating: Math.max(1, Math.min(5, Math.round(Number(data.rating) || 5))),
      quote: clampStr(data.quote, 1000),
      stayType: clampStr(data.stayType || '', 80),
      isEnabled: Boolean(data.isEnabled),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `testimonials/${id}`);
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await deleteDoc(doc(db, 'testimonials', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `testimonials/${id}`);
  }
}

// ==========================================
// CONTACT MESSAGES
// ==========================================

export async function submitContactMessage(input: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  try {
    await addDoc(collection(db, 'contactMessages'), {
      name: clampStr(input.name, 120),
      email: clampStr(input.email, 160),
      phone: clampStr(input.phone || '', 30),
      subject: clampStr(input.subject, 160),
      message: clampStr(input.message, 2000),
      isRead: false,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'contactMessages');
  }
}

export function subscribeContactMessages(onData: (items: ContactMessage[]) => void) {
  const q = query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      onData(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ContactMessage, 'id'>) })));
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'contactMessages');
    }
  );
}

export async function markContactMessageRead(id: string, isRead: boolean) {
  try {
    await updateDoc(doc(db, 'contactMessages', id), { isRead });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `contactMessages/${id}`);
  }
}

export async function deleteContactMessage(id: string) {
  try {
    await deleteDoc(doc(db, 'contactMessages', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `contactMessages/${id}`);
  }
}

// ==========================================
// ADMINS WHITELIST
// ==========================================

export function subscribeAdmins(onData: (items: AdminUser[]) => void) {
  return onSnapshot(
    collection(db, 'admins'),
    (snap) => {
      onData(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<AdminUser, 'id'>) })));
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'admins');
    }
  );
}

export async function addAdminUser(uid: string, email: string, name: string) {
  const cleanUid = clampStr(uid, 128);
  try {
    await setDoc(doc(db, 'admins', cleanUid), {
      email: clampStr(email, 160),
      name: clampStr(name, 100),
      role: 'admin',
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `admins/${cleanUid}`);
  }
}

export async function removeAdminUser(uid: string) {
  try {
    await deleteDoc(doc(db, 'admins', uid));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `admins/${uid}`);
  }
}

// ==========================================
// FIREBASE STORAGE UPLOAD
// ==========================================

export function uploadHotelImage(
  file: File,
  folder: 'rooms' | 'gallery' | 'facilities' | 'branding',
  onProgress?: (pct: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `hotel/${folder}/${Date.now()}_${safeName}`;
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file, {
      contentType: file.type || 'image/jpeg',
    });

    task.on(
      'state_changed',
      (snapshot) => {
        if (onProgress && snapshot.totalBytes > 0) {
          onProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
        }
      },
      (err) => {
        reject(err);
      },
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

// ==========================================
// ADMIN ONE-CLICK SEED INITIALIZATION
// ==========================================

export async function seedInitialHotelDatabase() {
  const batch = writeBatch(db);

  batch.set(doc(db, 'websiteSettings', 'main'), {
    ...DEFAULT_SETTINGS,
    updatedAt: serverTimestamp(),
  });

  SAMPLE_ROOMS.forEach((room) => {
    const refDoc = doc(collection(db, 'rooms'));
    batch.set(refDoc, {
      ...room,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  SAMPLE_FACILITIES.forEach((facility) => {
    const refDoc = doc(collection(db, 'facilities'));
    batch.set(refDoc, {
      ...facility,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  SAMPLE_GALLERY.forEach((item) => {
    const refDoc = doc(collection(db, 'gallery'));
    batch.set(refDoc, {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  SAMPLE_TESTIMONIALS.forEach((t) => {
    const refDoc = doc(collection(db, 'testimonials'));
    batch.set(refDoc, {
      ...t,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'batch-seed');
  }
}
