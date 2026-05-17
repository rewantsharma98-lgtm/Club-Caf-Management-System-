'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api, SubscriptionPlan, Business } from '@/lib/api';
import { getToken } from '@/lib/auth';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function SuperPlansPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [msg, setMsg] = useState('');
  const [assign, setAssign] = useState({ businessId: '', planId: '' });

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    Promise.all([api.getPlans(token), api.getBusinesses(token)])
      .then(([p, b]) => {
        setPlans(p.data);
        setBusinesses(b.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const submitAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;
    setAssigning(true);
    setMsg('');
    try {
      await api.assignSubscription(token, assign);
      setMsg('Subscription assigned');
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Assignment failed');
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <motion.div className="flex justify-center py-20">
        <LoadingSpinner />
      </motion.div>
    );
  }

  return (
    <motion.div className="space-y-8">
      <h1 className="heading-lg">Subscription Plans</h1>
      <motion.div className="grid gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <motion.div key={p._id} className="surface-elevated rounded-lg p-6">
            <h3 className="font-semibold text-lg">{p.name}</h3>
            <p className="text-3xl font-bold text-cyan mt-2">${p.priceMonthly}</p>
            <p className="text-sm text-cream-muted">/ month</p>
            <p className="text-xs text-slate mt-3">Up to {p.maxBranches} branches</p>
            <ul className="mt-4 space-y-1 text-sm text-cream-muted">
              {p.features?.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
          </motion.div>
        ))}
        {!plans.length && (
          <p className="text-slate col-span-full text-center py-8">
            No plans in database — run seed or create via API.
          </p>
        )}
      </motion.div>
      <motion.form
        onSubmit={submitAssign}
        className="surface-card rounded-lg p-6 max-w-xl space-y-4"
      >
        <h2 className="font-semibold text-cyan">Assign Subscription</h2>
        <select
          className="input-field"
          value={assign.businessId}
          onChange={(e) => setAssign({ ...assign, businessId: e.target.value })}
          required
        >
          <option value="">Select business</option>
          {businesses.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>
        <select
          className="input-field"
          value={assign.planId}
          onChange={(e) => setAssign({ ...assign, planId: e.target.value })}
          required
        >
          <option value="">Select plan</option>
          {plans.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
        <Button type="submit" disabled={assigning}>
          {assigning ? 'Assigning...' : 'Assign Plan'}
        </Button>
        {msg && <p className="text-sm text-cyan">{msg}</p>}
      </motion.form>
    </motion.div>
  );
}
