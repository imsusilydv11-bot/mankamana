import { useSearchParams } from 'react-router-dom';
import { useHotel } from '../../context/HotelContext';
import { BookingEnquiryForm } from '../../components/public/BookingEnquiryForm';
import { Ambient3DBanner } from '../../components/three/Ambient3DBanner';

export function BookPage() {
  const { settings, rooms, t } = useHotel();
  const [params] = useSearchParams();
  const preRoomId = params.get('room') || '';
  const preRoom = rooms.find((r) => r.id === preRoomId);

  return (
    <div className="pt-16 md:pt-20 bg-[#FAF9F6] text-[#181614] min-h-screen">
      <section className="relative bg-[#11100F] text-[#FAF9F6] py-20 overflow-hidden">
        <Ambient3DBanner />
        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8">
          <p className="text-xs tracking-[0.24em] uppercase text-[#C8A055] mb-3">
            {settings.hotelName} · {settings.locationLabel}
          </p>
          <h1 className="font-display text-4xl sm:text-6xl font-medium [text-wrap:balance] mb-4">
            {t.sections.bookingEnquiryTitle}
          </h1>
          <p className="text-base text-stone-300 max-w-2xl">
            {t.sections.bookingEnquirySubtitle}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-5 md:px-8">
          <BookingEnquiryForm
            preselectedRoomId={preRoom?.id || ''}
            preselectedRoomName={preRoom?.name || ''}
          />
        </div>
      </section>
    </div>
  );
}
