'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { api } from '@/lib/api';
import { setPortalToken } from '@/lib/portalAuth';
import { BRAND } from '@/lib/brand';
import { useHomeUI } from '@/context/HomeUIContext';

export default function AuthModal() {
  const router = useRouter();
  const { authOpen, closeAuth, authTab, setAuthTab } = useHomeUI();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [login, setLogin] = useState({ email: '', password: '' });
  const [signup, setSignup] = useState({ name: '', email: '', phone: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.portalLogin(login.email, login.password);
      setPortalToken(res.token);
      closeAuth();
      router.push('/portal');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.portalRegister({
        name: signup.name,
        email: signup.email,
        phone: signup.phone,
        password: signup.password,
        businessSlug: BRAND.businessSlug,
      });
      setPortalToken(res.token);
      closeAuth();
      router.push('/portal');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const titles = {
    login: 'Member sign in',
    signup: 'Create membership',
    forgot: 'Reset password',
  };

  const subtitles = {
    login: `${BRAND.fullName} member benefits & priority booking`,
    signup: 'Join for loyalty rewards and exclusive access',
    forgot: 'We will send reset instructions if your email is registered',
  };

  return (
    <Modal
      open={authOpen}
      onClose={closeAuth}
      title={titles[authTab]}
      subtitle={subtitles[authTab]}
    >
      <div className="flex max-h-[min(85dvh,calc(100dvh-7rem))] flex-col overflow-y-auto overscroll-contain px-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
      <div className="flex gap-1 mb-6 p-1 rounded-md bg-surface border border-border">
        {(['login', 'signup'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              setAuthTab(tab);
              setError('');
              setMessage('');
            }}
            className={`flex-1 min-h-[44px] rounded py-2.5 text-xs font-medium uppercase tracking-wider transition-colors ${
              authTab === tab ? 'bg-elevated text-cream' : 'text-cream-muted hover:text-cream'
            }`}
          >
            {tab === 'login' ? 'Login' : 'Sign up'}
          </button>
        ))}
      </div>

      {authTab === 'forgot' ? (
        <div className="space-y-4">
          <p className="text-sm text-body">
            Password reset is handled by our team during the beta. Email{' '}
            <a href={`mailto:${BRAND.email}`} className="text-gold hover:underline">
              {BRAND.email}
            </a>{' '}
            and we will assist you within 24 hours.
          </p>
          <button
            type="button"
            onClick={() => setAuthTab('login')}
            className="text-sm text-gold hover:underline"
          >
            Back to sign in
          </button>
        </div>
      ) : authTab === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            className="input-field"
            placeholder="Email"
            value={login.email}
            onChange={(e) => setLogin({ ...login, email: e.target.value })}
            required
          />
          <input
            type="password"
            className="input-field"
            placeholder="Password"
            value={login.password}
            onChange={(e) => setLogin({ ...login, password: e.target.value })}
            required
          />
          <button
            type="button"
            onClick={() => setAuthTab('forgot')}
            className="min-h-[44px] text-sm text-cream-muted hover:text-gold"
          >
            Forgot password?
          </button>
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <LoadingSpinner size="sm" /> : 'Sign in'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            className="input-field"
            placeholder="Full name"
            value={signup.name}
            onChange={(e) => setSignup({ ...signup, name: e.target.value })}
            required
          />
          <input
            type="email"
            className="input-field"
            placeholder="Email"
            value={signup.email}
            onChange={(e) => setSignup({ ...signup, email: e.target.value })}
            required
          />
          <input
            className="input-field"
            placeholder="Phone"
            value={signup.phone}
            onChange={(e) => setSignup({ ...signup, phone: e.target.value })}
            required
          />
          <input
            type="password"
            className="input-field"
            placeholder="Password (min 6 characters)"
            value={signup.password}
            onChange={(e) => setSignup({ ...signup, password: e.target.value })}
            minLength={6}
            required
          />
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          {message && <p className="text-sm text-gold text-center">{message}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <LoadingSpinner size="sm" /> : 'Create account'}
          </Button>
        </form>
      )}
      </div>
    </Modal>
  );
}
