'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AdminLayoutShell from '@/components/admin/AdminLayoutShell';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import { api, Branch } from '@/lib/api';
import { getToken } from '@/lib/auth';

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', address: '', capacity: 100 });

  const load = () => {
    const token = getToken();
    if (!token) return;
    api.getBranches(token).then((r) => setBranches(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;
    setSaving(true);
    try {
      const res = await api.createBranch(token, { ...form, code: form.code.toUpperCase() });
      setBranches((prev) => [...prev, res.data]);
      setForm({ name: '', code: '', address: '', capacity: 100 });
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayoutShell title="Branches">
      <motion.div className="flex justify-end mb-6">
        <Button type="button" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : 'Add Branch'}
        </Button>
      </motion.div>
      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={create}
          className="surface-card rounded-lg p-6 mb-8 grid gap-4 md:grid-cols-2"
        >
          <input
            className="input-field"
            placeholder="Branch name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="input-field uppercase"
            placeholder="Code (e.g. MAIN)"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            required
          />
          <input
            className="input-field md:col-span-2"
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <input
            type="number"
            className="input-field"
            placeholder="Capacity"
            value={form.capacity}
            onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
            min={1}
          />
          <Button type="submit" disabled={saving} className="md:col-span-2">
            {saving ? 'Creating...' : 'Create Branch'}
          </Button>
        </motion.form>
      )}
      {loading ? (
        <motion.div className="flex justify-center py-20">
          <LoadingSpinner />
        </motion.div>
      ) : (
        <motion.div className="grid gap-6 md:grid-cols-2">
          {branches.map((b) => (
            <motion.div key={b._id} className="surface-card rounded-lg p-6">
              <p className="text-xs text-cyan font-mono">{b.code}</p>
              <h3 className="font-semibold text-lg mt-1">{b.name}</h3>
              <p className="text-sm text-cream-muted mt-2">{b.address}</p>
              <p className="text-sm text-slate mt-2">Capacity: {b.capacity}</p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AdminLayoutShell>
  );
}
