'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/auth';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace('/admin/login');
      return;
    }
    api
      .verify(token)
      .then(() => setReady(true))
      .catch(() => {
        router.replace('/admin/login');
      });
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
