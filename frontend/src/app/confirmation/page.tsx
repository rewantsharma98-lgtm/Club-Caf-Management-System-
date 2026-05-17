'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Reservation } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { BRAND } from '@/lib/brand';

export default function ConfirmationPage() {
  const [booking, setBooking] = useState<Reservation | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem(BRAND.confirmKey);
    if (raw) {
      try {
        setBooking(JSON.parse(raw));
      } catch {
        setBooking(null);
      }
    }
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink">
        <LoadingSpinner />
      </div>
    );
  }

  if (!booking) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-screen items-center justify-center pt-24">
          <div className="text-center">
            <p className="text-cream-muted">No reservation found.</p>
            <Button href="/?reserve=1" className="mt-6">
              Make a Reservation
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-lg glass-strong rounded-3xl p-10 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <CheckCircle2 className="mx-auto h-16 w-16 text-gold" />
          </motion.div>
          <h1 className="heading-lg mt-6">Reservation Confirmed</h1>
          <p className="mt-2 text-cream-muted">
            Thank you, {booking.customerName}. Your booking is pending confirmation.
          </p>

          <div className="mt-8 space-y-3 surface-card rounded-lg p-6 text-left text-sm">
            <Row label="Date" value={formatDate(booking.date)} />
            <Row label="Time" value={booking.time} />
            <Row label="Guests" value={String(booking.guests)} />
            {booking.tableLabel && <Row label="Table" value={booking.tableLabel} />}
            <Row label="Status" value={booking.status} highlight />
            {booking.specialRequest && (
              <Row label="Special Request" value={booking.specialRequest} />
            )}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button href="/">Back to Home</Button>
            <Button href="/?reserve=1" variant="outline">
              Book Another
            </Button>
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between border-b border-white/5 pb-2 last:border-0">
      <span className="text-cream-muted">{label}</span>
      <span className={highlight ? 'text-gold font-medium' : ''}>{value}</span>
    </div>
  );
}
