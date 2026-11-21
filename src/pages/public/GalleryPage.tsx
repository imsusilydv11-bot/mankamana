import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { useHotel } from '../../context/HotelContext';
import { GALLERY_CATEGORIES } from '../../types/hotel';
import { SmartImage } from '../../components/common/SmartImage';
import { TiltCard3D } from '../../components/common/TiltCard3D';
import { Ambient3DBanner } from '../../components/three/Ambient3DBanner';
import { GalleryLightbox } from '../../components/public/GalleryLightbox';

export function GalleryPage() {
  const { gallery, settings } = useHotel();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ['All', ...GALLERY_CATEGORIES];

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return gallery;
    return gallery.filter((item) => item.category === activeCategory);
  }, [gallery, activeCategory]);

  return (
    <div className="pt-16 md:pt-20 bg-[#FAF9F6] text-[#181614] min-h-screen">
      <section className="relative bg-[#11100F] text-[#FAF9F6] py-20 overflow-hidden">
        <Ambient3DBanner />
        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8">
          <p className="text-xs tracking-[0.24em] uppercase text-[#C8A055] mb-3">
            {settings.hotelName} · {settings.locationLabel}
          </p>
          <h1 className="font-display text-4xl sm:text-6xl font-medium [text-wrap:balance] mb-4">
            Architectural Gallery
          </h1>
          <p className="text-base text-stone-300 max-w-2xl">
            Browse photography across our exterior courtyard, reception lobby, bedrooms, dining lounge, and guest spaces.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex flex-wrap items-center gap-2 pb-8 mb-8 border-b border-[#181614]/10">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setLightboxIndex(null);
                }}
                className={`px-4 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-[#181614] text-[#FAF9F6]'
                    : 'bg-white text-[#4A443E] border border-[#181614]/15 hover:border-[#C8A055]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center border border-[#181614]/10 bg-white">
              <p className="font-display text-2xl mb-2">No Photographs in This Category Yet</p>
              <p className="text-sm text-[#4A443E]">
                Select another category or view All to explore available photography.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item, idx) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                >
                  <TiltCard3D maxTilt={6} glareOpacity={0.18}>
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(idx)}
                      className="group w-full bg-white border border-[#181614]/10 overflow-hidden text-left cursor-pointer block"
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-[#181614]">
                        <SmartImage
                          src={item.imageUrl}
                          alt={item.title}
                          fallbackLabel={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-5">
                        <p className="text-xs font-medium text-[#8E682A] mb-1">{item.category}</p>
                        <h2 className="font-display text-xl font-medium text-[#181614]">
                          {item.title}
                        </h2>
                        {item.caption && (
                          <p className="text-xs text-[#4A443E] mt-1 line-clamp-2">{item.caption}</p>
                        )}
                      </div>
                    </button>
                  </TiltCard3D>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <GalleryLightbox
        items={filtered}
        activeIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}
