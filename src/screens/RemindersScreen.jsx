import React from 'react';
import DesktopSidebar from '../components/navigation/DesktopSidebar';
import SimpleHeader from '../components/shared/SimpleHeader';

export default function RemindersScreen() {
  return (
    <div className="flex h-full w-full bg-background-dark">
      <DesktopSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <SimpleHeader title="Reminders" />
        <main className="flex-grow flex justify-center py-10 px-4 sm:px-6 lg:px-12 overflow-y-auto pb-20">
          <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Left Column - Time Dial and Input */}
            <div className="lg:col-span-7 flex flex-col gap-12">
              {/* Greeting and Current Time */}
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl md:text-5xl font-extralight tracking-tight text-white">Good Evening, Alex</h1>
                <div className="flex items-center gap-2 text-text-secondary font-mono text-sm uppercase tracking-wide">
                  <span className="size-1.5 bg-primary rounded-full"></span>
                  <span>18:42:05 PM</span>
                </div>
              </div>

              {/* Circular Time Dial */}
              <TimeDial />

              {/* Reminder Input Section */}
              <ReminderInput />
            </div>

            {/* Right Column - Next Up Reminders */}
            <div className="lg:col-span-5 flex flex-col gap-10">
              <NextUpReminders />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Circular Time Dial Component
function TimeDial() {
  return (
    <div className="relative w-full aspect-[4/3] md:aspect-[2/1] lg:aspect-[16/9] flex flex-col items-center justify-center py-8 glass-panel rounded-3xl overflow-hidden group border-border-dark">
      {/* Background glow effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-radial from-primary to-transparent blur-3xl"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Dial with conic gradient */}
        <div className="relative size-60 md:size-64 rounded-full chrono-dial-bg p-[1px] shadow-2xl shadow-black/50">
          <div className="w-full h-full bg-black rounded-full flex flex-col items-center justify-center relative">
            <span className="text-text-secondary text-[10px] uppercase tracking-[0.2em] mb-4 font-medium opacity-60">Wake Up</span>
            <div className="flex items-baseline text-white font-mono leading-none">
              <span className="text-6xl md:text-7xl font-light tracking-tighter">07</span>
              <span className="text-6xl md:text-7xl font-light tracking-tighter text-border-dark mx-1">:</span>
              <span className="text-6xl md:text-7xl font-light tracking-tighter">00</span>
            </div>
            {/* AM/PM Toggle */}
            <div className="flex gap-2 mt-6">
              <button className="w-10 h-6 flex items-center justify-center rounded-full text-[10px] font-bold bg-accent-dark text-text-secondary hover:text-white transition-colors border border-border-dark">
                AM
              </button>
              <button className="w-10 h-6 flex items-center justify-center rounded-full text-[10px] font-bold bg-primary text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                PM
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reminder Input Component
function ReminderInput() {
  return (
    <div className="flex flex-col gap-8">
      {/* Task name input with mic button */}
      <div className="flex w-full items-center border-b border-border-dark focus-within:border-primary transition-colors pb-2">
        <input 
          className="w-full bg-transparent border-none text-white placeholder-text-secondary/50 px-0 py-2 text-2xl font-light focus:ring-0 focus:outline-none" 
          placeholder="Task name..." 
          type="text" 
          defaultValue="Morning Meditation"
        />
        <button className="px-2 text-text-secondary hover:text-primary transition-colors">
          <span className="material-symbols-outlined font-light">mic</span>
        </button>
      </div>
      
      {/* Set Reminder button */}
      <button className="mt-6 w-full py-4 rounded-2xl bg-white text-black hover:bg-primary hover:text-white font-semibold text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3">
        <span className="material-symbols-outlined">add_alarm</span>
        Set Reminder
      </button>
    </div>
  );
}

// Next Up Reminders List Component
function NextUpReminders() {
  const reminders = [
    {
      id: 1,
      time: '19:30',
      label: 'Evening Run',
      icon: 'alarm',
      isActive: true,
    },
    {
      id: 2,
      time: '21:00',
      label: 'Vitamins',
      icon: 'medication',
      isActive: false,
    },
  ];

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-dark pb-4">
        <h3 className="text-lg font-light text-white">Next Up</h3>
      </div>
      
      {/* Reminders Timeline */}
      <div className="flex flex-col gap-4 relative">
        {/* Vertical connector line */}
        <div className="absolute left-[23px] top-4 bottom-4 w-px bg-border-dark z-0"></div>
        
        {reminders.map((reminder) => (
          <ReminderCard key={reminder.id} reminder={reminder} />
        ))}
      </div>
    </>
  );
}

// Reminder Card Component
function ReminderCard({ reminder }) {
  const isActive = reminder.isActive;
  
  return (
    <div className="relative z-10 group">
      <div className={`${isActive ? 'bg-surface-dark' : 'bg-black'} border border-border-dark p-4 rounded-xl flex items-center justify-between transition-all hover:border-primary/30 hover:bg-accent-dark`}>
        <div className="flex items-center gap-4">
          {/* Icon circle */}
          <div className={`size-12 rounded-full bg-black border ${isActive ? 'border-primary text-primary shadow-[0_0_10px_rgba(124,58,237,0.2)]' : 'border-border-dark text-text-secondary'} flex items-center justify-center`}>
            <span className="material-symbols-outlined text-xl">{reminder.icon}</span>
          </div>
          
          {/* Time and label */}
          <div className={isActive ? '' : 'opacity-70 group-hover:opacity-100 transition-opacity'}>
            <p className={`text-xl font-medium ${isActive ? 'text-white' : 'text-text-secondary'} font-mono leading-none`}>
              {reminder.time}
            </p>
            <p className="text-xs text-text-secondary mt-1">{reminder.label}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
