'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { getToken, removeToken } from '@/lib/auth';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const verifyStarted = useRef(false);

  useEffect(() => {
    if (verifyStarted.current) return;
    verifyStarted.current = true;

    const token = getToken();
    if (!token) {
      router.replace('/admin/login');
      return;
    }
    api
      .verify(token)
      .then((r) => {
        if (r.user.role !== 'super_admin') {
          router.replace('/admin');
          return;
        }
        setReady(true);
      })
      .catch(() => {
        removeToken();
        router.replace('/admin/login');
      });
  }, [router]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const nav = [
    { href: '/super-admin', label: 'Overview' },
    { href: '/super-admin/businesses', label: 'Businesses' },
    { href: '/super-admin/onboard', label: 'Onboard' },
    { href: '/super-admin/plans', label: 'Plans' },
    { href: '/super-admin/audit', label: 'Audit' },
  ];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-ink">
      <header className="sticky top-0 z-40 border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 sm:py-4">
          <Link href="/super-admin" className="min-w-0 truncate font-display text-base text-cream sm:text-lg">
            Lumina <span className="text-gold">Platform</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => {
                removeToken();
                router.push('/admin/login');
              }}
              className="hidden min-h-[44px] items-center px-2 text-sm text-cream-muted hover:text-cream sm:inline-flex"
            >
              Sign out
            </button>
            <button
              type="button"
              className="touch-target rounded-md text-cream md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        <nav className="mx-auto hidden max-w-7xl gap-6 px-4 pb-3 sm:px-6 md:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={pathname === n.href ? 'nav-link-active text-sm' : 'nav-link text-sm'}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        {menuOpen && (
          <nav className="border-t border-border px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
            <div className="flex flex-col">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`flex min-h-[48px] items-center border-b border-border/50 text-sm ${
                    pathname === n.href ? 'text-cream' : 'text-cream-muted'
                  }`}
                >
                  {n.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => {
                  removeToken();
                  router.push('/admin/login');
                }}
                className="mt-3 min-h-[48px] text-left text-sm text-cream-muted hover:text-cream"
              >
                Sign out
              </button>
            </div>
          </nav>
        )}
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
    </div>
  );
}
