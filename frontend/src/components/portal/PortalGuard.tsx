'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getPortalToken } from '@/lib/portalAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function PortalGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getPortalToken()) {
      router.replace('/portal/login');
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-midnight">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  return <>{children}</>;
}
