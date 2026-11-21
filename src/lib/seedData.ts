import {
  Facility,
  GalleryItem,
  Room,
  Testimonial,
  WebsiteSettings,
} from '../types/hotel';

export const HERO_FALLBACK_IMAGE = '/src/assets/images/hero_mankamana_courtyard_1795257799851.jpg';
export const DELUXE_KING_IMAGE = '/src/assets/images/room_deluxe_king_1795256700468.jpg';
export const EXECUTIVE_SUITE_IMAGE = '/src/assets/images/room_executive_suite_1795256701412.jpg';
export const TWIN_GARDEN_IMAGE = '/src/assets/images/room_twin_garden_1795256701335.jpg';
export const DINING_LOUNGE_IMAGE = '/src/assets/images/facility_dining_lounge_1795256700654.jpg';
export const RECEPTION_LOBBY_IMAGE = '/src/assets/images/gallery_reception_lobby_1795256699953.jpg';

export const DEFAULT_SETTINGS: WebsiteSettings = {
  hotelName: 'MANKAMANA GUEST HOUSE',
  tagline: 'Refined Hospitality in the Heart of Birgunj',
  locationLabel: 'BIRGUNJ, NEPAL',
  heroTitle: 'A Comfortable Stay, A Memorable Experience.',
  heroSubtitle: 'Serene Boutique Accommodations in Birgunj',
  heroIntro:
    'Thoughtfully crafted rooms, quiet natural timber architecture, and attentive Nepali warmth tailored for business travelers, families, and discerning guests.',
  heroImageUrl: HERO_FALLBACK_IMAGE,
  aboutTitle: 'About Mankamana Guest House',
  aboutHeading: 'Quiet Elegance & Warm Nepali Hospitality',
  aboutBody:
    'Nestled in Birgunj, Nepal, Mankamana Guest House blends contemporary architectural restraint with the timeless warmth of Nepali hospitality. Every detail—from acoustic privacy and handcrafted teak furnishings to round-the-clock reception—exists to make every arrival feel effortless.',
  hospitalityNote:
    'Our dedicated reception team greets every guest personally, ensuring smooth check-ins, local transit guidance across Birgunj, and attentive housekeeping throughout your stay.',
  comfortNote:
    'Designed around restful sleep, each suite pairs climate-controlled air conditioning, crisp high-thread-count linens, and high-speed fiber Wi-Fi with serene neutral tones.',
  aboutImageUrl: RECEPTION_LOBBY_IMAGE,
  phone: '',
  whatsapp: '',
  email: '',
  address: 'Birgunj, Parsa District, Nepal',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Birgunj+Nepal',
  mapLat: 27.0104,
  mapLng: 84.8774,
  facebookUrl: '',
  instagramUrl: '',
  currency: 'NPR',
  defaultLanguage: 'en',
  seoTitle: 'Mankamana Guest House – Boutique Stay in Birgunj, Nepal',
  seoDescription:
    'Experience serene luxury hospitality at Mankamana Guest House in Birgunj, Nepal. Explore curated suites, modern amenities, and submit your stay enquiry.',
  diningEnabled: true,
  bookingNotice:
    'All bookings submitted online are handled as priority enquiries. Final room confirmation and payment arrangements are finalized directly with our reception desk.',
  footerNote: 'Mankamana Guest House · Birgunj, Nepal. Crafted for calm, restorative stays.',
};

export const SAMPLE_ROOMS: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Deluxe King Sanctuary',
    slug: 'deluxe-king-sanctuary',
    type: 'Deluxe',
    description:
      'A serene king-bedded retreat framed in warm walnut paneling, travertine stone accents, and sheer daylight drapes. Ideal for solo executives or couples seeking restorative quiet.',
    priceNpr: 4500,
    maxGuests: 2,
    bedType: '1 King Bed',
    sizeSqFt: 320,
    amenities: [
      'High-Speed Fiber Wi-Fi',
      'Split Air Conditioning',
      'En-suite Rain Shower',
      'Dedicated Work Desk',
      'Smart Flat-Screen TV',
      'Complimentary Bottled Water',
    ],
    images: [DELUXE_KING_IMAGE, RECEPTION_LOBBY_IMAGE],
    isAvailable: true,
    isFeatured: true,
    displayOrder: 1,
  },
  {
    name: 'Executive Heritage Suite',
    slug: 'executive-heritage-suite',
    type: 'Executive Suite',
    description:
      'Our flagship corner suite featuring a private teakwood lounge seating area, generous king bed with layered organic textiles, and ambient evening cove lighting.',
    priceNpr: 7200,
    maxGuests: 3,
    bedType: '1 King Bed + Lounge Sofa',
    sizeSqFt: 480,
    amenities: [
      'Private Lounge Seating',
      'High-Speed Fiber Wi-Fi',
      'Climate-Controlled A/C',
      'Tea & Coffee Bar',
      '24-Hour Room Service',
      'Luxury Bath Amenities',
    ],
    images: [EXECUTIVE_SUITE_IMAGE, DELUXE_KING_IMAGE],
    isAvailable: true,
    isFeatured: true,
    displayOrder: 2,
  },
  {
    name: 'Twin Courtyard Room',
    slug: 'twin-courtyard-room',
    type: 'Twin Garden',
    description:
      'Designed for travelling colleagues or family guests, offering two bespoke oak twin beds, soft lime-washed walls, and tranquil garden light.',
    priceNpr: 4200,
    maxGuests: 2,
    bedType: '2 Twin Beds',
    sizeSqFt: 300,
    amenities: [
      'Dual Oak Twin Beds',
      'High-Speed Fiber Wi-Fi',
      'Air Conditioning',
      'Courtyard View',
      'Writing Table',
      'Daily Housekeeping',
    ],
    images: [TWIN_GARDEN_IMAGE, HERO_FALLBACK_IMAGE],
    isAvailable: true,
    isFeatured: true,
    displayOrder: 3,
  },
];

export const SAMPLE_FACILITIES: Omit<Facility, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'Complimentary High-Speed Wi-Fi',
    category: 'Connectivity',
    description: 'Dedicated enterprise fiber connectivity across all guest rooms, suites, and reception lounges.',
    iconName: 'Wifi',
    imageUrl: '',
    isEnabled: true,
    displayOrder: 1,
  },
  {
    name: 'Climate-Controlled Air Conditioning',
    category: 'Comfort',
    description: 'Whisper-quiet split inverter cooling and heating calibrated for Birgunj seasons.',
    iconName: 'Wind',
    imageUrl: '',
    isEnabled: true,
    displayOrder: 2,
  },
  {
    name: 'Secure Private Parking',
    category: 'Arrival',
    description: 'Gated on-site parking courtyard monitored around the clock for guest vehicles.',
    iconName: 'Car',
    imageUrl: '',
    isEnabled: true,
    displayOrder: 3,
  },
  {
    name: 'Attentive Room Service',
    category: 'Hospitality',
    description: 'In-room refreshment and meal delivery prepared fresh to order with gentle service.',
    iconName: 'ConciergeBell',
    imageUrl: '',
    isEnabled: true,
    displayOrder: 4,
  },
  {
    name: '24-Hour Reception & Security',
    category: 'Assistance',
    description: 'Day-and-night front desk presence ready for late arrivals, travel guidance, and guest care.',
    iconName: 'Clock',
    imageUrl: '',
    isEnabled: true,
    displayOrder: 5,
  },
  {
    name: 'Mankamana Dining Lounge',
    category: 'Restaurant / Dining',
    description: 'Warm timber dining lounge serving Nepali comfort classics, breakfast, and evening tea.',
    iconName: 'Utensils',
    imageUrl: DINING_LOUNGE_IMAGE,
    isEnabled: true,
    displayOrder: 6,
  },
];

export const SAMPLE_GALLERY: Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'Twilight Courtyard Exterior',
    category: 'Exterior',
    imageUrl: HERO_FALLBACK_IMAGE,
    caption: 'Warm architectural lighting along the timber eaves and courtyard.',
    displayOrder: 1,
    isEnabled: true,
  },
  {
    title: 'Fluted Teak Reception',
    category: 'Reception',
    imageUrl: RECEPTION_LOBBY_IMAGE,
    caption: 'Travertine reception desk and serene arrival lounge.',
    displayOrder: 2,
    isEnabled: true,
  },
  {
    title: 'Deluxe King Sanctuary',
    category: 'Bedrooms',
    imageUrl: DELUXE_KING_IMAGE,
    caption: 'Walnut wood headboard and crisp linen bedding in morning sunlight.',
    displayOrder: 3,
    isEnabled: true,
  },
  {
    title: 'Executive Heritage Suite',
    category: 'Bedrooms',
    imageUrl: EXECUTIVE_SUITE_IMAGE,
    caption: 'Private lounge seating and warm ambient evening lighting.',
    displayOrder: 4,
    isEnabled: true,
  },
  {
    title: 'Twin Courtyard Room',
    category: 'Bedrooms',
    imageUrl: TWIN_GARDEN_IMAGE,
    caption: 'Calm oak twin bedroom opening toward lush greenery.',
    displayOrder: 5,
    isEnabled: true,
  },
  {
    title: 'Evening Dining Lounge',
    category: 'Dining',
    imageUrl: DINING_LOUNGE_IMAGE,
    caption: 'Intimate teakwood tables and brass pendant glow.',
    displayOrder: 6,
    isEnabled: true,
  },
];

export const SAMPLE_TESTIMONIALS: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    guestName: 'Aarav Shrestha',
    guestOrigin: 'Kathmandu, Nepal',
    rating: 5,
    quote:
      'Rare calm and architectural cleanliness in Birgunj. After long border-corridor meetings, returning to such a quiet, thoughtfully lit room made all the difference.',
    stayType: 'Executive Heritage Suite · Business Stay',
    isEnabled: true,
  },
  {
    guestName: 'Priya Adhikari',
    guestOrigin: 'Pokhara, Nepal',
    rating: 5,
    quote:
      'Every member of the reception desk was remarkably kind. The rooms felt spotless, the Wi-Fi never dropped during calls, and morning tea in the lounge was lovely.',
    stayType: 'Deluxe King Sanctuary · Family Visit',
    isEnabled: true,
  },
  {
    guestName: 'Rohan Agrawal',
    guestOrigin: 'Patna, India',
    rating: 5,
    quote:
      'Secure parking, attentive 24-hour staff, and genuinely comfortable bedding. Easily our preferred address whenever visiting Birgunj.',
    stayType: 'Twin Courtyard Room · Weekend Stay',
    isEnabled: true,
  },
];
