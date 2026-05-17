'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type AuthTab = 'login' | 'signup' | 'forgot';

type HomeUIContextValue = {
  reserveOpen: boolean;
  authOpen: boolean;
  authTab: AuthTab;
  openReserve: () => void;
  closeReserve: () => void;
  openAuth: (tab?: AuthTab) => void;
  closeAuth: () => void;
  setAuthTab: (tab: AuthTab) => void;
};

const HomeUIContext = createContext<HomeUIContextValue | null>(null);

export function HomeUIProvider({ children }: { children: ReactNode }) {
  const [reserveOpen, setReserveOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<AuthTab>('login');

  const openReserve = useCallback(() => setReserveOpen(true), []);
  const closeReserve = useCallback(() => setReserveOpen(false), []);
  const openAuth = useCallback((tab: AuthTab = 'login') => {
    setAuthTab(tab);
    setAuthOpen(true);
  }, []);
  const closeAuth = useCallback(() => setAuthOpen(false), []);

  return (
    <HomeUIContext.Provider
      value={{
        reserveOpen,
        authOpen,
        authTab,
        openReserve,
        closeReserve,
        openAuth,
        closeAuth,
        setAuthTab,
      }}
    >
      {children}
    </HomeUIContext.Provider>
  );
}

export function useHomeUI() {
  const ctx = useContext(HomeUIContext);
  if (!ctx) {
    throw new Error('useHomeUI must be used within HomeUIProvider');
  }
  return ctx;
}

export function useHomeUIOptional() {
  return useContext(HomeUIContext);
}
