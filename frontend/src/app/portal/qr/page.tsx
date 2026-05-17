'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode } from 'lucide-react';
import { api, QRItem } from '@/lib/api';
import { getPortalToken } from '@/lib/portalAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function PortalQRPage() {
  const [qrs, setQrs] = useState<QRItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getPortalToken();
    if (!token) return;
    api.portalQRs(token).then((r) => setQrs(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="heading-lg flex items-center gap-3">
        <QrCode className="text-cyan" /> My QR Codes
      </h1>
      <p className="text-cream-muted text-sm">Use at venue for check-in, reservations, and loyalty scanning.</p>
      <div className="grid gap-6 md:grid-cols-2">
        {qrs.map((qr) => (
          <motion.div
            key={qr._id}
            
            className="surface-elevated rounded-lg p-8 text-center"
          >
            <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-xl bg-white p-2">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(qr.token)}`}
                alt="QR"
                width={120}
                height={120}
              />
            </div>
            <p className="text-sm text-cyan uppercase tracking-wider">{qr.type.replace('_', ' ')}</p>
            <p className="text-xs text-slate mt-2 font-mono break-all">{qr.token.slice(0, 16)}...</p>
          </motion.div>
        ))}
        {!qrs.length && (
          <p className="text-slate col-span-2 text-center py-12">
            No QR codes yet. Book a reservation to generate one.
          </p>
        )}
      </div>
    </div>
  );
}
