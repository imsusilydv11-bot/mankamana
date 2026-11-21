export type LanguageCode = 'en' | 'ne';

export type BookingStatus = 'New' | 'Contacted' | 'Confirmed' | 'Cancelled' | 'Completed';

export const BOOKING_STATUSES: BookingStatus[] = [
  'New',
  'Contacted',
  'Confirmed',
  'Cancelled',
  'Completed',
];

export type GalleryCategory =
  | 'Exterior'
  | 'Reception'
  | 'Bedrooms'
  | 'Bathrooms'
  | 'Dining'
  | 'Common Areas';

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  'Exterior',
  'Reception',
  'Bedrooms',
  'Bathrooms',
  'Dining',
  'Common Areas',
];

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin';
  createdAt?: unknown;
}

export interface Room {
  id: string;
  name: string;
  slug: string;
  type: string;
  description: string;
  priceNpr: number;
  maxGuests: number;
  bedType: string;
  sizeSqFt: number;
  amenities: string[];
  images: string[];
  isAvailable: boolean;
  isFeatured: boolean;
  displayOrder: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface BookingEnquiry {
  id: string;
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
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  imageUrl: string;
  caption: string;
  displayOrder: number;
  isEnabled: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface Facility {
  id: string;
  name: string;
  category: string;
  description: string;
  iconName: string;
  imageUrl: string;
  isEnabled: boolean;
  displayOrder: number;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface Testimonial {
  id: string;
  guestName: string;
  guestOrigin: string;
  rating: number;
  quote: string;
  stayType: string;
  isEnabled: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface WebsiteSettings {
  hotelName: string;
  tagline: string;
  locationLabel: string;
  heroTitle: string;
  heroSubtitle: string;
  heroIntro: string;
  heroImageUrl: string;
  aboutTitle: string;
  aboutHeading: string;
  aboutBody: string;
  hospitalityNote: string;
  comfortNote: string;
  aboutImageUrl: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  googleMapsUrl: string;
  mapLat: number;
  mapLng: number;
  facebookUrl: string;
  instagramUrl: string;
  currency: string;
  defaultLanguage: LanguageCode;
  seoTitle: string;
  seoDescription: string;
  diningEnabled: boolean;
  bookingNotice: string;
  footerNote: string;
  updatedAt?: unknown;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt?: unknown;
}
