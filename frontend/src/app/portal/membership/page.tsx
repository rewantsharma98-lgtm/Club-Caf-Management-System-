'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Check, Sparkles } from 'lucide-react';
import { api, MembershipInfo, LoyaltyDashboard } from '@/lib/api';
import { getPortalToken } from '@/lib/portalAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const tiers = ['Silver', 'Gold', 'Platinum', 'VIP Elite'];

export default function PortalMembershipPage() {
  const [membership, setMembership] = useState<MembershipInfo | null>(null);
  const [loyalty, setLoyalty] = useState<LoyaltyDashboard | null>(null);
  const [tierHistory, setTierHistory] = useState<{ tier: string; since?: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getPortalToken();
    if (!token) return;
    api
      .portalMembership(token)
      .then((r) => {
        setMembership(r.membership);
        setLoyalty(r.loyalty);
        setTierHistory(r.tierHistory || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <motion.div className="flex justify-center py-20">
        <LoadingSpinner />
      </motion.div>
    );
  }

  return (
    <motion.div className="space-y-8">
      <h1 className="heading-lg flex items-center gap-3">
        <Crown className="text-cyan" /> Membership
      </h1>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="surface-elevated rounded-lg p-8 text-center"
      >
        <p className="text-sm text-cream-muted">Current Tier</p>
        <p className="font-display text-3xl font-bold text-cream mt-2 sm:text-5xl">{membership?.tier}</p>
        <p className="text-slate mt-2">{membership?.lifetimePoints} lifetime points</p>
        {membership?.nextTier && (
          <p className="text-sm text-cyan mt-3 flex items-center justify-center gap-1">
            <Sparkles size={14} /> Next: {membership.nextTier}
          </p>
        )}
        {loyalty && (
          <p className="text-sm text-cream-muted mt-2">{loyalty.points} points available to redeem</p>
        )}
      </motion.div>
      {membership?.benefits && (
        <motion.div className="surface-card rounded-lg p-6">
          <h2 className="font-semibold text-cyan mb-4">Your Benefits</h2>
          <ul className="space-y-2">
            {membership.benefits.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm text-cream-muted">
                <Check size={14} className="text-cyan shrink-0" /> {b}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
      {tierHistory.length > 0 && (
        <motion.div className="surface-card rounded-lg p-6">
          <h2 className="font-semibold mb-4">Membership History</h2>
          <ul className="space-y-2 text-sm text-cream-muted">
            {tierHistory.map((h) => (
              <li key={h.tier}>
                {h.tier}
                {h.since && ` — since ${new Date(h.since).toLocaleDateString()}`}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
      <motion.div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {tiers.map((tier) => (
          <motion.div
            key={tier}
            
            className={`rounded-xl glass p-4 text-center ${
              membership?.tier === tier ? 'border border-gold/30 shadow-soft' : ''
            }`}
          >
            <p className="font-medium">{tier}</p>
            {membership?.tier === tier && <p className="text-xs text-cyan mt-1">Active</p>}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
