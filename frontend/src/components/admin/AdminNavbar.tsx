'use client';

import { Menu } from 'lucide-react';
import BranchSwitcher from './BranchSwitcher';

export default function AdminNavbar({
  onMenuClick,
  title,
}: {
  onMenuClick: () => void;
  title: string;
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-ink/95 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-sm sm:py-4 md:px-8">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="touch-target shrink-0 rounded-md text-cream-muted hover:bg-elevated lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="truncate font-display text-base font-medium text-cream sm:text-lg">{title}</h1>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <BranchSwitcher />
        <span className="hidden text-xs text-slate sm:inline">Operations</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-elevated border border-border text-xs font-medium text-cream">
          A
        </div>
      </div>
    </header>
  );
}
