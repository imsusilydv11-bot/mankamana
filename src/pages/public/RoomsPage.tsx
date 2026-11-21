import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { useHotel } from '../../context/HotelContext';
import { RoomCard } from '../../components/public/RoomCard';
import { Ambient3DBanner } from '../../components/three/Ambient3DBanner';

export function RoomsPage() {
  const { rooms, settings } = useHotel();
  const [selectedType, setSelectedType] = useState<string>('All');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const types = useMemo(() => {
    const unique = Array.from(new Set(rooms.map((r) => r.type)));
    return ['All', ...unique];
  }, [rooms]);

  const filtered = useMemo(() => {
    return rooms.filter((room) => {
      if (selectedType !== 'All' && room.type !== selectedType) return false;
      if (onlyAvailable && !room.isAvailable) return false;
      return true;
    });
  }, [rooms, selectedType, onlyAvailable]);

  return (
    <div className="pt-16 md:pt-20 bg-[#FAF9F6] text-[#181614] min-h-screen">
      <section className="relative bg-[#11100F] text-[#FAF9F6] py-20 overflow-hidden">
        <Ambient3DBanner />
        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8">
          <p className="text-xs tracking-[0.24em] uppercase text-[#C8A055] mb-3">
            {settings.hotelName} · {settings.locationLabel}
          </p>
          <h1 className="font-display text-4xl sm:text-6xl font-medium [text-wrap:balance] mb-4">
            Rooms & Suites
          </h1>
          <p className="text-base text-stone-300 max-w-2xl">
            Every suite is appointed with air conditioning, fiber Wi-Fi, natural timber finishes, and quiet acoustic insulation. Nightly rates are listed in {settings.currency}.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-8 border-b border-[#181614]/10">
            <div className="flex flex-wrap items-center gap-2">
              {types.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
                    selectedType === type
                      ? 'bg-[#181614] text-[#FAF9F6]'
                      : 'bg-white text-[#4A443E] border border-[#181614]/15 hover:border-[#C8A055]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <label className="inline-flex items-center gap-2 text-sm text-[#4A443E] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="w-4 h-4 accent-[#C8A055]"
              />
              <span>Available suites only</span>
            </label>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center border border-[#181614]/10 bg-white p-8">
              <h2 className="font-display text-2xl mb-2">No Rooms Match Your Filter</h2>
              <p className="text-sm text-[#4A443E] mb-4">
                Adjust the category or availability filter to view all rooms.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedType('All');
                  setOnlyAvailable(false);
                }}
                className="cta-sheen px-5 py-2.5 bg-[#C8A055] text-[#11100F] text-xs font-semibold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filtered.map((room, idx) => (
                <motion.div
                  key={room.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.06 }}
                >
                  <RoomCard room={room} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
