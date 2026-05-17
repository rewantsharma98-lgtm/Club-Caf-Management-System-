'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { api, MenuData } from '@/lib/api';
import { BRAND } from '@/lib/brand';


export default function MenuPage() {
  const [menu, setMenu] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('');

  useEffect(() => {
    api
      .getMenu()
      .then((r) => {
        setMenu(r.data);
        if (r.data.categories[0]) setActive(r.data.categories[0].key);
      })
      .finally(() => setLoading(false));
  }, []);
  

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-ink pt-24 pb-16 sm:pt-28 sm:pb-20">
        <div className="mx-auto max-w-5xl px-5 md:px-10">
          <p className="section-label">{BRAND.fullName}</p>
          <h1 className="heading-xl mt-2">Full menu</h1>
          <p className="mt-4 text-body max-w-lg">
            Cocktails, plates, and nightlife offerings — updated seasonally.
          </p>
          <p className="mt-4 text-sm text-slate">
            Table QR access:{' '}
            <Link href="/menu/qr/TBL-01" className="text-gold hover:underline">
              sample table menu
            </Link>
          </p>

          {loading ? (
            <div className="flex justify-center py-24">
              <LoadingSpinner />
            </div>
          ) : menu?.categories.length ? (
            <>
              <div className="scroll-tabs mt-10 gap-2 pb-2">
                {menu.categories.map((cat) => (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setActive(cat.key)}
                    className={`min-h-[44px] shrink-0 rounded-md px-4 py-2.5 text-xs uppercase tracking-wider transition-colors ${
                      active === cat.key
                        ? 'bg-elevated text-cream border border-border'
                        : 'text-cream-muted hover:text-cream'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="mt-10 space-y-8">
                {menu.categories
                  .filter((c) => c.key === active)
                  .map((cat) => (
                    <div key={cat.key} className="space-y-6">
                      {cat.items.map((item) => (
                        <article
                          key={item._id}
                          className="flex flex-col gap-4 border-b border-border pb-6 last:border-0 sm:flex-row sm:gap-5"
                        >
                          {item.image && (
                            <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-md sm:h-24 sm:w-24">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="96px"
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                              <h2 className="font-display text-lg text-cream sm:text-xl">{item.name}</h2>
                              <span className="text-gold font-medium shrink-0">${item.price}</span>
                            </div>
                            {item.description && (
                              <p className="text-sm text-body mt-2">{item.description}</p>
                            )}
                          </div>
                        </article>
                      ))}
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <p className="text-center text-body py-20">Menu unavailable. Please check back shortly.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

