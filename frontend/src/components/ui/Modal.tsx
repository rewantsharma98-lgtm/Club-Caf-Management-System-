'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center sm:p-4">
          <motion.button
            type="button"
            aria-label="Close overlay"
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={`relative z-10 flex w-full flex-col border border-border bg-elevated shadow-soft-lg max-h-[100dvh] sm:max-h-[90vh] rounded-t-2xl sm:rounded-lg ${
              wide ? 'sm:max-w-3xl' : 'sm:max-w-lg'
            }`}
          >
            <div className="flex shrink-0 items-start justify-between border-b border-border px-4 py-4 sm:px-6 pt-[max(1rem,env(safe-area-inset-top))]">
              <div className="pr-3 min-w-0">
                <h2 id="modal-title" className="font-display text-lg text-cream sm:text-2xl leading-tight">
                  {title}
                </h2>
                {subtitle && <p className="mt-1 text-xs sm:text-sm text-body line-clamp-2">{subtitle}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-md p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-cream-muted hover:bg-surface hover:text-cream"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
