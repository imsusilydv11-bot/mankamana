import { LanguageCode } from '../types/hotel';

export interface TranslationDictionary {
  nav: {
    home: string;
    rooms: string;
    facilities: string;
    gallery: string;
    about: string;
    contact: string;
    bookStay: string;
  };
  hero: {
    exploreRooms: string;
    bookYourStay: string;
    scrollPrompt: string;
  };
  sections: {
    welcomeEyebrow: string;
    featuredRoomsTitle: string;
    featuredRoomsSubtitle: string;
    viewAllRooms: string;
    interactive3dTitle: string;
    interactive3dSubtitle: string;
    facilitiesTitle: string;
    facilitiesSubtitle: string;
    whyChooseTitle: string;
    galleryTitle: string;
    testimonialsTitle: string;
    locationTitle: string;
    getDirections: string;
    bookingEnquiryTitle: string;
    bookingEnquirySubtitle: string;
  };
  room: {
    perNight: string;
    maxGuests: string;
    available: string;
    unavailable: string;
    bookNow: string;
    viewSuite: string;
  };
  bookingForm: {
    guestName: string;
    phone: string;
    email: string;
    checkIn: string;
    checkOut: string;
    adults: string;
    children: string;
    roomType: string;
    specialRequests: string;
    submitEnquiry: string;
    submitting: string;
    enquiryNotice: string;
    successTitle: string;
    successBody: string;
    newEnquiry: string;
  };
  footer: {
    navigation: string;
    contact: string;
    managementPortal: string;
    languageLabel: string;
  };
}

export const translations: Record<LanguageCode, TranslationDictionary> = {
  en: {
    nav: {
      home: 'Home',
      rooms: 'Rooms',
      facilities: 'Facilities',
      gallery: 'Gallery',
      about: 'About',
      contact: 'Contact',
      bookStay: 'Book Stay',
    },
    hero: {
      exploreRooms: 'Explore Rooms',
      bookYourStay: 'Book Your Stay',
      scrollPrompt: 'Scroll to explore',
    },
    sections: {
      welcomeEyebrow: 'Welcome to Mankamana Guest House',
      featuredRoomsTitle: 'Curated Rooms & Suites',
      featuredRoomsSubtitle: 'Calm timber, linen, and acoustic stillness designed for restful nights in Birgunj.',
      viewAllRooms: 'View All Suites',
      interactive3dTitle: 'Interactive 3D Suite Preview',
      interactive3dSubtitle: 'Inspect architectural proportions, warm timber finishes, and morning or evening lighting moods.',
      facilitiesTitle: 'Thoughtful Hospitality & Facilities',
      facilitiesSubtitle: 'Essential comforts crafted around effortless arrivals, serene mornings, and reliable connectivity.',
      whyChooseTitle: 'The Mankamana Standard',
      galleryTitle: 'Architectural Gallery',
      testimonialsTitle: 'Guest Reflections',
      locationTitle: 'Birgunj, Nepal',
      getDirections: 'Open in Google Maps',
      bookingEnquiryTitle: 'Request a Reservation',
      bookingEnquirySubtitle: 'Submit your stay dates and preferences. Our desk reviews and confirms every enquiry personally.',
    },
    room: {
      perNight: 'per night',
      maxGuests: 'Guests',
      available: 'Available',
      unavailable: 'Currently Reserved',
      bookNow: 'Book Now',
      viewSuite: 'Explore Suite',
    },
    bookingForm: {
      guestName: 'Full Name',
      phone: 'Phone / WhatsApp Number',
      email: 'Email Address',
      checkIn: 'Check-In Date',
      checkOut: 'Check-Out Date',
      adults: 'Adults',
      children: 'Children',
      roomType: 'Preferred Room',
      specialRequests: 'Special Requests (arrival time, airport pickup, dietary notes)',
      submitEnquiry: 'Submit Booking Enquiry',
      submitting: 'Sending Enquiry...',
      enquiryNotice: 'This is a reservation enquiry. Availability and final confirmation are provided directly by our reception team.',
      successTitle: 'Booking Enquiry Received',
      successBody: 'Thank you for choosing Mankamana Guest House. Our reception desk in Birgunj has received your request and will contact you shortly to confirm availability.',
      newEnquiry: 'Submit Another Enquiry',
    },
    footer: {
      navigation: 'Explore',
      contact: 'Reception & Location',
      managementPortal: 'Management Portal',
      languageLabel: 'Language',
    },
  },
  ne: {
    nav: {
      home: 'गृहपृष्ठ',
      rooms: 'कोठाहरू',
      facilities: 'सुविधाहरू',
      gallery: 'ग्यालेरी',
      about: 'हाम्रो बारेमा',
      contact: 'सम्पर्क',
      bookStay: 'बुकिङ गर्नुहोस्',
    },
    hero: {
      exploreRooms: 'कोठाहरू हेर्नुहोस्',
      bookYourStay: 'बसाइ बुक गर्नुहोस्',
      scrollPrompt: 'तल स्क्रोल गर्नुहोस्',
    },
    sections: {
      welcomeEyebrow: 'मनकामना गेस्ट हाउसमा स्वागत छ',
      featuredRoomsTitle: 'विशेष कोठा र सुइटहरू',
      featuredRoomsSubtitle: 'वीरगञ्जमा शान्त र आरामदायी बसाइका लागि कलात्मक काठ र प्राकृतिक सजावट।',
      viewAllRooms: 'सबै कोठाहरू हेर्नुहोस्',
      interactive3dTitle: 'अन्तरक्रियात्मक ३डी कोठा अवलोकन',
      interactive3dSubtitle: 'कोठाको बनावट, प्रकाश र आन्तरिक सज्जा ३डीमा नियाल्नुहोस्।',
      facilitiesTitle: 'आतिथ्य र सुविधाहरू',
      facilitiesSubtitle: 'तपाईंको सहज र यादगार बसाइका लागि २४ घण्टे सेवा र आधुनिक सुविधाहरू।',
      whyChooseTitle: 'हाम्रो विशेषता',
      galleryTitle: 'तस्बिर ग्यालेरी',
      testimonialsTitle: 'अतिथि अनुभवहरू',
      locationTitle: 'वीरगञ्ज, नेपाल',
      getDirections: 'गुगल म्यापमा दिशा हेर्नुहोस्',
      bookingEnquiryTitle: 'बुकिङ अनुरोध पठाउनुहोस्',
      bookingEnquirySubtitle: 'आफ्नो आगमन मिति र विवरण पठाउनुहोस्। हाम्रो रिसेप्सन टोलीले शीघ्र पुष्टि गर्नेछ।',
    },
    room: {
      perNight: 'प्रति रात',
      maxGuests: 'पाहुना',
      available: 'उपलब्ध छ',
      unavailable: 'हाल आरक्षित',
      bookNow: 'अहिले बुक गर्नुहोस्',
      viewSuite: 'विवरण हेर्नुहोस्',
    },
    bookingForm: {
      guestName: 'पूरा नाम',
      phone: 'फोन / ह्वाट्सएप नम्बर',
      email: 'इमेल ठेगाना',
      checkIn: 'चेक-इन मिति',
      checkOut: 'चेक-आउट मिति',
      adults: 'वयस्क',
      children: 'बालबालिका',
      roomType: 'मनपर्ने कोठा',
      specialRequests: 'विशेष अनुरोधहरू',
      submitEnquiry: 'बुकिङ अनुरोध पठाउनुहोस्',
      submitting: 'पठाइँदैछ...',
      enquiryNotice: 'यो बुकिङ अनुरोध हो। अन्तिम पुष्टि हाम्रो रिसेप्सन टोलीले सम्पर्क गरी गर्नेछ।',
      successTitle: 'बुकिङ अनुरोध प्राप्त भयो',
      successBody: 'मनकामना गेस्ट हाउस छनौट गर्नुभएकोमा धन्यवाद। वीरगञ्जस्थित हाम्रो टोलीले छिट्टै सम्पर्क गर्नेछ।',
      newEnquiry: 'अर्को अनुरोध पठाउनुहोस्',
    },
    footer: {
      navigation: 'अन्वेषण',
      contact: 'सम्पर्क र ठेगाना',
      managementPortal: 'व्यवस्थापन पोर्टल',
      languageLabel: 'भाषा',
    },
  },
};
