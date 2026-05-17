'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Check, X, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminLayoutShell from '@/components/admin/AdminLayoutShell';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { api, Reservation, ReservationStatus } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { formatDate, statusColors } from '@/lib/utils';

const statuses: (ReservationStatus | '')[] = ['', 'Pending', 'Approved', 'Rejected', 'Completed'];

export default function ReservationsPage() {
  const [data, setData] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const load = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: '10' };
      if (search) params.search = search;
      if (status) params.status = status;
      const res = await api.getReservations(token, params);
      setData(res.data);
      setPages(res.pagination.pages);
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const updateStatus = async (id: string, newStatus: ReservationStatus) => {
    const token = getToken();
    if (!token) return;
    await api.updateReservation(token, id, { status: newStatus });
    load();
  };

  const approve = async (id: string) => {
    const token = getToken();
    if (!token) return;
    await api.approveReservation(token, id);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this reservation?')) return;
    const token = getToken();
    if (!token) return;
    await api.deleteReservation(token, id);
    load();
  };

  return (
    <AdminLayoutShell title="Reservations">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" size={18} />
          <input
            className="input-field pl-10"
            placeholder="Search name, phone, email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <select
          className="input-field w-full sm:w-48"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          {statuses.map((s) => (
            <option key={s || 'all'} value={s} className="bg-charcoal">
              {s || 'All Statuses'}
            </option>
          ))}
        </select>
      </div>

      <motion.div className="surface-card rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="table-scroll">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-cream-muted">
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Guests</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((r) => (
                  <tr key={r._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-medium">{r.customerName}</td>
                    <td className="px-4 py-3 text-cream-muted">{r.phone}</td>
                    <td className="px-4 py-3">{r.guests}</td>
                    <td className="px-4 py-3">{formatDate(r.date)}</td>
                    <td className="px-4 py-3">{r.time}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2 py-0.5 text-xs ${statusColors[r.status]}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {r.status === 'Pending' && (
                          <>
                            <ActionBtn onClick={() => approve(r._id)} title="Approve" color="text-emerald-400">
                              <Check size={16} />
                            </ActionBtn>
                            <ActionBtn onClick={() => updateStatus(r._id, 'Rejected')} title="Reject" color="text-red-400">
                              <X size={16} />
                            </ActionBtn>
                          </>
                        )}
                        {r.status === 'Approved' && (
                          <ActionBtn onClick={() => updateStatus(r._id, 'Completed')} title="Complete" color="text-cyan">
                            <Check size={16} />
                          </ActionBtn>
                        )}
                        <ActionBtn onClick={() => remove(r._id)} title="Delete" color="text-slate hover:text-red-400">
                          <Trash2 size={16} />
                        </ActionBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="flex items-center gap-1 text-sm text-cream-muted disabled:opacity-30 hover:text-cyan"
          >
            <ChevronLeft size={18} /> Prev
          </button>
          <span className="text-sm text-cream-muted">
            Page {page} of {pages || 1}
          </span>
          <button
            type="button"
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-1 text-sm text-cream-muted disabled:opacity-30 hover:text-cyan"
          >
            Next <ChevronRight size={18} />
          </button>
        </div>
      </motion.div>
    </AdminLayoutShell>
  );
}

function ActionBtn({
  children,
  onClick,
  title,
  color,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  color: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`rounded-lg p-2 transition-colors hover:bg-white/5 ${color}`}
    >
      {children}
    </button>
  );
}
