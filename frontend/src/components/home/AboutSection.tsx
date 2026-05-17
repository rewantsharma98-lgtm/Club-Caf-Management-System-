'use client';

import { motion } from 'framer-motion';
import SafeImage from '@/components/ui/SafeImage';
import { FALLBACK_IMAGE } from '@/lib/media';

const pillars = [
  {
    title: 'Craft & care',
    desc: 'Seasonal cocktails, thoughtful service, and spaces designed for conversation.',
  },
  {
    title: 'Curated nights',
    desc: 'Live music, resident DJs, and programming that rewards repeat guests.',
  },
  {
    title: 'Seamless hosting',
    desc: 'Reservations, memberships, and operations built for modern hospitality teams.',
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="section-padding bg-surface border-t border-border">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="section-label">Our story</p>
            <h2 className="heading-lg mt-3">Hospitality with a point of view</h2>
            <p className="mt-6 text-body">
              Lumina began as a single lounge with a simple belief: great nights are designed,
              not improvised. Today we host operators who expect the same intention behind the reservation
              as behind the pour.
            </p>
            <p className="mt-4 text-body">
              Every detail — from seating preferences to member rewards — is built to feel personal,
              never automated for its own sake.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative aspect-[4/5] overflow-hidden rounded-lg"
          >
            <SafeImage
              src={FALLBACK_IMAGE}
              alt="Lounge interior"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="surface-card p-6"
            >
              <h3 className="font-display text-xl text-cream">{p.title}</h3>
              <p className="mt-2 text-sm text-body">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
