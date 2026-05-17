'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Crown, Gift, Calendar, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import { getPortalToken } from '@/lib/portalAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { formatDate } from '@/lib/utils';

export default function PortalDashboardPage() {
  const [data, setData] = useState<Awaited<ReturnType<typeof api.portalDashboard>> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getPortalToken();
    if (!token) return;
    api.portalDashboard(token).then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;
  if (!data) return null;

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="heading-lg">Welcome back</h1>
        <p className="text-cream-muted mt-1">Your premium hospitality experience</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-3">
        <motion.div whileHover={{ y: -4 }} className="surface-elevated rounded-lg p-6">
          <Gift className="text-cyan mb-3" size={28} />
          <p className="text-sm text-cream-muted">Loyalty Points</p>
          <p className="font-display text-3xl font-bold text-cream sm:text-4xl">{data.loyalty.points}</p>
        </motion.div>
        <motion.div whileHover={{ y: -4 }} className="surface-elevated rounded-lg p-6">
          <Crown className="text-cyan mb-3" size={28} />
          <p className="text-sm text-cream-muted">Membership</p>
          <p className="font-display text-2xl font-bold">{data.membership.tier}</p>
          {data.loyalty.nextTier && (
            <p className="text-xs text-slate mt-1">{data.loyalty.pointsToNextTier} pts to {data.loyalty.nextTier}</p>
          )}
        </motion.div>
        <motion.div whileHover={{ y: -4 }} className="surface-elevated rounded-lg p-6">
          <Sparkles className="text-cyan mb-3" size={28} />
          <p className="text-sm text-cream-muted">Notifications</p>
          <p className="font-display text-3xl font-bold sm:text-4xl">{data.unreadCount}</p>
          <p className="text-xs text-slate">unread</p>
        </motion.div>
      </div>

      {data.offers?.length > 0 && (
        <section>
          <h2 className="font-semibold text-cyan mb-4">Personalized Offers</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {data.offers.map((offer, i) => (
              <motion.div key={i} className="rounded-xl glass p-4 border border-gold/20">
                <p className="font-medium">{offer.title}</p>
                <p className="text-sm text-cream-muted mt-1">{offer.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="surface-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2"><Calendar size={18} className="text-cyan" /> Recent Reservations</h2>
            <Link href="/portal/reservations" className="text-sm text-cyan">View all</Link>
          </div>
          {data.reservations?.length ? (
            <ul className="space-y-3">
              {data.reservations.map((r) => (
                <li key={r._id} className="flex flex-col gap-1 border-b border-white/5 pb-2 text-sm sm:flex-row sm:justify-between sm:gap-3">
                  <span className="min-w-0">{formatDate(r.date)} · {r.time}</span>
                  <span className="shrink-0 text-cyan">{r.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate text-sm">No reservations yet. <Link href="/reserve" className="text-cyan">Book a table</Link></p>
          )}
        </div>
        <div className="surface-card rounded-lg p-6">
          <h2 className="font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-2">
            {data.loyalty.history?.slice(0, 5).map((h, i) => (
              <li key={i} className="flex justify-between text-sm">
                <span className="text-cream-muted">{h.description}</span>
                <span className={h.points > 0 ? 'text-emerald-400' : 'text-red-400'}>
                  {h.points > 0 ? '+' : ''}{h.points}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
