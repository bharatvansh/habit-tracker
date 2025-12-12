import React from 'react';

export default function FocusTimer() {
  return (
    <div className="xl:col-span-2 rounded-3xl bg-card-dark border border-white/5 p-8 relative overflow-hidden group">
      {/* Background glow effect */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 blur-[100px] rounded-full"></div>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-10 relative z-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
            <span className="text-primary text-xs font-bold tracking-widest uppercase">Current Focus</span>
          </div>
          <h3 className="text-white text-xl font-light tracking-wide">Deep Work Session</h3>
        </div>
        <button className="size-10 rounded-full border border-white/5 flex items-center justify-center text-text-muted hover:text-white hover:border-white/10 transition-colors">
          <span className="material-symbols-outlined text-[20px]">more_horiz</span>
        </button>
      </div>
      
      {/* Timer Display */}
      <div className="flex items-baseline gap-1 relative z-10">
        <span className="text-7xl lg:text-9xl font-extralight text-white font-display tabular-nums tracking-tighter">00:42</span>
        <span className="text-2xl lg:text-3xl font-light text-primary/80 font-display tabular-nums mb-2 lg:mb-4">:18</span>
      </div>
      
      {/* Action Buttons */}
      <div className="mt-8 flex gap-4 relative z-10">
        <button className="px-8 py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-gray-200 transition-colors">
          Pause Timer
        </button>
        <button className="px-6 py-3 rounded-full border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition-colors">
          Stop
        </button>
      </div>
    </div>
  );
}
