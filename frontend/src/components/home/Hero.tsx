'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { useHomeUI } from '@/context/HomeUIContext';
import { useAutoplayVideo } from '@/hooks/useAutoplayVideo';
import { HERO_VIDEO_URL, HERO_VIDEO_FALLBACK, HERO_POSTER_URL } from '@/lib/media';

type HeroProps = {
  /** When false, parent intro overlay is showing — we still mount video so it buffers */
  readyToPlay?: boolean;
};

export default function Hero({ readyToPlay = true }: HeroProps) {
  const { openReserve } = useHomeUI();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState(HERO_VIDEO_URL);
  const [videoReady, setVideoReady] = useState(false);

  useAutoplayVideo(videoRef, readyToPlay);

  return (
    <section className="relative min-h-[100dvh] flex items-end overflow-hidden pb-20 md:pb-28">
      <div className="absolute inset-0 bg-ink">
        <div
          className="absolute inset-0 z-[1] bg-cover bg-center transition-opacity duration-700"
          style={{
            backgroundImage: `url(${HERO_POSTER_URL})`,
            opacity: videoReady ? 0 : 1,
          }}
        />
        <video
          ref={videoRef}
          key={videoSrc}
          src={videoSrc}
          poster={HERO_POSTER_URL}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onPlaying={() => setVideoReady(true)}
          onLoadedData={() => setVideoReady(true)}
          onError={() => {
            if (videoSrc !== HERO_VIDEO_FALLBACK) {
              setVideoSrc(HERO_VIDEO_FALLBACK);
              setVideoReady(false);
            }
          }}
          className="absolute inset-0 z-[2] h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-t from-ink via-ink/55 to-ink/25" />
        <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-r from-ink/60 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(6.5rem,calc(env(safe-area-inset-top)+5rem))] md:px-10 lg:px-16">
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
          Downtown&apos;s club for DJs, bottle service, and nights that don&apos;t slow down.
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
      </div>
    </section>
  );
}
