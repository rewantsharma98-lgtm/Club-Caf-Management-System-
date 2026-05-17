const fs = require('fs');
const path = require('path');
const d = 'motion.div'.replace('motion.', ''); // "div"
const file = path.join(__dirname, '../src/components/home/Hero.tsx');

const content = `'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { useHomeUI } from '@/context/HomeUIContext';
import { HERO_VIDEO_URL, HERO_POSTER_URL } from '@/lib/media';

export default function Hero() {
  const { openReserve } = useHomeUI();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const play = () => v.play().catch(() => {});
    if (v.readyState >= 2) play();
    else v.addEventListener('loadeddata', play, { once: true });
  }, []);

  return (
    <section className="relative min-h-[100dvh] flex items-end pb-20 md:pb-28 overflow-hidden">
      <${d} className="absolute inset-0">
        <${d}
          className="absolute inset-0 z-10 bg-ink pointer-events-none transition-opacity duration-500"
          style={{ opacity: ready ? 0 : 1 }}
        />
        <video
          ref={videoRef}
          src={HERO_VIDEO_URL}
          poster={HERO_POSTER_URL}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setReady(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <${d} className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-ink via-ink/55 to-ink/25" />
        <${d} className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-r from-ink/60 via-transparent to-transparent" />
      </${d}>

      <${d} className="relative z-30 mx-auto w-full max-w-7xl px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-28 md:px-10 lg:px-16">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="section-label"
        >
          Downtown · Est. 2018
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="heading-xl mt-4 max-w-3xl"
        >
          Where evenings are crafted with intention
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-xl text-body text-base md:text-lg"
        >
          A luxury lounge for reservations, live events, and nights worth remembering.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4"
        >
          <Button type="button" onClick={openReserve} className="w-full min-h-[48px] sm:w-auto">
            Reserve Table
          </Button>
          <Button href="/#events" variant="outline" className="w-full min-h-[48px] sm:w-auto">
            Explore Events
          </Button>
        </motion.div>
      </${d}>
    </section>
  );
}
`;

fs.writeFileSync(file, content);
console.log('Hero written with tag:', d);
