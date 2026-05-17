'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { useHomeUI } from '@/context/HomeUIContext';

export default function ReservationSection() {
  const { openReserve, openAuth } = useHomeUI();

  return (
    <section id="reserve" className="section-padding border-t border-border">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
        >
          <div>
            <p className="section-label">Reservations</p>
            <h2 className="heading-lg mt-3">Reserve in moments</h2>
            <p className="mt-4 text-body max-w-md">
              Pick your date, time, and table. Our team confirms most bookings within the hour.
            </p>
          </div>
          <div className="surface-elevated p-6 md:p-8 space-y-4">
            <p className="text-sm text-slate">Select table · Live availability</p>
            <Button type="button" onClick={openReserve} className="w-full">
              Reserve a table
            </Button>
            <Button type="button" variant="outline" onClick={() => openAuth('signup')} className="w-full">
              Member access
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
