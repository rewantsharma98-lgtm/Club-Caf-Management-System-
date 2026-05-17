'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { api, QrMenuData } from '@/lib/api';
import { BRAND } from '@/lib/brand';

export default function QrMenuPage() {
  const params = useParams();
  const code = String(params.code || '');
  const [data, setData] = useState<QrMenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!code) return;
    api
      .getMenuByQr(code)
      .then((r) => setData(r.data))
      .catch((e) => setError(e instanceof Error ? e.message : 'Menu not found'))
      .finally(() => setLoading(false));
  }, [code]);

  return (
    <main className="mx-auto min-h-screen max-w-lg bg-ink px-5 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(2rem,env(safe-area-inset-top))]">
      <header className="text-center border-b border-border pb-6 mb-8">
        <Link href="/" className="font-display text-2xl text-cream">
          {BRAND.name}
        </Link>
        {data?.table && (
          <p className="mt-2 text-sm text-gold">
            Table {data.table.label} · {data.table.zone}
          </p>
        )}
      </header>

      {loading && (
        <div className="flex justify-center py-20">
          <LoadingSpinner />
        </div>
      )}

      {error && <p className="text-center text-body">{error}</p>}

      {data && (
        <div className="space-y-6">
          {data.items.map((item) => (
            <article key={item._id} className="flex gap-4 border-b border-border pb-4">
              {item.image && (
                <div className="relative h-16 w-16 shrink-0 rounded overflow-hidden">
                  <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex justify-between gap-2">
                  <h2 className="text-cream font-medium">{item.name}</h2>
                  <span className="text-gold text-sm">${item.price}</span>
                </div>
                {item.description && (
                  <p className="text-xs text-body mt-1">{item.description}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <p className="mt-12 text-center text-xs text-slate">
        <Link href="/menu" className="text-gold hover:underline">
          View full menu
        </Link>
      </p>
    </main>
  );
}
