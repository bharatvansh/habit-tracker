import React from 'react';

export default function HabitsWidget() {
  // Calculate stroke-dashoffset for progress rings
  // circumference = 2 * PI * r = 2 * 3.14159 * 18 ≈ 113
  const circumference = 113;
  
  // Hydration: 1.2L / 2L = 60% progress, offset = 113 * (1 - 0.6) = 45.2 ≈ 40
  const hydrationOffset = 40;
  
  // Reading: 15m / 30m = 50% progress, offset = 113 * (1 - 0.5) = 56.5 ≈ 60
  const readingOffset = 60;

  return (
    <div className="xl:col-span-1 rounded-3xl bg-card-dark border border-white/5 p-8 flex flex-col justify-between">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white text-lg font-light">Habits</h3>
        <button className="text-text-muted hover:text-white transition-colors">
          <span className="material-symbols-outlined text-[20px]">add</span>
        </button>
      </div>
      
      {/* Habits List */}
      <div className="flex flex-col gap-6">
        {/* Hydration Habit */}
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="relative size-10 flex items-center justify-center">
            <svg className="transform -rotate-90 size-10">
              {/* Background circle */}
              <circle 
                className="text-white/5" 
                cx="20" 
                cy="20" 
                fill="transparent" 
                r="18" 
                stroke="currentColor" 
                strokeWidth="2"
              />
              {/* Progress circle */}
              <circle 
                className="text-primary transition-all duration-1000 ease-out" 
                cx="20" 
                cy="20" 
                fill="transparent" 
                r="18" 
                stroke="currentColor" 
                strokeDasharray={circumference} 
                strokeDashoffset={hydrationOffset} 
                strokeLinecap="round" 
                strokeWidth="2"
              />
            </svg>
            <span className="material-symbols-outlined absolute text-xs text-white">water_drop</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-medium text-sm group-hover:text-primary transition-colors">Hydration</span>
            <span className="text-text-muted text-[10px] font-mono">1.2L / 2L</span>
          </div>
        </div>
        
        {/* Reading Habit */}
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="relative size-10 flex items-center justify-center">
            <svg className="transform -rotate-90 size-10">
              {/* Background circle */}
              <circle 
                className="text-white/5" 
                cx="20" 
                cy="20" 
                fill="transparent" 
                r="18" 
                stroke="currentColor" 
                strokeWidth="2"
              />
              {/* Progress circle */}
              <circle 
                className="text-white transition-all duration-1000 ease-out" 
                cx="20" 
                cy="20" 
                fill="transparent" 
                r="18" 
                stroke="currentColor" 
                strokeDasharray={circumference} 
                strokeDashoffset={readingOffset} 
                strokeLinecap="round" 
                strokeWidth="2"
              />
            </svg>
            <span className="material-symbols-outlined absolute text-xs text-white">menu_book</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-medium text-sm group-hover:text-white transition-colors">Reading</span>
            <span className="text-text-muted text-[10px] font-mono">15m / 30m</span>
          </div>
        </div>
      </div>
    </div>
  );
}
