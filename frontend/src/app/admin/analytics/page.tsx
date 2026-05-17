'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AdminLayoutShell from '@/components/admin/AdminLayoutShell';
import AnimatedBarChart from '@/components/charts/AnimatedBarChart';
import GlowLineChart from '@/components/charts/GlowLineChart';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { api, BusinessAnalytics } from '@/lib/api';
import { getToken, getBranchId } from '@/lib/auth';

export default function AnalyticsPage() {
  const [data, setData] = useState<BusinessAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    const branchId = getBranchId();
    const params = branchId ? { branchId } : undefined;
    api.getBusinessAnalytics(token, params).then((r) => setData(r.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    const onBranch = () => load();
    window.addEventListener('ohc-branch-change', onBranch);
    return () => window.removeEventListener('ohc-branch-change', onBranch);
  }, [load]);

  const peakChart = data?.peakHours?.map((p) => ({ label: p.hour, value: p.count })) || [];
  const eventChart =
    data?.eventPerformance?.map((e) => ({ label: e.title.slice(0, 12), value: e.fillRate })) || [];

  return (
    <AdminLayoutShell title="Analytics">
      {loading ? (
        <motion.div className="flex justify-center py-20">
          <LoadingSpinner />
        </motion.div>
      ) : data ? (
        <motion.div className="space-y-8">
          <motion.div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Reservations', value: data.overview.totalReservations },
              { label: 'Retention', value: `${data.overview.retentionRate}%` },
              { label: 'Repeat Guests', value: data.overview.repeatCustomers },
              { label: 'Loyalty Issued', value: data.overview.loyaltyPointsIssued },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="surface-card rounded-lg p-6"
              >
                <p className="text-sm text-cream-muted">{s.label}</p>
                <p className="font-display text-3xl font-bold mt-1">{s.value}</p>
              </motion.div>
            ))}
          </motion.div>
          <motion.div className="grid gap-6 lg:grid-cols-2">
            <motion.div className="surface-card rounded-lg p-6">
              <h2 className="font-semibold mb-4">Booking Growth</h2>
              <AnimatedBarChart data={data.bookingGrowth} />
            </motion.div>
            <motion.div className="surface-card rounded-lg p-6">
              <h2 className="font-semibold mb-4">Trend Line</h2>
              <GlowLineChart data={data.bookingGrowth} />
            </motion.div>
          </motion.div>
          <motion.div className="grid gap-6 lg:grid-cols-2">
            <motion.div className="surface-card rounded-lg p-6">
              <h2 className="font-semibold mb-4">Peak Operational Hours</h2>
              {peakChart.length ? (
                <AnimatedBarChart data={peakChart} />
              ) : (
                <p className="text-sm text-slate py-8 text-center">Not enough booking data yet.</p>
              )}
            </motion.div>
            <motion.div className="surface-card rounded-lg p-6">
              <h2 className="font-semibold mb-4">Event Performance (% fill)</h2>
              {eventChart.length ? (
                <AnimatedBarChart data={eventChart} maxValue={100} />
              ) : (
                <p className="text-sm text-slate py-8 text-center">No upcoming events to analyze.</p>
              )}
            </motion.div>
          </motion.div>
          {data.eventPerformance?.length > 0 && (
            <motion.div className="surface-card rounded-lg p-6">
              <h2 className="font-semibold mb-4">Event Details</h2>
              <div className="space-y-3">
                {data.eventPerformance.map((e) => (
                  <motion.div
                    key={e.title}
                    className="flex items-center justify-between text-sm border-b border-white/5 pb-2"
                  >
                    <span>{e.title}</span>
                    <span className="text-cyan font-medium">{e.fillRate}% capacity</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
          <motion.div className="surface-card rounded-lg p-6">
            <h2 className="font-semibold text-cyan mb-4">Operational Insights</h2>
            <ul className="space-y-2">
              {data.insights.map((insight) => (
                <li key={insight} className="text-sm text-cream-muted border-l-2 border-gold/30 pl-4">
                  {insight}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      ) : null}
    </AdminLayoutShell>
  );
}
