'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ReserveRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/?reserve=1');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink">
      <LoadingSpinner />
    </div>
  );
}
