'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

/** Legacy route — member sign-in opens on the homepage modal */
export default function PortalLoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/?auth=login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink">
      <LoadingSpinner />
    </div>
  );
}
