'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

export default function StatCard({
  title,
  value,
  icon: Icon,
  delay = 0,
}: {
  title: string;
  value: number;
  icon: LucideIcon;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="surface-card p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate">{title}</p>
          <p className="mt-2 font-display text-3xl text-cream">{value}</p>
        </div>
        <div className="rounded-md border border-border bg-elevated p-2.5 text-cream-muted">
          <Icon size={18} strokeWidth={1.5} />
        </div>
      </div>
    </motion.div>
  );
}
