'use client';

import { useEffect, useState } from 'react';
import { CalendarCheck, Clock, CheckCircle, Calendar } from 'lucide-react';
import AdminLayoutShell from '@/components/admin/AdminLayoutShell';
import StatCard from '@/components/admin/StatCard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { api, Reservation } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { formatDate, statusColors } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, todayBookings: 0 });
  const [recent, setRecent] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    api
      .getStats(token)
      .then((res) => {
        setStats(res.stats);
        setRecent(res.recent);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayoutShell title="Dashboard">
      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Total Reservations" value={stats.total} icon={CalendarCheck} delay={0} />
            <StatCard title="Pending" value={stats.pending} icon={Clock} delay={0.05} />
            <StatCard title="Approved" value={stats.approved} icon={CheckCircle} delay={0.1} />
            <StatCard title="Today's Bookings" value={stats.todayBookings} icon={Calendar} delay={0.15} />
          </div>

          <div className="mt-8 panel">
            <div className="panel-header">
              <h2 className="text-sm font-medium text-cream">Recent activity</h2>
            </div>
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Guests</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((r) => (
                    <tr key={r._id}>
                      <td className="text-cream">{r.customerName}</td>
                      <td>{formatDate(r.date)}</td>
                      <td>{r.guests}</td>
                      <td>
                        <span className={`badge ${statusColors[r.status]}`}>{r.status}</span>
                      </td>
                    </tr>
                  ))}
                  {recent.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate">
                        No reservations yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminLayoutShell>
  );
}
