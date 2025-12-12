import React, { useState } from 'react';
import DesktopSidebar from '../components/navigation/DesktopSidebar';
import SimpleHeader from '../components/shared/SimpleHeader';

export default function CalendarScreen() {
  const [currentDate] = useState(new Date(2023, 8, 5)); // September 5, 2023 (as shown in design)
  const [viewMode, setViewMode] = useState('Month');
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Get calendar data for the current month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = currentDate.getDate();
  
  // First day of month (0 = Sunday, convert to Monday-based)
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  
  // Days in current and previous month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  
  // Sample events data
  const events = {
    1: [{ title: 'Design Review', color: 'zinc' }],
    3: [{ title: 'NYC Trip', icon: 'flight', color: 'zinc' }],
    5: [{ title: 'Client Meeting', color: 'primary' }],
    9: [{ title: 'Birthday Dinner', color: 'primary-light' }],
    23: [{ title: 'Launch Day 🚀', color: 'primary' }],
  };

  // Generate calendar days
  const calendarDays = [];
  
  // Previous month days
  for (let i = startOffset - 1; i >= 0; i--) {
    calendarDays.push({ day: daysInPrevMonth - i, isPrevMonth: true });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({ day: i, isCurrentMonth: true, isToday: i === today, events: events[i] });
  }

  return (
    <div className="flex h-full w-full bg-background-dark">
      <DesktopSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <SimpleHeader title="Calendar" />
        <main className="flex-1 flex flex-col lg:flex-row w-full p-4 lg:p-6 gap-6 overflow-hidden lg:h-[calc(100vh-64px)] overflow-y-auto pb-20">
          {/* Main Calendar Section */}
          <section className="flex flex-col flex-1 h-full min-h-0">
            {/* Header with Month/Year and Navigation */}
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-6">
                <h1 className="text-3xl font-bold text-white tracking-tighter">
                  {monthNames[month]} <span className="text-zinc-600 font-light">{year}</span>
                </h1>
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-white/5 rounded-full transition-colors text-zinc-500 hover:text-white">
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </button>
                  <button className="p-1 hover:bg-white/5 rounded-full transition-colors text-zinc-500 hover:text-white">
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                  <button className="ml-2 px-3 py-1 text-xs font-semibold text-zinc-400 hover:text-white border border-white/5 rounded-md hover:bg-white/5 transition-all">
                    Today
                  </button>
                </div>
              </div>
              {/* View Toggle (Month/Week/Day) */}
              <div className="flex items-center p-0.5 bg-surface-dark border border-white/5 rounded-lg">
                {['Month', 'Week', 'Day'].map((view) => (
                  <button
                    key={view}
                    onClick={() => setViewMode(view)}
                    className={`px-4 py-1.5 text-xs font-semibold transition-colors ${
                      viewMode === view
                        ? 'text-white bg-zinc-800 rounded-[5px] shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 grid grid-cols-7 grid-rows-[auto_1fr] gap-2 lg:gap-3 lg:overflow-y-auto pr-2 pb-2 min-h-[500px]">
              {/* Day Headers */}
              {dayNames.map((day) => (
                <div key={day} className="text-center text-zinc-600 text-[10px] font-bold uppercase tracking-widest py-2">
                  {day}
                </div>
              ))}

              {/* Calendar Days */}
              {calendarDays.map((dayData, index) => (
                <CalendarDayCell key={index} {...dayData} />
              ))}
            </div>
          </section>

          {/* Right Sidebar - Up Next & Schedule */}
          <aside className="w-full lg:w-[380px] shrink-0 flex flex-col gap-6 overflow-y-auto pr-1 pb-20 lg:pb-0">
            {/* Up Next Card */}
            <UpNextPanel />
            
            {/* Schedule Timeline */}
            <ScheduleTimeline />
          </aside>

          {/* Floating Add Button */}
          <button className="fixed bottom-20 md:bottom-8 right-8 size-12 bg-primary text-white rounded-full shadow-[0_0_20px_rgba(124,58,237,0.4)] flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 z-50 group">
            <span className="material-symbols-outlined text-[24px] transition-transform group-hover:rotate-90">add</span>
          </button>
        </main>
      </div>
    </div>
  );
}


// Calendar Day Cell Component
function CalendarDayCell({ day, isPrevMonth, isCurrentMonth, isToday, events }) {
  if (isPrevMonth) {
    return (
      <div className="minimal-card bg-transparent border border-white/5 min-h-[80px] lg:min-h-[120px] rounded-lg p-2 flex flex-col gap-1 relative opacity-30">
        <span className="text-xs font-medium text-zinc-500">{day}</span>
      </div>
    );
  }

  if (isToday) {
    return (
      <div className="minimal-card min-h-[80px] lg:min-h-[120px] rounded-lg p-2 flex flex-col gap-1 relative group cursor-pointer border border-primary/30 bg-primary/5">
        <div className="flex justify-between items-center">
          <span className="size-6 flex items-center justify-center rounded-full bg-primary text-white text-xs font-bold shadow-lg shadow-primary/20">
            {day}
          </span>
        </div>
        {events?.map((event, idx) => (
          <EventBadge key={idx} event={event} isToday />
        ))}
      </div>
    );
  }

  return (
    <div className="minimal-card bg-transparent border border-white/5 min-h-[80px] lg:min-h-[120px] rounded-lg p-2 flex flex-col gap-1 relative group cursor-pointer hover:bg-white/5 transition-colors">
      <span className="text-xs font-semibold text-zinc-400 group-hover:text-white transition-colors">{day}</span>
      {events?.map((event, idx) => (
        <EventBadge key={idx} event={event} />
      ))}
    </div>
  );
}

// Event Badge Component
function EventBadge({ event, isToday }) {
  const colorClasses = {
    zinc: 'bg-zinc-800/50 border-white/5 text-zinc-400',
    primary: isToday ? 'bg-primary/20 border-primary/30 text-white' : 'bg-primary/20 border-primary/40 text-white',
    'primary-light': 'bg-primary/10 border-primary/20 text-primary',
  };

  return (
    <div className={`${colorClasses[event.color] || colorClasses.zinc} border rounded px-1.5 py-0.5 text-[10px] truncate flex items-center gap-1 mt-1`}>
      {event.icon && <span className="material-symbols-outlined text-[10px]">{event.icon}</span>}
      {!event.icon && event.color === 'zinc' && <span className="size-1.5 rounded-full bg-zinc-500"></span>}
      {event.title}
    </div>
  );
}


// Up Next Panel Component
function UpNextPanel() {
  return (
    <div className="bg-card-dark border border-white/5 rounded-xl p-5 relative overflow-hidden group">
      <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary/10 rounded-full blur-[40px] pointer-events-none"></div>
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">Up Next</h3>
      <div className="flex items-start gap-4 mb-3">
        <div className="w-1 h-14 bg-primary rounded-full shadow-[0_0_10px_rgba(124,58,237,0.4)]"></div>
        <div className="flex-1 z-10">
          <h2 className="text-xl font-bold text-white mb-1 leading-none">Product Strategy</h2>
          <p className="text-zinc-500 text-xs mb-3">10:00 AM - 11:30 AM • Room 402</p>
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        <button className="flex-1 bg-white/5 border border-white/5 text-white hover:bg-primary hover:border-primary py-2 rounded-md text-xs font-semibold transition-all">
          Join Meeting
        </button>
      </div>
    </div>
  );
}


// Schedule Timeline Component
function ScheduleTimeline() {
  const scheduleItems = [
    { time: '09:00', title: 'Daily Standup', location: 'Google Meet', isPast: true },
    { time: '09:42', isCurrentTime: true },
    { time: '10:00', title: 'Product Strategy', location: 'Room 402 • 1h 30m', isActive: true },
  ];

  return (
    <div className="bg-card-dark border border-white/5 rounded-xl p-5 flex-1 min-h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Schedule</h3>
        <button className="text-zinc-500 hover:text-white transition-colors">
          <span className="material-symbols-outlined text-[18px]">add</span>
        </button>
      </div>
      <div className="relative pl-2 space-y-6">
        {/* Vertical timeline line */}
        <div className="absolute left-[54px] top-2 bottom-0 w-[1px] bg-zinc-800"></div>
        
        {scheduleItems.map((item, index) => {
          if (item.isCurrentTime) {
            return (
              <div key={index} className="flex items-center gap-4 relative z-10">
                <span className="w-10 text-right text-xs font-mono font-bold text-primary pt-0">{item.time}</span>
                <div className="flex-1 h-[1px] bg-primary/50 laser-line relative flex items-center">
                  <div className="absolute -left-1 size-2 rounded-full bg-primary shadow-[0_0_8px_#7c3aed]"></div>
                </div>
              </div>
            );
          }

          if (item.isActive) {
            return (
              <div key={index} className="flex gap-4 group">
                <span className="w-10 text-right text-xs font-mono text-white pt-1">{item.time}</span>
                <div className="flex-1 bg-primary/5 rounded border border-primary/20 p-2 ml-1 shadow-[0_0_15px_-5px_rgba(124,58,237,0.1)]">
                  <div className="flex justify-between items-start">
                    <p className="text-xs font-bold text-white">{item.title}</p>
                    <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
                  </div>
                  <p className="text-[10px] text-primary mt-0.5">{item.location}</p>
                </div>
              </div>
            );
          }

          return (
            <div key={index} className={`flex gap-4 group ${item.isPast ? 'opacity-60 hover:opacity-100' : ''} transition-opacity`}>
              <span className="w-10 text-right text-xs font-mono text-zinc-600 pt-1">{item.time}</span>
              <div className="flex-1 pl-4 relative">
                <div className="absolute left-[-5px] top-2 size-1.5 rounded-full bg-zinc-800 ring-4 ring-background-dark"></div>
                <p className="text-sm font-medium text-zinc-300">{item.title}</p>
                <p className="text-[10px] text-zinc-600">{item.location}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
