import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { useHotel } from '../../context/HotelContext';
import { SmartImage } from '../../components/common/SmartImage';
import { TiltCard3D } from '../../components/common/TiltCard3D';
import { BookingEnquiryForm } from '../../components/public/BookingEnquiryForm';

export function RoomDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { rooms, settings } = useHotel();
  const [activePhoto, setActivePhoto] = useState(0);

  const room = rooms.find((r) => r.id === id || r.slug === id);

  if (!room) {
    return (
      <div className="pt-32 pb-24 px-5 text-center bg-[#FAF9F6] min-h-screen">
        <h1 className="font-display text-4xl mb-3 text-[#181614]">Suite Not Found</h1>
        <p className="text-sm text-[#4A443E] mb-6">
          The room you are looking for may have been updated or removed.
        </p>
        <Link
          to="/rooms"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#181614] text-[#FAF9F6] text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Rooms</span>
        </Link>
      </div>
    );
  }

  const photos = room.images.length > 0 ? room.images : [''];

  return (
    <div className="pt-20 bg-[#FAF9F6] text-[#181614]">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10">
        <Link
          to="/rooms"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#4A443E] hover:text-[#8E682A] mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Rooms & Suites</span>
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#4A443E] mb-2">
              <span className="font-medium text-[#8E682A]">{room.type}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">Max {room.maxGuests} Guests</span>
              <span aria-hidden="true">·</span>
              <span>{room.bedType}</span>
              <span aria-hidden="true">·</span>
              <span>{room.isAvailable ? 'Available' : 'Currently Reserved'}</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-medium">{room.name}</h1>
          </div>

          <div className="text-left lg:text-right">
            <p className="text-xs text-[#6B6257]">Nightly Rate</p>
            <p className="font-mono text-2xl font-medium tabular-nums">
              {settings.currency} {room.priceNpr.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Media Gallery with Mouse 3D Perspective */}
        <div className="space-y-4">
          <TiltCard3D maxTilt={3.5} glareOpacity={0.14}>
            <div className="aspect-[16/9] max-h-[580px] w-full bg-[#181614] overflow-hidden border border-[#181614]/10">
              <SmartImage
                src={photos[activePhoto] || photos[0]}
                alt={room.name}
                fallbackLabel={room.name}
                priority
                className="w-full h-full object-cover"
              />
            </div>
          </TiltCard3D>

          {photos.length > 1 && (
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3">
              {photos.map((img, i) => (
                <button
                  key={`${img}-${i}`}
                  type="button"
                  onClick={() => setActivePhoto(i)}
                  className={`aspect-[4/3] overflow-hidden border-2 transition-all ${
                    activePhoto === i ? 'border-[#C8A055]' : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                >
                  <SmartImage
                    src={img}
                    alt={`${room.name} view ${i + 1}`}
                    fallbackLabel={room.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details & Booking Enquiry */}
        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-6 space-y-8">
            <div>
              <h2 className="font-display text-3xl font-medium mb-3">Suite Overview</h2>
              <p className="text-base text-[#3D3731] leading-relaxed">{room.description}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-6 border-y border-[#181614]/10">
              <div>
                <p className="text-xs text-[#6B6257]">Occupancy</p>
                <p className="font-mono text-base font-medium mt-1 tabular-nums">
                  Up to {room.maxGuests} Guests
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B6257]">Bedding</p>
                <p className="text-base font-medium mt-1">{room.bedType}</p>
              </div>
              <div>
                <p className="text-xs text-[#6B6257]">Floor Area</p>
                <p className="font-mono text-base font-medium mt-1 tabular-nums">
                  {room.sizeSqFt} sq ft
                </p>
              </div>
            </div>

            <div>
              <h2 className="font-display text-3xl font-medium mb-4">In-Suite Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {room.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2.5 text-sm text-[#3D3731]">
                    <Check className="w-4 h-4 text-[#8E682A] shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <h2 className="font-display text-3xl font-medium mb-2">Enquire for This Suite</h2>
            <p className="text-sm text-[#4A443E] mb-5">
              Our reception desk in Birgunj will verify dates and confirm your reservation.
            </p>
            <BookingEnquiryForm preselectedRoomId={room.id} preselectedRoomName={room.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
