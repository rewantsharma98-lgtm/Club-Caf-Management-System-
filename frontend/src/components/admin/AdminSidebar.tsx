'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarCheck,
  Calendar,
  Users,
  Settings,
  LogOut,
  X,
  BarChart3,
  Gift,
  Building2,
  Zap,
  Bell,
  QrCode,
  ListOrdered,
} from 'lucide-react';
import { removeToken } from '@/lib/auth';

const menu = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/reservations', label: 'Reservations', icon: CalendarCheck },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/loyalty', label: 'Loyalty', icon: Gift },
  { href: '/admin/branches', label: 'Branches', icon: Building2 },
  { href: '/admin/automation', label: 'Automation', icon: Zap },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/qr', label: 'QR Scanner', icon: QrCode },
  { href: '/admin/waitlist', label: 'Waitlist', icon: ListOrdered },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    removeToken();
    router.push('/admin/login');
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} aria-hidden />
      )}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-60 flex-col border-r border-border bg-surface transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-b border-border px-5 py-5">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="font-display text-lg text-cream" onClick={onClose}>
              Lumina <span className="text-gold">Ops</span>
            </Link>
            <button
              type="button"
              className="touch-target rounded-md text-cream-muted lg:hidden"
              onClick={onClose}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {menu.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={onClose}>
                <span
                  className={`mb-0.5 flex min-h-[44px] items-center gap-3 rounded-md px-3 py-3 text-sm transition-colors ${
                    active
                      ? 'bg-elevated text-cream border border-border'
                      : 'text-cream-muted hover:bg-elevated/60 hover:text-cream'
                  }`}
                >
                  <item.icon size={17} strokeWidth={1.5} />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3 space-y-1">
          <Link
            href="/portal/login"
            className="block px-3 py-2 text-xs text-cream-muted hover:text-gold transition-colors"
          >
            Customer portal →
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-cream-muted hover:bg-elevated hover:text-cream transition-colors"
          >
            <LogOut size={17} strokeWidth={1.5} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
