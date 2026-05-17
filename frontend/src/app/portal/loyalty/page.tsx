'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api, Reward } from '@/lib/api';
import { getPortalToken } from '@/lib/portalAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';

export default function PortalLoyaltyPage() {
  const [loyalty, setLoyalty] = useState<Awaited<ReturnType<typeof api.portalLoyalty>>['data'] | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const load = () => {
    const token = getPortalToken();
    if (!token) return;
    Promise.all([api.portalLoyalty(token), api.getRewards()])
      .then(([l, r]) => {
        setLoyalty(l.data);
        setRewards(r.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const redeem = async (rewardId: string) => {
    const token = getPortalToken();
    if (!token) return;
    try {
      await api.portalRedeem(token, rewardId);
      setMsg('Reward redeemed! Check your email for the code.');
      load();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Redemption failed');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="heading-lg">Loyalty & Rewards</h1>
      {loyalty && (
        <motion.div className="surface-elevated rounded-lg p-6 flex flex-wrap gap-8 justify-between">
          <div>
            <p className="text-cream-muted text-sm">Available Points</p>
            <p className="text-3xl font-bold text-cream sm:text-4xl">{loyalty.points}</p>
          </div>
          <div>
            <p className="text-cream-muted text-sm">Lifetime</p>
            <p className="text-2xl font-bold">{loyalty.lifetimePoints}</p>
          </div>
        </motion.div>
      )}
      {msg && <p className="text-cyan text-sm text-center">{msg}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {rewards.map((reward, i) => (
          <motion.div
            key={reward._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="surface-card rounded-lg p-6"
          >
            {reward.vipOnly && <span className="text-xs text-amber-400 border border-amber-400/30 px-2 py-0.5 rounded-full">VIP</span>}
            <h3 className="font-semibold mt-2">{reward.title}</h3>
            <p className="text-sm text-cream-muted mt-1">{reward.description}</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-cyan font-bold">{reward.pointsCost} pts</span>
              <Button variant="outline" className="w-full text-sm sm:w-auto" onClick={() => redeem(reward._id)}>
                Redeem
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
