'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BRAND } from '@/lib/brand';
import { HERO_VIDEO_URL, HERO_VIDEO_FALLBACK, HERO_POSTER_URL } from '@/lib/media';
import { useAutoplayVideo } from '@/hooks/useAutoplayVideo';

export default function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [exiting, setExiting] = useState(false);
  const [visible, setVisible] = useState(false);
  const [videoSrc, setVideoSrc] = useState(HERO_VIDEO_URL);

  useAutoplayVideo(videoRef, visible);

  const finish = () => {
    if (exiting) return;
    setExiting(true);
    sessionStorage.setItem(BRAND.introKey, '1');
    setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 700);
  };

  useEffect(() => {
    const seen = sessionStorage.getItem(BRAND.introKey);
    if (seen) {
      onComplete();
      return;
    }
    setVisible(true);
    const timer = setTimeout(finish, 2800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] overflow-hidden bg-ink"
        initial={{ opacity: 1 }}
        animate={{
          opacity: exiting ? 0 : 1,
          scale: exiting ? 1.03 : 1,
        }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <video
          ref={videoRef}
          key={videoSrc}
          className="absolute inset-0 h-full w-full object-cover"
          src={videoSrc}
          poster={HERO_POSTER_URL}
          muted
          playsInline
          autoPlay
          preload="auto"
          loop
          onError={() => {
            if (videoSrc !== HERO_VIDEO_FALLBACK) setVideoSrc(HERO_VIDEO_FALLBACK);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/20 to-ink/80" />

        <div className="absolute inset-0 flex flex-col items-center justify-end px-6 pb-16 md:pb-24">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-display text-center text-2xl tracking-tight text-cream sm:text-4xl md:text-5xl"
          >
            {BRAND.fullName}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="mt-3 text-xs uppercase tracking-[0.25em] text-cream-muted sm:text-sm"
          >
            {BRAND.tagline}
          </motion.p>
        </div>

        <button
          type="button"
          onClick={finish}
          className="absolute right-5 top-[max(1rem,env(safe-area-inset-top))] min-h-[44px] px-2 text-xs uppercase tracking-widest text-cream/60 transition-colors hover:text-cream"
        >
          Skip
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
