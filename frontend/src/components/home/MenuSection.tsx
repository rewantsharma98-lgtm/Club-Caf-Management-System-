'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api, MenuItemRecord } from '@/lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import SafeImage from '@/components/ui/SafeImage';
import { FALLBACK_MENU_FEATURED } from '@/lib/media';

export default function MenuSection() {
  const [featured, setFeatured] = useState<MenuItemRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getMenu()
      .then((r) => setFeatured((r.data.featured || []).slice(0, 4)))
      .catch(() => setFeatured(FALLBACK_MENU_FEATURED as MenuItemRecord[]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="menu" className="section-padding border-t border-border bg-surface/50">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="section-label">From the bar</p>
            <h2 className="heading-lg mt-3">Menu preview</h2>
          </div>
          <Link href="/menu" className="btn-outline inline-flex w-full text-sm sm:w-fit">
            See full menu
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner />
          </div>
        ) : featured.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((item, i) => (
              <motion.article
                key={item._id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                className="group"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg surface-card">
                  {item.image ? (
                    <SafeImage
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-elevated" />
                  )}
                </div>
                <p className="mt-4 text-xs uppercase tracking-wider text-gold capitalize">
                  {item.category}
                </p>
                <h3 className="mt-1 font-display text-lg text-cream">{item.name}</h3>
                <p className="text-sm text-gold mt-1">${item.price}</p>
              </motion.article>
            ))}
          </div>
        ) : (
          <p className="text-center text-body py-12">Menu coming soon.</p>
        )}
      </div>
    </section>
  );
}
