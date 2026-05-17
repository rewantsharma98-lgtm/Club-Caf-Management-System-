'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { FALLBACK_IMAGE } from '@/lib/media';

type SafeImageProps = Omit<ImageProps, 'src' | 'alt'> & {
  src?: string | null;
  alt: string;
};

export default function SafeImage({ src, alt, className, onError, ...props }: SafeImageProps) {
  const initial = src?.trim() || FALLBACK_IMAGE;
  const [current, setCurrent] = useState(initial);

  return (
    <Image
      {...props}
      src={current}
      alt={alt}
      className={className}
      unoptimized
      onError={(e) => {
        if (current !== FALLBACK_IMAGE) setCurrent(FALLBACK_IMAGE);
        onError?.(e);
      }}
    />
  );
}
