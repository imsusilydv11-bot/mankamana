import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useHotel } from '../../context/HotelContext';

function setMetaTag(selector: string, attrName: string, attrValue: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attrName, attrValue);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function setCanonical(url: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

export function SeoHead() {
  const { pathname } = useLocation();
  const { settings, rooms, facilities, testimonials } = useHotel();

  useEffect(() => {
    const origin = window.location.origin;
    const canonicalUrl = `${origin}${pathname}`;
    const isAdminRoute = pathname.startsWith('/admin');

    let pageTitle =
      settings.seoTitle || `${settings.hotelName} | Luxury Stay in ${settings.locationLabel}`;
    let pageDescription =
      settings.seoDescription ||
      `Book your comfortable stay at ${settings.hotelName} in ${settings.locationLabel}. Explore curated suites, modern amenities, and transparent ${settings.currency} rates.`;
    let ogImage = settings.heroImageUrl || '/src/assets/images/hero_mankamana_courtyard_1795257799851.jpg';

    if (ogImage.startsWith('/')) {
      ogImage = `${origin}${ogImage}`;
    }

    if (isAdminRoute) {
      pageTitle = `Management Portal | ${settings.hotelName}`;
      pageDescription = `Staff and management console for ${settings.hotelName}.`;
    } else if (pathname === '/rooms') {
      pageTitle = `Rooms & Suites (${settings.currency}) | ${settings.hotelName}`;
      pageDescription = `Browse air-conditioned suites, deluxe rooms, and family accommodations at ${settings.hotelName} in ${settings.locationLabel}. Transparent nightly rates in ${settings.currency}.`;
    } else if (pathname.startsWith('/rooms/')) {
      const idOrSlug = pathname.replace('/rooms/', '').split('/')[0];
      const matchedRoom = rooms.find((r) => r.id === idOrSlug || r.slug === idOrSlug);
      if (matchedRoom) {
        pageTitle = `${matchedRoom.name} (${settings.currency} ${matchedRoom.priceNpr.toLocaleString()}/night) | ${settings.hotelName}`;
        pageDescription = matchedRoom.description.slice(0, 158);
        if (matchedRoom.images?.[0]) {
          ogImage = matchedRoom.images[0].startsWith('/')
            ? `${origin}${matchedRoom.images[0]}`
            : matchedRoom.images[0];
        }
      }
    } else if (pathname === '/facilities') {
      pageTitle = `Facilities & Services | ${settings.hotelName}`;
      pageDescription = `Explore guest services at ${settings.hotelName} in ${settings.locationLabel}: fiber Wi-Fi, 24-hour reception, gated parking, and curated comforts.`;
    } else if (pathname === '/gallery') {
      pageTitle = `Photo Gallery | ${settings.hotelName}`;
      pageDescription = `View interior architecture, courtyard views, suites, and reception spaces at ${settings.hotelName}, ${settings.locationLabel}.`;
    } else if (pathname === '/about') {
      pageTitle = `About Us | ${settings.hotelName}`;
      pageDescription = `Learn about our hospitality, peaceful architecture, and attentive guest care at ${settings.hotelName} in ${settings.locationLabel}.`;
    } else if (pathname === '/contact') {
      pageTitle = `Location & Contact | ${settings.hotelName}`;
      pageDescription = `Find directions on Google Maps, reception phone, WhatsApp, and contact enquiry form for ${settings.hotelName} in ${settings.locationLabel}.`;
    } else if (pathname === '/book') {
      pageTitle = `Book Your Stay | ${settings.hotelName}`;
      pageDescription = `Submit a room reservation enquiry for ${settings.hotelName} in ${settings.locationLabel}. Quick desk confirmation and transparent ${settings.currency} rates.`;
    }

    document.title = pageTitle;
    setCanonical(canonicalUrl);
    setMetaTag('meta[name="robots"]', 'name', 'robots', isAdminRoute ? 'noindex, nofollow' : 'index, follow');
    setMetaTag('meta[name="description"]', 'name', 'description', pageDescription);
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', pageTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', pageDescription);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', settings.hotelName);
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', pageTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', pageDescription);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);

    // Sync live Schema.org JSON-LD for search engines
    const scriptId = 'hotel-structured-data';
    let jsonLdScript = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = scriptId;
      jsonLdScript.type = 'application/ld+json';
      document.head.appendChild(jsonLdScript);
    }

    if (!isAdminRoute) {
      const avgRating =
        testimonials.length > 0
          ? Number(
              (
                testimonials.reduce((sum, item) => sum + (item.rating || 5), 0) /
                testimonials.length
              ).toFixed(1)
            )
          : undefined;

      const structuredData: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Hotel',
        name: settings.hotelName,
        description: pageDescription,
        url: origin,
        image: ogImage,
        telephone: settings.phone || undefined,
        email: settings.email || undefined,
        address: {
          '@type': 'PostalAddress',
          streetAddress: settings.address || 'Birgunj',
          addressLocality: 'Birgunj',
          addressRegion: 'Madhesh Province',
          addressCountry: 'NP',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: settings.mapLat || 27.0104,
          longitude: settings.mapLng || 84.8777,
        },
        priceRange: settings.currency || 'NPR',
        currenciesAccepted: settings.currency || 'NPR',
        availableLanguage: ['English', 'Nepali'],
        amenityFeature: facilities.map((f) => ({
          '@type': 'LocationFeatureSpecification',
          name: f.name,
          value: true,
        })),
        makesOffer: rooms.map((r) => ({
          '@type': 'Offer',
          name: r.name,
          description: r.description,
          price: r.priceNpr,
          priceCurrency: settings.currency || 'NPR',
          availability: r.isAvailable
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          url: `${origin}/rooms/${r.slug || r.id}`,
        })),
      };

      if (avgRating && testimonials.length > 0) {
        structuredData.aggregateRating = {
          '@type': 'AggregateRating',
          ratingValue: avgRating,
          reviewCount: testimonials.length,
        };
      }

      jsonLdScript.textContent = JSON.stringify(structuredData);
    }
  }, [pathname, settings, rooms, facilities, testimonials]);

  return null;
}
