'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Gift, Crown, Calendar, Bell, QrCode, LogOut, User } from 'lucide-react';
import { removePortalToken } from '@/lib/portalAuth';

const nav = [
  { href: '/portal', label: 'Home', icon: LayoutDashboard },
  { href: '/portal/loyalty', label: 'Loyalty', icon: Gift },
  { href: '/portal/membership', label: 'Membership', icon: Crown },
  { href: '/portal/reservations', label: 'Bookings', icon: Calendar },
  { href: '/portal/notifications', label: 'Alerts', icon: Bell },
  { href: '/portal/qr', label: 'QR', icon: QrCode },
  { href: '/portal/profile', label: 'Profile', icon: User },
];

export default function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-ink">
      <header className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:py-4">
          <Link href="/portal" className="font-display text-lg text-cream">
            Lumina <span className="text-gold">Member</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              removePortalToken();
              router.push('/portal/login');
            }}
            className="touch-target rounded-md text-cream-muted hover:text-cream"
            aria-label="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
        <nav className="scroll-tabs mx-auto max-w-5xl px-4 pb-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-[44px] shrink-0 items-center gap-2 rounded-md px-3 py-2.5 text-xs transition-colors ${
                pathname === item.href
                  ? 'bg-elevated text-cream border border-border'
                  : 'text-cream-muted hover:text-cream'
              }`}
            >
              <item.icon size={14} strokeWidth={1.5} />
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:py-8">{children}</main>
    </div>
  );
}
