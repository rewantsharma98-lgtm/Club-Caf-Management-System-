'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { BRAND } from '@/lib/brand';
import { useHomeUIOptional } from '@/context/HomeUIContext';

const hash = (id: string) => `/#${id}`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const homeUI = useHomeUIOptional();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    {
      href: hash('reserve'),
      label: 'Reserve',
      action: homeUI ? () => homeUI.openReserve() : undefined,
    },
    { href: hash('gallery'), label: 'Gallery' },
    { href: hash('menu'), label: 'Menu' },
    { href: hash('events'), label: 'Events' },
    { href: hash('about'), label: 'About' },
    { href: hash('contact'), label: 'Contact' },
    {
      href: '/?auth=login',
      label: 'Members',
      action: homeUI ? () => homeUI.openAuth('login') : undefined,
    },
  ];

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
        scrolled ? 'border-b border-border bg-ink/90 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] md:px-10 md:py-4">
        <Link href="/" className="min-w-0 truncate font-display text-lg tracking-tight text-cream sm:text-xl">
          {BRAND.name}
          <span className="text-gold font-normal text-base ml-1.5 hidden sm:inline">Lounge</span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) =>
            link.action ? (
              <button
                key={link.label}
                type="button"
                onClick={link.action}
                className="nav-link bg-transparent border-0 cursor-pointer"
              >
                {link.label}
              </button>
            ) : (
              <a key={link.label} href={link.href} className="nav-link">
                {link.label}
              </a>
            )
          )}
          <Button
            type="button"
            onClick={() => (homeUI ? homeUI.openReserve() : (window.location.href = '/?reserve=1'))}
            className="!px-5 !py-2.5 text-sm"
          >
            Reserve
          </Button>
        </div>

        <button
          type="button"
          className="touch-target -mr-1 rounded-md text-cream lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-ink px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:hidden max-h-[min(70dvh,520px)] overflow-y-auto">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) =>
              link.action ? (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => {
                    link.action?.();
                    setOpen(false);
                  }}
                  className="min-h-[48px] py-3 nav-link border-b border-border/50 text-left w-full bg-transparent"
                >
                  {link.label}
                </button>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[48px] items-center py-3 nav-link border-b border-border/50"
                >
                  {link.label}
                </a>
              )
            )}
            <Button
              type="button"
              onClick={() => {
                if (homeUI) homeUI.openReserve();
                else window.location.href = '/?reserve=1';
                setOpen(false);
              }}
              className="mt-4 w-full"
            >
              Reserve Table
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
