import Link from 'next/link';
import { MapPin, Clock, Mail, Phone, Instagram } from 'lucide-react';
import { BRAND } from '@/lib/brand';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl section-padding pb-12">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-display text-xl text-cream sm:text-2xl">
              {BRAND.name}<span className="text-gold"> Lounge</span>
            </h3>
            <p className="mt-4 text-sm text-body max-w-xs">
              A premium hospitality destination for reservations, events, and curated evenings.
            </p>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target mt-6 inline-flex h-11 w-11 items-center justify-center rounded-md border border-border text-cream-muted transition-colors hover:border-gold/30 hover:text-cream"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
          </div>

          <div>
            <h4 className="text-sm font-medium text-cream">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm text-body">
              <li className="flex items-start gap-2 break-words">
                <MapPin size={16} className="text-gold shrink-0 mt-0.5" />
                {BRAND.address}
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-gold shrink-0" />
                {BRAND.phone}
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-gold shrink-0" />
                {BRAND.email}
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-cream">Hours</h4>
            <ul className="mt-4 space-y-2 text-sm text-body">
              <li className="flex items-center gap-2">
                <Clock size={16} className="text-gold" />
                Mon – Thu: 5PM – 1AM
              </li>
              <li>Fri – Sat: 5PM – 3AM</li>
              <li>Sunday: 4PM – 12AM</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium text-cream">Explore</h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/?reserve=1" className="text-body hover:text-cream transition-colors">
                  Reserve a Table
                </Link>
              </li>
              <li>
                <a href="#events" className="text-body hover:text-cream transition-colors">
                  Upcoming Events
                </a>
              </li>
              <li>
                <Link href="/?auth=login" className="text-body hover:text-cream transition-colors">
                  Member Portal
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-body hover:text-cream transition-colors">
                  Staff Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-8 text-center text-xs text-slate">
          © {new Date().getFullYear()} {BRAND.fullName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
