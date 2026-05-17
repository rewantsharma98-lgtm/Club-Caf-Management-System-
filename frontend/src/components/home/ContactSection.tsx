'use client';

import { MapPin, Phone, Mail } from 'lucide-react';
import { BRAND } from '@/lib/brand';

export default function ContactSection() {
  return (
    <section id="contact" className="section-padding border-t border-border">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <p className="section-label">Visit us</p>
            <h2 className="heading-lg mt-3">Location & contact</h2>
            <p className="mt-4 max-w-md text-body">
              Located in the heart of downtown. Valet available Friday and Saturday evenings.
            </p>
          </div>
          <ul className="space-y-6">
            <li className="flex gap-4">
              <MapPin className="shrink-0 text-gold" size={20} />
              <div>
                <p className="text-sm font-medium text-cream">Address</p>
                <p className="mt-1 text-body">{BRAND.address}</p>
              </div>
            </li>
            <li className="flex gap-4">
              <Phone className="shrink-0 text-gold" size={20} />
              <div>
                <p className="text-sm font-medium text-cream">Phone</p>
                <p className="mt-1 text-body">{BRAND.phone}</p>
              </div>
            </li>
            <li className="flex gap-4">
              <Mail className="shrink-0 text-gold" size={20} />
              <div>
                <p className="text-sm font-medium text-cream">Email</p>
                <p className="mt-1 text-body">{BRAND.email}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
