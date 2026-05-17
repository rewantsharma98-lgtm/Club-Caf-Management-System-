'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api, SubscriptionPlan } from '@/lib/api';
import { getToken } from '@/lib/auth';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function OnboardBusinessPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({
    businessName: '',
    businessSlug: '',
    businessType: 'cafe',
    ownerName: '',
    ownerEmail: '',
    ownerPassword: '',
    planId: '',
  });

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    api.getPlans(token).then((r) => setPlans(r.data)).finally(() => setLoading(false));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;
    setSaving(true);
    setMsg('');
    try {
      await api.onboardBusiness(token, {
        business: {
          name: form.businessName,
          slug: form.businessSlug,
          type: form.businessType,
        },
        owner: {
          username: form.ownerName,
          email: form.ownerEmail,
          password: form.ownerPassword,
        },
        planId: form.planId || undefined,
      });
      setMsg('Business onboarded successfully');
      setForm({
        businessName: '',
        businessSlug: '',
        businessType: 'cafe',
        ownerName: '',
        ownerEmail: '',
        ownerPassword: '',
        planId: '',
      });
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Onboarding failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <motion.div className="flex justify-center py-20">
        <LoadingSpinner />
      </motion.div>
    );
  }

  return (
    <motion.div className="space-y-8 max-w-2xl">
      <h1 className="heading-lg">Onboard Business</h1>
      <motion.form
        onSubmit={submit}
        className="surface-elevated rounded-lg p-8 space-y-4"
      >
        <input
          className="input-field"
          placeholder="Business name"
          value={form.businessName}
          onChange={(e) => setForm({ ...form, businessName: e.target.value })}
          required
        />
        <input
          className="input-field"
          placeholder="Slug (e.g. moonlounge)"
          value={form.businessSlug}
          onChange={(e) => setForm({ ...form, businessSlug: e.target.value.toLowerCase() })}
          required
        />
        <select
          className="input-field"
          value={form.businessType}
          onChange={(e) => setForm({ ...form, businessType: e.target.value })}
        >
          <option value="cafe">Cafe</option>
          <option value="pub">Pub</option>
          <option value="restaurant">Restaurant</option>
          <option value="lounge">Lounge</option>
          <option value="club">Club</option>
        </select>
        <hr className="border-white/10" />
        <input
          className="input-field"
          placeholder="Owner display name"
          value={form.ownerName}
          onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
          required
        />
        <input
          type="email"
          className="input-field"
          placeholder="Owner email"
          value={form.ownerEmail}
          onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })}
          required
        />
        <input
          type="password"
          className="input-field"
          placeholder="Owner password"
          value={form.ownerPassword}
          onChange={(e) => setForm({ ...form, ownerPassword: e.target.value })}
          required
        />
        <select
          className="input-field"
          value={form.planId}
          onChange={(e) => setForm({ ...form, planId: e.target.value })}
        >
          <option value="">No plan (optional)</option>
          {plans.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name} — ${p.priceMonthly}/mo
            </option>
          ))}
        </select>
        <Button type="submit" disabled={saving} className="w-full">
          {saving ? 'Onboarding...' : 'Create Business'}
        </Button>
        {msg && <p className="text-sm text-cyan text-center">{msg}</p>}
      </motion.form>
    </motion.div>
  );
}
