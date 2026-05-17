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

    const video = document.createElement('link');
    video.rel = 'preload';
    video.as = 'fetch';
    video.href = HERO_VIDEO_URL;
    video.crossOrigin = 'anonymous';
    document.head.appendChild(video);
    links.push(video);

    return () => {
      links.forEach((l) => l.remove());
    };
  }, []);

  return null;
}
