'use client';

import { useEffect } from 'react';
import { HERO_POSTER_URL, HERO_VIDEO_URL } from '@/lib/media';

export default function ResourcePreload() {
  useEffect(() => {
    const links: HTMLLinkElement[] = [];

    const poster = document.createElement('link');
    poster.rel = 'preload';
    poster.as = 'image';
    poster.href = HERO_POSTER_URL;
    document.head.appendChild(poster);
    links.push(poster);

    // Some browsers do not support preloading video via <link rel="preload" as="video">.
    // The hero video itself already requests with preload="auto" on the <video> element.
    return () => {
      links.forEach((l) => l.remove());
    };
  }, []);

  return null;
}
