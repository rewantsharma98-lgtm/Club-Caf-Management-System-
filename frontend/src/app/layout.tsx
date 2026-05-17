import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import ResourcePreload from '@/components/ResourcePreload';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600'],
});

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'Lumina Lounge | Premium Hospitality',
  description:
    'Luxury reservations, curated menus, and nightlife experiences at Lumina Lounge.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover' as const,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen min-h-[100dvh] w-full max-w-[100vw] overflow-x-hidden bg-ink font-body text-cream antialiased">
        <ResourcePreload />
        {children}
      </body>
    </html>
  );
}
