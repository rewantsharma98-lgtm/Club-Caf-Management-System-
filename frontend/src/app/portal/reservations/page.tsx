'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { api, Reservation } from '@/lib/api';
import { getPortalToken } from '@/lib/portalAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { formatDate, statusColors } from '@/lib/utils';

export default function PortalReservationsPage() {
  const [data, setData] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getPortalToken();
    if (!token) return;
    api.portalDashboard(token).then((d) => setData(d.reservations || [])).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <motion.div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="heading-lg">My Reservations</h1>
        <Link href="/reserve" className="btn-primary w-full text-center text-sm sm:w-auto sm:!px-5">
          Book Table
        </Link>
      </div>
      <div className="space-y-4">
        {data.map((r) => (
          <motion.div key={r._id} className="surface-card rounded-lg p-6 flex flex-wrap justify-between gap-4">
            <div>
              <p className="font-semibold">{formatDate(r.date)} at {r.time}</p>
              <p className="text-sm text-cream-muted mt-1">{r.guests} guests · {r.seatingPreference}</p>
            </div>
            <span className={`rounded-full border px-3 py-1 text-xs h-fit ${statusColors[r.status]}`}>
              {r.status}
            </span>
          </motion.div>
        ))}
        {!data.length && <p className="text-slate text-center py-12">No reservations yet.</p>}
      </div>
    </motion.div>
  );
}
