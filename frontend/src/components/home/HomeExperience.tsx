'use client';

import { useState, useEffect, useRef } from 'react';
import { HomeUIProvider, useHomeUI } from '@/context/HomeUIContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CinematicIntro from '@/components/home/CinematicIntro';
import Hero from '@/components/home/Hero';
import ResourcePreload from '@/components/ResourcePreload';
import ReservationSection from '@/components/home/ReservationSection';
import GallerySection from '@/components/home/GallerySection';
import MenuSection from '@/components/home/MenuSection';
import EventsSection from '@/components/home/EventsSection';
import AboutSection from '@/components/home/AboutSection';
import ContactSection from '@/components/home/ContactSection';
import ReservationModal from '@/components/modals/ReservationModal';
import AuthModal from '@/components/modals/AuthModal';
import { BRAND } from '@/lib/brand';

function HomeContent() {
  const [introDone, setIntroDone] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !!sessionStorage.getItem(BRAND.introKey);
  });
  const { openReserve, openAuth } = useHomeUI();
  const reserveOnLoad = useRef(false);
  const authOnLoad = useRef<'login' | 'signup' | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('reserve') === '1') reserveOnLoad.current = true;
    const auth = params.get('auth');
    if (auth === 'login' || auth === 'signup') authOnLoad.current = auth;
    if (reserveOnLoad.current || authOnLoad.current) {
      window.history.replaceState({}, '', '/');
    }
  }, []);

  useEffect(() => {
    if (!introDone) return;
    if (reserveOnLoad.current) {
      reserveOnLoad.current = false;
      openReserve();
    }
    if (authOnLoad.current) {
      const tab = authOnLoad.current;
      authOnLoad.current = null;
      openAuth(tab);
    }
  }, [introDone, openReserve, openAuth]);

  const handleIntroComplete = () => {
    sessionStorage.setItem(BRAND.introKey, '1');
    setIntroDone(true);
  };

  return (
    <>
      <ResourcePreload />
      <CinematicIntro onComplete={handleIntroComplete} />
      {/* Keep page visible under intro so hero video can buffer and autoplay */}
      <Navbar />
      <main>
        <Hero readyToPlay />
        <ReservationSection />
        <GallerySection />
        <MenuSection />
        <EventsSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
      <ReservationModal />
      <AuthModal />
    </>
  );
}

export default function HomeExperience() {
  return (
    <HomeUIProvider>
      <HomeContent />
    </HomeUIProvider>
  );
}
