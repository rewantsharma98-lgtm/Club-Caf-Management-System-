'use client';

import { useEffect, useState } from 'react';
import { api, Branch } from '@/lib/api';
import { getToken, getBranchId, setBranchId } from '@/lib/auth';

export default function BranchSwitcher({ onChange }: { onChange?: () => void }) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selected, setSelected] = useState('');

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    api.getBranches(token).then((r) => {
      setBranches(r.data);
      const saved = getBranchId();
      if (saved && r.data.some((b) => b._id === saved)) setSelected(saved);
    });
  }, []);

  const handleChange = (id: string) => {
    setSelected(id);
    setBranchId(id || null);
    window.dispatchEvent(new Event('ohc-branch-change'));
    onChange?.();
  };

  if (!branches.length) return null;

  return (
    <select
      value={selected}
      onChange={(e) => handleChange(e.target.value)}
      className="max-w-[140px] min-h-[44px] truncate rounded-md border border-border bg-elevated px-3 py-2 text-xs text-cream-muted focus:border-gold/40 outline-none sm:max-w-none sm:min-h-0 sm:py-1.5"
      aria-label="Select branch"
    >
      <option value="">All branches</option>
      {branches.map((b) => (
        <option key={b._id} value={b._id}>
          {b.name}
        </option>
      ))}
    </select>
  );
}
