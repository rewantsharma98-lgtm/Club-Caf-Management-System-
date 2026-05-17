'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AdminLayoutShell from '@/components/admin/AdminLayoutShell';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import { api, Reward } from '@/lib/api';
import { getToken } from '@/lib/auth';

const categories = ['drink', 'discount', 'priority', 'event', 'birthday', 'vip'] as const;

export default function AdminLoyaltyPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    pointsCost: 100,
    category: 'drink' as (typeof categories)[number],
    vipOnly: false,
  });

  useEffect(() => {
    api.getRewards().then((r) => setRewards(r.data)).finally(() => setLoading(false));
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;
    setSaving(true);
    try {
      const res = await api.createReward(token, form);
      setRewards((prev) => [...prev, res.data]);
      setForm({ title: '', description: '', pointsCost: 100, category: 'drink', vipOnly: false });
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    const token = getToken();
    if (!token) return;
    await api.deleteReward(token, id);
    setRewards((prev) => prev.filter((r) => r._id !== id));
  };

  return (
    <AdminLayoutShell title="Loyalty & Rewards">
      <div className="flex justify-end mb-6">
        <Button type="button" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : 'Add Reward'}
        </Button>
      </div>
      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={create}
          className="surface-card rounded-lg p-6 mb-8 space-y-4 max-w-xl"
        >
          <input
            className="input-field"
            placeholder="Reward title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            className="input-field min-h-[80px]"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="number"
              className="input-field"
              placeholder="Points cost"
              value={form.pointsCost}
              onChange={(e) => setForm({ ...form, pointsCost: Number(e.target.value) })}
              min={1}
              required
            />
            <select
              className="input-field"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value as (typeof categories)[number] })
              }
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm text-cream-muted">
            <input
              type="checkbox"
              checked={form.vipOnly}
              onChange={(e) => setForm({ ...form, vipOnly: e.target.checked })}
            />
            VIP members only
          </label>
          <Button type="submit" disabled={saving}>
            {saving ? 'Creating...' : 'Create Reward'}
          </Button>
        </motion.form>
      )}
      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rewards.map((r) => (
            <div key={r._id} className="surface-card rounded-lg p-6">
              <h3 className="font-semibold">{r.title}</h3>
              <p className="text-sm text-cream-muted mt-1">{r.description}</p>
              <p className="text-cyan font-bold mt-3">{r.pointsCost} points</p>
              <p className="text-xs text-slate mt-1 capitalize">{r.category}</p>
              {r.vipOnly && <span className="text-xs text-amber-400">VIP Only</span>}
              <button
                type="button"
                onClick={() => remove(r._id)}
                className="mt-4 text-sm text-red-400 hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </AdminLayoutShell>
  );
}
