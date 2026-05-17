'use client';

import { usePathname } from 'next/navigation';
import PortalGuard from '@/components/portal/PortalGuard';
import PortalShell from '@/components/portal/PortalShell';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = pathname?.includes('/login') || pathname?.includes('/register');

  if (isAuth) return <>{children}</>;

  return (
    <PortalGuard>
      <PortalShell>{children}</PortalShell>
    </PortalGuard>
  );
}
