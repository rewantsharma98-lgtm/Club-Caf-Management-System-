'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api, PlatformAnalytics } from '@/lib/api';
import { getToken } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function SuperAdminPage() {
  const [analytics, setAnalytics] = useState<PlatformAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    api.getSuperOverview(token).then((r) => setAnalytics(r.analytics)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;

  return (
    <div className="space-y-8">
      <h1 className="heading-lg">Platform Overview</h1>
      {analytics && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Businesses', value: analytics.overview.businesses },
            { label: 'Active Subs', value: analytics.overview.activeSubs },
            { label: 'Reservations', value: analytics.overview.totalReservations },
            { label: 'Customers', value: analytics.overview.totalCustomers },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="surface-elevated rounded-lg p-6"
            >
              <p className="text-sm text-cream-muted">{s.label}</p>
              <p className="font-display text-3xl font-bold mt-1">{s.value}</p>
            </motion.div>
          ))}
        </div>
      )}
      <div className="surface-card rounded-lg p-6 border border-emerald-500/30">
        <p className="text-emerald-400 font-medium">Platform Status: {analytics?.platformHealth || 'operational'}</p>
        <p className="text-sm text-cream-muted mt-2">Billing-ready subscription structure · Multi-tenant isolation · AI-ready modules</p>
      </div>
    </div>
  );
}
