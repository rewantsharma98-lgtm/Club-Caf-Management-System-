'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AuditPage() {
  const [logs, setLogs] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    api.getAuditLogs(token).then((r) => setLogs(r.data as Record<string, unknown>[])).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;

  return (
    <div className="space-y-6">
      <h1 className="heading-lg">Audit Logs</h1>
      <div className="table-scroll surface-card rounded-lg overflow-hidden">
        <table className="data-table w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-cream-muted">
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Resource</th>
              <th className="px-4 py-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={String(log._id)} className="border-b border-white/5">
                <td className="px-4 py-3">{String(log.action)}</td>
                <td className="px-4 py-3 text-cream-muted">{String(log.resource || '-')}</td>
                <td className="px-4 py-3 text-slate">{new Date(String(log.createdAt)).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
