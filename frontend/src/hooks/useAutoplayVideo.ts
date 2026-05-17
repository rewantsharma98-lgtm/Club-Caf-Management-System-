import { useEffect, useCallback } from 'react';

export function useAutoplayVideo(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  enabled: boolean
) {
  const play = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    const run = () => {
      const p = v.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          setTimeout(() => v.play().catch(() => {}), 400);
        });
      }
    };
    if (v.readyState >= 2) run();
    else {
      v.addEventListener('loadeddata', run, { once: true });
      v.addEventListener('canplay', run, { once: true });
    }
  }, [videoRef]);

  useEffect(() => {
    if (!enabled) return;
    play();
    const onVisible = () => {
      if (document.visibilityState === 'visible') play();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [enabled, play]);
}
