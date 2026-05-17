'use client';

import { HomeUIProvider } from '@/context/HomeUIContext';
import ReservationModal from '@/components/modals/ReservationModal';
import AuthModal from '@/components/modals/AuthModal';

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return (
    <HomeUIProvider>
      {children}
      <ReservationModal />
      <AuthModal />
    </HomeUIProvider>
  );
}
