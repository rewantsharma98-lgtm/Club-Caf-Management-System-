'use client';

import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';

export default function AdminLayoutShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen min-h-[100dvh] overflow-x-hidden bg-ink">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-60">
        <AdminNavbar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="mx-auto max-w-7xl p-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:p-8">{children}</main>
      </div>
    </div>
  );
}
