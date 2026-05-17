'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

export default function ReserveCTA() {
  return (
    <section id="reserve" className="section-padding">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative mx-auto max-w-4xl overflow-hidden surface-elevated rounded-lg-strong p-12 text-center md:p-16"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan/10 via-transparent to-transparent" />
        <div className="relative z-10">
          <h2 className="heading-lg">Reserve Your Table</h2>
          <p className="mx-auto mt-4 max-w-lg text-cream-muted">
            Secure your spot for an unforgettable evening. Premium seating, seamless booking.
          </p>
          <motion.div className="mt-8" whileHover={{ scale: 1.05 }}>
            <Button href="/reserve" className="text-lg !px-10 !py-4">
              Book Now →
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
