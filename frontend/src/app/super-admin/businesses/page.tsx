'use client';

import { useEffect, useState } from 'react';
import { api, Business } from '@/lib/api';
import { getToken } from '@/lib/auth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function SuperBusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    api.getBusinesses(token).then((r) => setBusinesses(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner /></div>;

  return (
    <div className="space-y-6">
      <h1 className="heading-lg">Businesses</h1>
      <div className="grid gap-4">
        {businesses.map((b) => (
          <div key={b._id} className="surface-card rounded-lg p-6 flex justify-between">
            <div>
              <h3 className="font-semibold">{b.name}</h3>
              <p className="text-sm text-cream-muted">{b.type} · {b.slug}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${b.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
              {b.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
