import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function Preloader({ hotelName }: { hotelName: string }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(() => setVisible(false), reduced ? 150 : 850);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }}
          onClick={() => setVisible(false)}
          className="fixed inset-0 z-[120] bg-[#11100F] flex flex-col items-center justify-center px-6 cursor-pointer"
        >
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs tracking-[0.28em] text-[#C8A055] uppercase mb-3"
          >
            Birgunj · Nepal
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-3xl sm:text-5xl text-[#FAF9F6] tracking-wide text-center"
          >
            {hotelName}
          </motion.h2>
          <div className="mt-6 w-48 h-[1px] bg-white/15 overflow-hidden">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full bg-[#C8A055]"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
