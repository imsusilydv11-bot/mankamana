import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useHotel } from '../../context/HotelContext';
import { Room } from '../../types/hotel';
import { SmartImage } from '../common/SmartImage';
import { TiltCard3D } from '../common/TiltCard3D';

export function RoomCard({ room }: { room: Room }) {
  const { settings, t } = useHotel();

  return (
    <TiltCard3D className="bg-white border border-[#181614]/10 flex flex-col justify-between transition-shadow duration-300 hover:shadow-[0_18px_40px_-20px_rgba(24,22,20,0.25)]">
      <article className="group flex flex-col justify-between h-full">
        <div>
          <Link
            to={`/rooms/${room.id}`}
            className="block relative aspect-[4/3] overflow-hidden bg-[#181614]"
          >
            <SmartImage
              src={room.images[0]}
              alt={room.name}
              fallbackLabel={room.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </Link>

          <div className="p-6" style={{ transform: 'translateZ(18px)' }}>
            <div className="flex items-center gap-2 text-xs text-[#6B6257] mb-2">
              <span className="font-medium text-[#8E682A]">{room.type}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">
                Max {room.maxGuests} {t.room.maxGuests}
              </span>
              <span aria-hidden="true">·</span>
              <span>{room.isAvailable ? t.room.available : t.room.unavailable}</span>
            </div>

            <Link to={`/rooms/${room.id}`}>
              <h3 className="font-display text-2xl font-medium text-[#181614] group-hover:text-[#8E682A] transition-colors mb-2">
                {room.name}
              </h3>
            </Link>

            <p className="text-sm text-[#4A443E] leading-relaxed line-clamp-2 mb-4">
              {room.description}
            </p>

            <div className="text-xs text-[#6B6257] flex flex-wrap gap-x-2 gap-y-1">
              <span>{room.bedType}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{room.sizeSqFt} sq ft</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#181614]/10 flex items-center justify-between gap-4 bg-[#FAF9F6]/60">
          <div>
            <span className="font-mono text-base font-medium text-[#181614] tabular-nums">
              {settings.currency} {room.priceNpr.toLocaleString()}
            </span>
            <span className="text-xs text-[#6B6257] ml-1">/ {t.room.perNight}</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/rooms/${room.id}`}
              className="text-xs font-medium text-[#181614] hover:text-[#8E682A] inline-flex items-center gap-1 whitespace-nowrap"
            >
              <span>{t.room.viewSuite}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to={`/book?room=${encodeURIComponent(room.id)}`}
              className="cta-sheen px-3.5 py-2 bg-[#181614] text-[#FAF9F6] text-xs font-medium hover:bg-[#C8A055] hover:text-[#11100F] transition-colors whitespace-nowrap"
            >
              {t.room.bookNow}
            </Link>
          </div>
        </div>
      </article>
    </TiltCard3D>
  );
}
