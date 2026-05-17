'use client';

import AdminLayoutShell from '@/components/admin/AdminLayoutShell';

export default function WaitlistPage() {
  return (
    <AdminLayoutShell title="Waitlist">
      <div className="surface-card rounded-lg p-8 text-center max-w-lg mx-auto">
        <p className="text-cream-muted">
          Waitlist automation is active. Guests can join via API when capacity is reached.
          Manage entries through the automation panel.
        </p>
      </div>
    </AdminLayoutShell>
  );
}
