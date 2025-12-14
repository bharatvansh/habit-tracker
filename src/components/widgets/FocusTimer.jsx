import React from 'react';
import { useTimer } from '../../context';

export default function FocusTimer() {
  const {
    sessionName,
    formattedTime,
    isRunning,
    isPaused,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
  } = useTimer();

  const handlePauseResume = () => {
    if (isRunning) {
      pauseTimer();
    } else if (isPaused) {
      resumeTimer();
    } else {
      startTimer();
    }
  };

  const handleStop = () => {
    stopTimer();
  };

  // Determine button label
  const buttonLabel = isRunning ? 'Pause Timer' : isPaused ? 'Resume Timer' : 'Start Timer';

  return (
    <div className="xl:col-span-2 rounded-3xl bg-theme-card border border-theme-subtle p-8 relative overflow-hidden group transition-colors duration-200">
      {/* Background glow effect */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 blur-[100px] rounded-full"></div>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-10 relative z-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className={`size-1.5 rounded-full ${isRunning ? 'bg-primary animate-pulse' : isPaused ? 'bg-yellow-500' : 'bg-theme-secondary'}`}></span>
            <span className={`text-xs font-bold tracking-widest uppercase ${isRunning ? 'text-primary' : isPaused ? 'text-yellow-500' : 'text-theme-muted'}`}>
              {isRunning ? 'Current Focus' : isPaused ? 'Paused' : 'Ready'}
            </span>
          </div>
          <h3 className="text-theme-primary text-xl font-light tracking-wide">{sessionName}</h3>
        </div>
        <button className="size-10 rounded-full border border-theme-subtle flex items-center justify-center text-theme-muted hover:text-theme-primary hover:border-theme-primary transition-colors">
          <span className="material-symbols-outlined text-[20px]">more_horiz</span>
        </button>
      </div>
      
      {/* Timer Display */}
      <div className="flex items-baseline gap-1 relative z-10">
        <span className="text-7xl lg:text-9xl font-extralight text-theme-primary font-display tabular-nums tracking-tighter">
          {formattedTime.minutes}
        </span>
        <span className="text-2xl lg:text-3xl font-light text-primary/80 font-display tabular-nums mb-2 lg:mb-4">
          :{formattedTime.seconds}
        </span>
      </div>
      
      {/* Action Buttons */}
      <div className="mt-8 flex gap-4 relative z-10">
        <button 
          onClick={handlePauseResume}
          className={`px-8 py-3 rounded-full text-sm font-medium transition-colors ${
            isRunning 
              ? 'bg-theme-primary text-[var(--bg-primary)] hover:opacity-80' 
              : 'bg-primary text-white hover:bg-primary/80'
          }`}
        >
          {buttonLabel}
        </button>
        {(isRunning || isPaused) && (
          <button 
            onClick={handleStop}
            className="px-6 py-3 rounded-full border border-theme-primary text-theme-primary text-sm font-medium hover:bg-[var(--hover-overlay)] transition-colors"
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
}
