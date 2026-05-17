'use client';

import { motion } from 'framer-motion';

export default function GlowLineChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const w = 100;
  const h = 100;
  const points = data.map((d, i) => {
    const x = data.length > 1 ? (i / (data.length - 1)) * w : w / 2;
    const y = h - (d.value / max) * h;
    return `${x},${y}`;
  });
  const pathD = points.length ? `M ${points.join(' L ')}` : '';

  return (
    <div className="h-44 w-full" role="img" aria-label="Line chart">
      <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full" preserveAspectRatio="none">
        <motion.path
          d={pathD}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-gold"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="mt-2 flex justify-between text-[10px] text-slate">
        {data.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}
