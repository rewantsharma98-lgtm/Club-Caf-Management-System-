'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';

const posts = [
  'https://images.unsplash.com/photo-1571266028243-e4733b0fbf6c?w=400&q=80',
  'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
  'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&q=80',
];

export default function SocialSection() {
  return (
    <section className="section-padding bg-surface border-t border-border">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="section-label">Follow along</p>
            <h2 className="heading-lg mt-3">@openhousecafe</h2>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-cream-muted hover:text-cream transition-colors"
          >
            <Instagram size={18} />
            View on Instagram
          </a>
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
          {posts.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="relative aspect-square overflow-hidden rounded-lg"
            >
              <Image src={src} alt="" fill className="object-cover" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
