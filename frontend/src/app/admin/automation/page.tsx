'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AdminLayoutShell from '@/components/admin/AdminLayoutShell';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Button from '@/components/ui/Button';
import { api, AutomationRule } from '@/lib/api';
import { getToken } from '@/lib/auth';

const triggers = [
  'reservation_created',
  'reservation_approved',
  'visit_completed',
  'event_booked',
  'birthday',
  'waitlist_slot',
  'capacity_reached',
] as const;

const actions = ['auto_confirm', 'send_notification', 'award_points', 'add_to_waitlist', 'send_offer'] as const;

export default function AutomationPage() {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    trigger: 'reservation_created' as (typeof triggers)[number],
    action: 'send_notification' as (typeof actions)[number],
    isActive: true,
  });

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    api.getAutomationRules(token).then((r) => setRules(r.data)).finally(() => setLoading(false));
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;
    setSaving(true);
    try {
      const res = await api.createAutomationRule(token, form);
      setRules((prev) => [...prev, res.data]);
      setForm({ name: '', trigger: 'reservation_created', action: 'send_notification', isActive: true });
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    const token = getToken();
    if (!token) return;
    await api.deleteAutomationRule(token, id);
    setRules((prev) => prev.filter((r) => r._id !== id));
  };

  return (
    <AdminLayoutShell title="Automation">
      <motion.div className="flex justify-end mb-6">
        <Button type="button" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : 'New Workflow'}
        </Button>
      </motion.div>
      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={create}
          className="surface-card rounded-lg p-6 mb-8 space-y-4 max-w-xl"
        >
          <input
            className="input-field"
            placeholder="Rule name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <select
              className="input-field"
              value={form.trigger}
              onChange={(e) =>
                setForm({ ...form, trigger: e.target.value as (typeof triggers)[number] })
              }
            >
              {triggers.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <select
              className="input-field"
              value={form.action}
              onChange={(e) => setForm({ ...form, action: e.target.value as (typeof actions)[number] })}
            >
              {actions.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Create Rule'}
          </Button>
        </motion.form>
      )}
      {loading ? (
        <motion.div className="flex justify-center py-20">
          <LoadingSpinner />
        </motion.div>
      ) : (
        <motion.div className="space-y-4">
          {rules.map((rule) => (
            <motion.div
              key={rule._id}
              className="surface-card rounded-lg p-6 flex justify-between items-start"
            >
              <motion.div>
                <h3 className="font-semibold">{rule.name}</h3>
                <p className="text-sm text-cream-muted mt-1">
                  When <span className="text-cyan">{rule.trigger}</span> →{' '}
                  <span className="text-cyan">{rule.action}</span>
                </p>
                <span
                  className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${
                    rule.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-slate'
                  }`}
                >
                  {rule.isActive ? 'Active' : 'Inactive'}
                </span>
              </motion.div>
              <button type="button" onClick={() => remove(rule._id)} className="text-sm text-red-400">
                Delete
              </button>
            </motion.div>
          ))}
          {!rules.length && (
            <p className="text-slate text-center py-12">No automation rules configured.</p>
          )}
        </motion.div>
      )}
    </AdminLayoutShell>
  );
}
