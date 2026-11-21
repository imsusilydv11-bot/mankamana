import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useHotel } from '../../context/HotelContext';
import { FacilityIcon } from '../../components/common/FacilityIcon';
import { SmartImage } from '../../components/common/SmartImage';
import { TiltCard3D } from '../../components/common/TiltCard3D';
import { Ambient3DBanner } from '../../components/three/Ambient3DBanner';

export function FacilitiesPage() {
  const { facilities, settings } = useHotel();

  return (
    <div className="pt-16 md:pt-20 bg-[#FAF9F6] text-[#181614] min-h-screen">
      <section className="relative bg-[#11100F] text-[#FAF9F6] py-20 overflow-hidden">
        <Ambient3DBanner />
        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8">
          <p className="text-xs tracking-[0.24em] uppercase text-[#C8A055] mb-3">
            {settings.hotelName} · {settings.locationLabel}
          </p>
          <h1 className="font-display text-4xl sm:text-6xl font-medium [text-wrap:balance] mb-4">
            Facilities & Services
          </h1>
          <p className="text-base text-stone-300 max-w-2xl">
            Every stay includes attentive essentials crafted for comfort, connectivity, and peace of mind throughout your visit to Birgunj.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {facilities.map((fac, idx) => (
              <motion.div
                key={fac.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: idx * 0.06 }}
              >
                <TiltCard3D className="bg-white border border-[#181614]/10 flex flex-col justify-between overflow-hidden h-full">
                  <div>
                    {fac.imageUrl ? (
                      <div className="aspect-[16/10] bg-[#181614] overflow-hidden">
                        <SmartImage
                          src={fac.imageUrl}
                          alt={fac.name}
                          fallbackLabel={fac.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : null}
                    <div className="p-7">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-[#8E682A] font-medium">{fac.category}</span>
                        <FacilityIcon name={fac.iconName} className="w-5 h-5 text-[#181614]" />
                      </div>
                      <h2 className="font-display text-2xl font-medium mb-2">{fac.name}</h2>
                      <p className="text-sm text-[#4A443E] leading-relaxed">{fac.description}</p>
                    </div>
                  </div>
                </TiltCard3D>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 bg-[#181512] text-[#FAF9F6] p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-white/10">
            <div>
              <p className="text-xs tracking-[0.2em] uppercase text-[#C8A055] mb-2">
                Custom Requests
              </p>
              <h2 className="font-display text-3xl font-medium">
                Need Airport Pickup or Group Arrangements?
              </h2>
              <p className="text-sm text-stone-300 mt-1">
                Include your requirements when submitting a stay enquiry and our reception desk will coordinate.
              </p>
            </div>
            <Link
              to="/book"
              className="cta-sheen group inline-flex items-center gap-2 px-6 py-3.5 bg-[#C8A055] text-[#11100F] text-sm font-semibold hover:bg-[#DBB66D] transition-colors whitespace-nowrap shrink-0"
            >
              <span>Submit Booking Enquiry</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
