import React from 'react';

export default function SimpleHeader({ title }) {
  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between border-b border-theme-subtle bg-[var(--bg-primary)]/80 backdrop-blur-xl px-6 py-4 lg:px-10 md:hidden transition-colors duration-200"
      data-testid="mobile-header"
    >
      <div className="flex items-center gap-3">
        <div className="size-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
          <span className="material-symbols-outlined text-[20px]">pentagon</span>
        </div>
        <h2 className="text-lg font-medium tracking-tight text-theme-primary">
          {title || 'Habitual'}
        </h2>
      </div>
    </header>
  );
}
