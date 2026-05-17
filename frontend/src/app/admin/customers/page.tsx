'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminLayoutShell from '@/components/admin/AdminLayoutShell';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { api, Customer } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { formatDate, statusColors } from '@/lib/utils';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [selected, setSelected] = useState<Customer | null>(null);

  const load = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: '10' };
      if (search) params.search = search;
      const res = await api.getCustomers(token, params);
      setCustomers(res.data);
      setPages(res.pagination.pages);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const viewDetails = async (id: string) => {
    const token = getToken();
    if (!token) return;
    const res = await api.getCustomer(token, id);
    setSelected(res.data);
  };

  return (
    <AdminLayoutShell title="Customers">
      <div className="mb-6 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" size={18} />
        <input
          className="input-field pl-10"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
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
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Visits</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3 text-cream-muted">{c.phone}</td>
                    <td className="px-4 py-3 text-cream-muted">{c.email}</td>
                    <td className="px-4 py-3">{c.totalVisits}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => viewDetails(c._id)}
                        className="text-cyan hover:underline text-sm"
                      >
                        View History
                      </button>
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
            className="flex items-center gap-1 text-sm text-cream-muted disabled:opacity-30"
          >
            <ChevronLeft size={18} /> Prev
          </button>
          <span className="text-sm text-cream-muted">Page {page} of {pages || 1}</span>
          <button
            type="button"
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-1 text-sm text-cream-muted disabled:opacity-30"
          >
            Next <ChevronRight size={18} />
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg max-h-[80vh] overflow-y-auto glass-strong rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{selected.name}</h2>
                <button type="button" onClick={() => setSelected(null)}>
                  <X size={20} />
                </button>
              </div>
              <p className="text-sm text-cream-muted mb-4">
                {selected.email} · {selected.phone} · {selected.totalVisits} visits
              </p>
              <h3 className="text-sm font-medium text-cyan mb-2">Reservation History</h3>
              <div className="space-y-2">
                {(selected.reservations as import('@/lib/api').Reservation[])?.length ? (
                  (selected.reservations as import('@/lib/api').Reservation[]).map((r) => (
                    <div key={r._id} className="rounded-xl glass p-3 text-sm flex justify-between">
                      <span>{formatDate(r.date)} · {r.time}</span>
                      <span className={`text-xs rounded-full border px-2 py-0.5 ${statusColors[r.status]}`}>
                        {r.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate text-sm">No reservations</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayoutShell>
  );
}
