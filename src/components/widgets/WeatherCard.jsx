import React from 'react';

export default function WeatherCard() {
  return (
    <div className="md:col-span-1 rounded-3xl bg-card-dark border border-white/5 p-8 flex flex-col justify-between relative overflow-hidden group hover:border-white/10 transition-colors">
      {/* Hover glow effect */}
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-yellow-500/5 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <span className="text-text-muted text-xs font-bold tracking-widest uppercase block mb-1">Weather</span>
          <span className="text-white text-sm">San Francisco</span>
        </div>
        <span className="material-symbols-outlined text-white/20">sunny</span>
      </div>
      
      {/* Temperature Display */}
      <div className="flex flex-col gap-2 mt-8">
        <p className="text-white text-6xl font-thin tracking-tighter">72°</p>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span>Clear Sky</span>
          <span className="size-1 rounded-full bg-white/20"></span>
          <span>UV 4</span>
        </div>
      </div>
    </div>
  );
}
