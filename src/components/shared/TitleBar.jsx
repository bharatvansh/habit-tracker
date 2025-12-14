import React from 'react';

export default function TitleBar() {
  const handleMinimize = () => window.electronAPI?.send('app:minimize');
  const handleMaximize = () => window.electronAPI?.send('app:maximize');
  const handleClose = () => window.electronAPI?.send('app:close');

  return (
    <div className="fixed top-0 left-0 right-0 h-8 bg-theme-primary flex items-center justify-end z-50 select-none transition-colors duration-200" style={{ WebkitAppRegion: 'drag' }}>
      <div className="flex items-center" style={{ WebkitAppRegion: 'no-drag' }}>
        <button
          onClick={handleMinimize}
          className="w-12 h-8 flex items-center justify-center hover:bg-[var(--hover-overlay)] transition-colors"
          aria-label="Minimize"
        >
          <svg width="10" height="1" viewBox="0 0 10 1" fill="currentColor" className="text-theme-muted">
            <rect width="10" height="1" />
          </svg>
        </button>
        <button
          onClick={handleMaximize}
          className="w-12 h-8 flex items-center justify-center hover:bg-[var(--hover-overlay)] transition-colors"
          aria-label="Maximize"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" className="text-theme-muted">
            <rect x="0.5" y="0.5" width="9" height="9" strokeWidth="1" />
          </svg>
        </button>
        <button
          onClick={handleClose}
          className="w-12 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
          aria-label="Close"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" className="text-theme-muted">
            <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
