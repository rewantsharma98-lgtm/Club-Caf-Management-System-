'use client';

import { motion } from 'framer-motion';
import AdminLayoutShell from '@/components/admin/AdminLayoutShell';

export default function SettingsPage() {
  return (
    <AdminLayoutShell title="Settings">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl surface-card rounded-lg p-8"
      >
        <h2 className="font-semibold text-lg">Venue Settings</h2>
        <p className="mt-2 text-sm text-cream-muted">
          Phase 1 settings are managed via environment variables. Advanced venue configuration
          will be available in future releases.
        </p>
        <div className="mt-8 space-y-4 text-sm">
          <SettingRow label="Platform" value="luminalounge.com" />
          <SettingRow label="Environment" value={process.env.NODE_ENV || 'development'} />
          <SettingRow label="API URL" value={process.env.NEXT_PUBLIC_API_URL || 'https://club-caf-management-system.onrender.com'} />
        </div>
      </motion.div>
    </AdminLayoutShell>
  );
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-white/5 pb-3">
      <span className="text-cream-muted">{label}</span>
      <span className="text-cream font-mono text-xs">{value}</span>
    </div>
  );
}

