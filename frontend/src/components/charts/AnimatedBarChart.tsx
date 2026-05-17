'use client';

import { motion } from 'framer-motion';

export default function AnimatedBarChart({
  data,
  maxValue,
}: {
  data: { label: string; value: number }[];
  maxValue?: number;
}) {
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex h-44 items-end justify-between gap-2" role="img" aria-label="Bar chart">
      {data.map((item, i) => (
        <div key={item.label} className="flex flex-1 flex-col items-center gap-2 min-w-0">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(item.value / max) * 100}%` }}
            transition={{ delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full min-h-[2px] rounded-sm bg-gold/80"
            style={{ maxHeight: '100%' }}
          />
          <span className="text-[10px] text-slate truncate w-full text-center">{item.label}</span>
          <span className="text-xs text-cream-muted">{item.value}</span>
        </div>
      ))}
    </div>
  );
}
