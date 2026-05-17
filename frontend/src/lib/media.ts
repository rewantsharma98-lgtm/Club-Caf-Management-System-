/** Reliable media URLs — avoids broken Unsplash IDs and slow local 404s */

/** Primary hero / intro — bundled so playback works without hotlink blocks */
export const HERO_VIDEO_URL = '/videos/hero.mp4';

/** CDN fallback if local file is missing (Mixkit — nightclub crowd + lasers) */
export const HERO_VIDEO_FALLBACK =
  'https://assets.mixkit.co/videos/4344/4344-720.mp4';

export const HERO_POSTER_URL =
  'https://assets.mixkit.co/videos/4344/4344-thumb-720-0.jpg';

export const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80';

export const GALLERY_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=85',
    alt: 'The main bar',
    category: 'Bar' as const,
    label: 'Handcrafted since 1987',
    cat: 'The bar',
    main: true,
  },
  {
    src: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=85',
    alt: 'Signature cocktails',
    category: 'Cocktails' as const,
    label: 'Signature pours',
    cat: 'Cocktails',
    main: false,
  },
  {
    src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=85',
    alt: 'Terrace dining',
    category: 'Terrace' as const,
    label: 'Alfresco dining',
    cat: 'Terrace',
    main: false,
  },
  {
    src: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=85',
    alt: 'Evening ambience',
    category: 'Bar' as const,
    label: 'Evening ambience',
    cat: 'Evenings',
    main: false,
  },
  {
    src: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=85',
    alt: 'Live music nights',
    category: 'Events' as const,
    label: 'Live music nights',
    cat: 'Events',
    main: false,
  },
] as const;

export const FALLBACK_EVENTS = [
  {
    _id: 'fallback-1',
    title: 'Saturday Sessions — Live DJ',
    image:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=85',
    description: 'Resident DJs and curated sound through midnight.',
    date: new Date(Date.now() + 7 * 86400000).toISOString(),
  },
  {
    _id: 'fallback-2',
    title: 'Jazz & Velvet Lounge',
    image:
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1200&q=85',
    description: 'Intimate live sets in our lower lounge.',
    date: new Date(Date.now() + 14 * 86400000).toISOString(),
  },
];

export const FALLBACK_MENU_FEATURED = [
  {
    _id: 'm1',
    name: 'Midnight Old Fashioned',
    category: 'signature',
    price: 18,
    image:
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'm2',
    name: 'Velvet Espresso Martini',
    category: 'signature',
    price: 17,
    image:
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'm3',
    name: 'Truffle Arancini',
    category: 'food',
    price: 14,
    image:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
  },
  {
    _id: 'm4',
    name: 'Smoked Maple Sour',
    category: 'cocktails',
    price: 17,
    image:
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80',
  },
];
