import React, { useState } from 'react';
import { useReminders, useTasks, useUser } from '../context';
import DesktopSidebar from '../components/navigation/DesktopSidebar';
import SimpleHeader from '../components/shared/SimpleHeader';
import FocusTimer from '../components/widgets/FocusTimer';
import WeatherCard from '../components/widgets/WeatherCard';
import UpNextCard from '../components/widgets/UpNextCard';
import ProductivityChart from '../components/widgets/ProductivityChart';
import HabitsWidget from '../components/widgets/HabitsWidget';

// Get appropriate greeting based on time of day
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function DashboardScreen() {
  const { firstName } = useUser();
  const { focusBlocksRemaining, addTask } = useTasks();
  const { addReminder } = useReminders();
  const greeting = getGreeting();
  const [command, setCommand] = useState('');
  const [status, setStatus] = useState('');

  const runCommand = () => {
    const text = command.trim();
    if (!text) return;

    const taskMatch = text.match(/^(task|todo)\s*[:\-]?\s+(.+)$/i);
    if (taskMatch) {
      const title = taskMatch[2].trim();
      const now = new Date();
      addTask({
        title,
        label: 'PERSONAL',
        dueAt: now.toISOString(),
        dueDate: 'Today',
        priority: 'medium',
      });
      setStatus(`Added task: ${title}`);
      setCommand('');
      return;
    }

    const reminderMatch = text.match(/^(remind|reminder)\s*[:\-]?\s+(.+)$/i);
    if (reminderMatch) {
      const rest = reminderMatch[2].trim();
      const timeMatch = rest.match(/\s+at\s+(\d{1,2}):(\d{2})\s*$/i);
      const title = (timeMatch ? rest.slice(0, timeMatch.index) : rest).trim();

      const due = new Date();
      due.setSeconds(0, 0);

      if (timeMatch) {
        const hh = Number(timeMatch[1]);
        const mm = Number(timeMatch[2]);
        due.setHours(Math.min(23, Math.max(0, hh)), Math.min(59, Math.max(0, mm)), 0, 0);
        if (due.getTime() <= Date.now()) due.setDate(due.getDate() + 1);
      } else {
        // Default: 30 minutes from now, rounded to 5 minutes.
        const ms = Date.now() + 30 * 60 * 1000;
        const d = new Date(ms);
        const rounded = Math.ceil(d.getMinutes() / 5) * 5;
        d.setMinutes(rounded, 0, 0);
        due.setTime(d.getTime());
      }

      addReminder({ title: title || 'Reminder', dueAt: due.toISOString() });
      setStatus(`Added reminder: ${title || 'Reminder'}`);
      setCommand('');
      return;
    }

    setStatus("Try: 'task Buy milk' or 'remind Stretch at 19:30'");
  };

  return (
    <div className="flex h-full w-full bg-theme-primary transition-colors duration-200">
      <DesktopSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <SimpleHeader title="Dashboard" />
        
        <main className="flex-1 flex flex-col items-center w-full px-4 lg:px-10 py-8 lg:py-12 overflow-y-auto pb-20">
          <div className="w-full max-w-[1400px] flex flex-col gap-8">
            {/* Header Section */}
            <div className="flex flex-wrap justify-between items-end gap-4">
              <div>
                <p className="text-theme-muted text-sm font-medium tracking-widest uppercase mb-1">Overview</p>
                <h1 className="text-theme-primary text-4xl lg:text-5xl font-light tracking-tight">{greeting}, {firstName}.</h1>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-theme-muted font-mono bg-[var(--hover-overlay)] px-3 py-1.5 rounded-full border border-theme-subtle">
                  {focusBlocksRemaining} Focus Block{focusBlocksRemaining !== 1 ? 's' : ''} remaining
                </span>
              </div>
            </div>
            
            {/* Widgets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
              {/* Focus Timer - spans 2 columns on xl */}
              <FocusTimer />
              
              {/* Weather Card */}
              <WeatherCard />
              
              {/* Up Next Card */}
              <UpNextCard />
              
              {/* Productivity Chart - spans 3 columns on xl */}
              <ProductivityChart />
              
              {/* Habits Widget */}
              <HabitsWidget />
            </div>
          </div>
          
          {/* Mobile Command Input */}
          <div className="w-full max-w-md mt-10 md:hidden pb-10">
            <div className="pointer-events-auto flex items-center gap-3 bg-theme-surface border border-theme-primary rounded-full p-1.5 pl-4 shadow-2xl hover:scale-[1.02] hover:border-primary/50 transition-all duration-300 group">
              <span className="material-symbols-outlined text-theme-muted text-[18px] group-hover:text-primary transition-colors">terminal</span>
              <input 
                className="bg-transparent border-none text-theme-primary placeholder-theme-muted focus:ring-0 w-full font-mono text-xs h-full py-2" 
                placeholder="Ask Habitual... (task Buy milk | remind Stretch at 19:30)"
                type="text"
                value={command}
                onChange={(e) => {
                  setCommand(e.target.value);
                  if (status) setStatus('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    runCommand();
                  }
                }}
              />
            </div>
            {status && (
              <div className="mt-2 text-[10px] font-mono text-theme-muted px-4">
                {status}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
