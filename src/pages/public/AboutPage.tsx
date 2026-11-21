import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useHotel } from '../../context/HotelContext';
import { SmartImage } from '../../components/common/SmartImage';
import { TiltCard3D } from '../../components/common/TiltCard3D';
import { Ambient3DBanner } from '../../components/three/Ambient3DBanner';

export function AboutPage() {
  const { settings, gallery } = useHotel();

  return (
    <div className="pt-16 md:pt-20 bg-[#FAF9F6] text-[#181614]">
      <section className="relative bg-[#11100F] text-[#FAF9F6] py-20 md:py-28 overflow-hidden">
        <Ambient3DBanner />
        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8">
          <p className="text-xs tracking-[0.24em] uppercase text-[#C8A055] mb-3">
            {settings.hotelName} · {settings.locationLabel}
          </p>
          <h1 className="font-display text-4xl sm:text-6xl font-medium max-w-3xl [text-wrap:balance] mb-5">
            {settings.aboutTitle || 'About Mankamana Guest House'}
          </h1>
          <p className="text-base sm:text-lg text-stone-300 max-w-2xl leading-relaxed">
            {settings.tagline}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          <div className="lg:col-span-6">
            <TiltCard3D maxTilt={5} glareOpacity={0.14} className="h-full">
              <div className="h-full min-h-[360px] bg-[#181614] overflow-hidden border border-[#181614]/10">
                <SmartImage
                  src={settings.aboutImageUrl}
                  alt={settings.aboutHeading}
                  fallbackLabel={settings.hotelName}
                  className="w-full h-full object-cover"
                />
              </div>
            </TiltCard3D>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-[#8E682A] mb-2 font-medium">
                Our Story
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-medium mb-4">
                {settings.aboutHeading}
              </h2>
              <p className="text-base text-[#3D3731] leading-relaxed">{settings.aboutBody}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#181614]/10">
              <div>
                <h3 className="font-display text-2xl font-medium mb-2">Our Hospitality</h3>
                <p className="text-sm text-[#4A443E] leading-relaxed">
                  {settings.hospitalityNote}
                </p>
              </div>
              <div>
                <h3 className="font-display text-2xl font-medium mb-2">Guest Comfort</h3>
                <p className="text-sm text-[#4A443E] leading-relaxed">
                  {settings.comfortNote}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/book"
                className="cta-sheen group inline-flex items-center gap-2 px-6 py-3 bg-[#181614] text-[#FAF9F6] text-sm font-medium hover:bg-[#C8A055] hover:text-[#11100F] transition-colors"
              >
                <span>Request Your Stay</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-[#F1EEE8]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <h2 className="font-display text-3xl sm:text-4xl font-medium mb-8">
            Spaces Around the Guest House
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gallery.slice(0, 3).map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
              >
                <TiltCard3D className="bg-white border border-[#181614]/10 h-full">
                  <div className="aspect-[4/3] overflow-hidden bg-[#181614]">
                    <SmartImage
                      src={item.imageUrl}
                      alt={item.title}
                      fallbackLabel={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-medium text-[#8E682A] mb-1">{item.category}</p>
                    <h3 className="font-display text-xl font-medium">{item.title}</h3>
                    {item.caption && <p className="text-xs text-[#4A443E] mt-1">{item.caption}</p>}
                  </div>
                </TiltCard3D>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
