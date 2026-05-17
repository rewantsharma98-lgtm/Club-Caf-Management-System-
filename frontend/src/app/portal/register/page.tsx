'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { setPortalToken } from '@/lib/portalAuth';
import { BRAND } from '@/lib/brand';
import Button from '@/components/ui/Button';

export default function PortalRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.portalRegister({ ...form, businessSlug: BRAND.businessSlug });
      setPortalToken(res.token);
      router.push('/portal');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-midnight py-12">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={submit}
        className="w-full max-w-md glass-strong rounded-3xl p-8 space-y-4"
      >
        <h1 className="font-display text-2xl font-bold text-center">Join the Experience</h1>
        <p className="text-sm text-cream-muted text-center">Earn 100 welcome points instantly</p>
        <input className="input-field" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="input-field" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="input-field" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
        <input className="input-field" type="password" placeholder="Password (min 6)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">{loading ? 'Creating...' : 'Create Account'}</Button>
        <p className="text-center text-sm text-cream-muted">
          Already a member? <Link href="/portal/login" className="text-cyan">Sign in</Link>
        </p>
      </motion.form>
    </div>
  );
}
