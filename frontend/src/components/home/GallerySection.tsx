'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import SafeImage from '@/components/ui/SafeImage';
import { GALLERY_IMAGES } from '@/lib/media';

const TABS = ['All', 'Bar', 'Cocktails', 'Terrace', 'Events'] as const;
type Tab = (typeof TABS)[number];

const images = GALLERY_IMAGES.map((img) => ({ ...img, category: img.category as Tab }));

const amenities = [
  { icon: '♪', label: 'Live music' },
  { icon: '☀', label: 'Terrace' },
  { icon: '◇', label: 'Craft cocktails' },
  { icon: '◻', label: 'Private hire' },
];

export default function GallerySection() {
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const [lightbox, setLightbox] = useState<null | { src: string; alt: string }>(null);

  const filtered =
    activeTab === 'All' ? images : images.filter((img) => img.category === activeTab);

  // Always show first item as main if it exists
  const mainImg = filtered[0] ?? null;
  const rest = filtered.slice(1, 5);

  return (
    <>
      <section id="gallery" className="section-padding bg-surface border-t border-border">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl"
          >
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold mb-2 font-body">
              Gallery
            </p>
            <h2 className="heading-lg">The space</h2>
            <p className="mt-3 text-sm text-cream-muted font-body">
              Where every corner tells a story
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="scroll-tabs mt-10 gap-0 border-b border-border">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`min-h-[44px] shrink-0 px-4 sm:px-5 pb-3 pt-2 text-xs uppercase tracking-[0.12em] font-body transition-colors duration-200 border-b-2 -mb-px ${
                  activeTab === tab
                    ? 'text-gold border-gold'
                    : 'text-slate border-transparent hover:text-cream-muted'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3"
              style={{ gridAutoRows: 'minmax(110px, 1fr)' }}
            >
              {/* Main large cell */}
              {mainImg && (
                <motion.div
                  layoutId={mainImg.src}
                  className="relative overflow-hidden rounded-sm col-span-2 row-span-2 cursor-pointer group"
                  onClick={() => setLightbox({ src: mainImg.src, alt: mainImg.alt })}
                >
                  <SafeImage
                    src={mainImg.src}
                    alt={mainImg.alt}
                    fill
                    className="object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] brightness-90 saturate-[0.85] group-hover:scale-[1.04] group-hover:brightness-[0.65] group-hover:saturate-[0.7]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent pointer-events-none" />
                  {/* Expand icon */}
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full border border-gold/40 bg-gold/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#c4a574" strokeWidth="1.5">
                      <path d="M7.5 1.5H10.5V4.5M4.5 10.5H1.5V7.5M10.5 1.5L7 5M1.5 10.5L5 7" />
                    </svg>
                  </div>
                  {/* Label */}
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-gold mb-1 font-body">
                      {mainImg.cat}
                    </p>
                    <p className="font-display text-xl text-cream font-normal">
                      {mainImg.label}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Secondary cells */}
              {rest.map((img, i) => (
                <motion.div
                  key={img.src}
                  layoutId={img.src}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.06 + 0.1, duration: 0.5 }}
                  className="relative overflow-hidden rounded-sm cursor-pointer group"
                  onClick={() => setLightbox({ src: img.src, alt: img.alt })}
                >
                  <SafeImage
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] brightness-90 saturate-[0.85] group-hover:scale-[1.04] group-hover:brightness-[0.65] group-hover:saturate-[0.7]"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full border border-gold/40 bg-gold/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#c4a574" strokeWidth="1.5">
                      <path d="M7.5 1.5H10.5V4.5M4.5 10.5H1.5V7.5M10.5 1.5L7 5M1.5 10.5L5 7" />
                    </svg>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-[9px] uppercase tracking-[0.16em] text-gold mb-0.5 font-body">
                      {img.cat}
                    </p>
                    <p className="font-display text-sm text-cream font-normal leading-tight">
                      {img.label}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Empty fill cells if fewer than 4 secondary images */}
              {rest.length < 4 &&
                Array.from({ length: 4 - rest.length }).map((_, i) => (
                  <div key={`empty-${i}`} className="rounded-sm bg-elevated/40 border border-border/40" />
                ))}
            </motion.div>
          </AnimatePresence>

          {/* Bottom bar */}
          <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {amenities.map((a) => (
                <span
                  key={a.label}
                  className="text-[10px] uppercase tracking-[0.1em] text-gold border border-border bg-gold/5 px-3 py-1.5 rounded-[2px] font-body"
                >
                  {a.icon} {a.label}
                </span>
              ))}
            </div>
            <button
              type="button"
              className="shrink-0 min-h-[44px] text-xs uppercase tracking-[0.12em] text-gold border border-gold/60 px-5 py-2.5 rounded-[2px] font-body hover:bg-gold hover:text-ink transition-all duration-300"
            >
              View all photos
            </button>
          </div>

        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center p-4 sm:p-6"
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              aria-label="Close gallery"
              className="touch-target absolute top-[max(1rem,env(safe-area-inset-top))] right-4 rounded-md text-gold-muted hover:text-gold text-2xl font-body transition-colors sm:right-6"
              onClick={() => setLightbox(null)}
            >
              ✕
            </button>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-4xl aspect-[4/3] sm:aspect-[16/10]"
              onClick={(e) => e.stopPropagation()}
            >
              <SafeImage
                src={lightbox.src}
                alt={lightbox.alt}
                fill
                className="object-contain rounded-sm"
                sizes="90vw"
              />
            </motion.div>
            <p className="absolute bottom-6 text-[11px] uppercase tracking-[0.14em] text-slate font-body">
              {lightbox.alt}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}