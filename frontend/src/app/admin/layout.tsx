'use client';

import { usePathname } from 'next/navigation';
import AdminGuard from '@/components/admin/AdminGuard';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname?.startsWith('/admin/login');

  if (isLogin) return <>{children}</>;

  return <AdminGuard>{children}</AdminGuard>;
}
