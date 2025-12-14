import React, { useMemo } from 'react';
import { useHabits, useReminders, useTasks, useUser } from '../context';
import DesktopSidebar from '../components/navigation/DesktopSidebar';
import SimpleHeader from '../components/shared/SimpleHeader';

export default function SettingsScreen() {
  return (
    <div className="flex h-full w-full bg-background-dark">
      <DesktopSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <SimpleHeader title="Settings" />
        <main className="flex-1 flex flex-col relative overflow-y-auto overflow-x-hidden bg-background-dark pb-20">
          {/* Header Section */}
          <header className="px-8 pt-12 pb-8 max-w-6xl mx-auto w-full">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-medium tracking-tight text-white">Settings</h1>
              <p className="text-text-secondary text-base font-light">Manage your preferences and account security.</p>
            </div>
          </header>

          {/* Content Section */}
          <div className="flex-1 px-8 pb-12 max-w-6xl mx-auto w-full flex flex-col gap-10">
            {/* Stat Cards Section */}
            <StatCardsSection />

            {/* Main Settings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Left Column - Account */}
              <div className="lg:col-span-2 flex flex-col gap-10">
                <AccountSection />
              </div>

              {/* Right Column - Appearance */}
              <div className="flex flex-col gap-10">
                <AppearanceSection />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Stat Cards Section Component
function StatCardsSection() {
  const { habits, history } = useHabits();
  const { tasks } = useTasks();
  const { reminders } = useReminders();

  const storage = useMemo(() => {
    const bytes = estimateHabitualStorageBytes();
    const max = 5 * 1024 * 1024; // typical localStorage budget (best-effort estimate)
    const pct = Math.min(100, Math.max(0, Math.round((bytes / max) * 100)));
    return { bytes, pct };
  }, [habits, history, reminders, tasks]);

  const streak = useMemo(() => {
    const todayKey = new Date().toISOString().split('T')[0];
    const map = new Map();

    history.forEach((r) => {
      if (!r?.date || !Array.isArray(r.habits) || r.habits.length === 0) return;
      const complete = r.habits.every((h) => Boolean(h.completed));
      map.set(r.date, complete);
    });

    // Today's completion (live)
    const todayComplete = habits.length > 0 && habits.every((h) => h.current >= h.target);
    map.set(todayKey, todayComplete);

    // Current streak: walk backwards from today
    let current = 0;
    for (let i = 0; i < 400; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const complete = map.get(key);
      if (complete === true) current += 1;
      else break;
    }

    // Best streak: sort known dates and compute max consecutive run
    const keys = Array.from(map.entries())
      .filter(([, v]) => v === true)
      .map(([k]) => k)
      .sort();

    let best = 0;
    let run = 0;
    let prev = null;
    keys.forEach((k) => {
      const d = new Date(k);
      if (!prev) {
        run = 1;
        best = Math.max(best, run);
        prev = d;
        return;
      }
      const diffDays = Math.round((d.getTime() - prev.getTime()) / (24 * 60 * 60 * 1000));
      if (diffDays === 1) run += 1;
      else run = 1;
      best = Math.max(best, run);
      prev = d;
    });

    return { current, best: Math.max(best, current) };
  }, [habits, history]);

  const completed = useMemo(() => {
    const tasksDone = tasks.filter((t) => t.status === 'done').length;
    const remindersDone = reminders.filter((r) => r.isCompleted).length;
    return { tasksDone, remindersDone };
  }, [reminders, tasks]);

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Storage Card */}
      <div className="flex flex-col justify-between p-6 bg-surface-dark rounded-xl border border-border-dark/50">
        <div className="flex justify-between items-start mb-6">
          <p className="text-text-secondary text-sm font-medium">Storage</p>
          <span className="material-symbols-outlined text-zinc-600 text-[20px]">cloud</span>
        </div>
        <div className="flex items-end gap-3">
          <h3 className="text-3xl font-light text-white">
            {storage.pct}
            <span className="text-zinc-600 text-xl">%</span>
          </h3>
        </div>
        <div className="w-full bg-zinc-900 h-0.5 mt-4">
          <div className="bg-primary h-full" style={{ width: `${storage.pct}%` }}></div>
        </div>
        <p className="text-[10px] text-text-secondary mt-3 font-mono">
          ~{Math.round(storage.bytes / 1024)} KB used
        </p>
      </div>

      {/* Streak Card */}
      <div className="flex flex-col justify-between p-6 bg-surface-dark rounded-xl border border-border-dark/50">
        <div className="flex justify-between items-start mb-6">
          <p className="text-text-secondary text-sm font-medium">Streak</p>
          <span className="material-symbols-outlined text-zinc-600 text-[20px]">local_fire_department</span>
        </div>
        <div className="flex items-end gap-3">
          <h3 className="text-3xl font-light text-white">
            {streak.current}
            <span className="text-zinc-600 text-xl">Days</span>
          </h3>
        </div>
        <p className="text-xs text-text-secondary mt-4 font-mono">BEST: {streak.best}</p>
      </div>

      {/* Completed Card */}
      <div className="flex flex-col justify-between p-6 bg-surface-dark rounded-xl border border-border-dark/50">
        <div className="flex justify-between items-start mb-6">
          <p className="text-text-secondary text-sm font-medium">Completed</p>
          <span className="material-symbols-outlined text-zinc-600 text-[20px]">task_alt</span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-light text-white">{completed.tasksDone}</h3>
            <span className="text-zinc-600 text-xs font-mono">tasks done</span>
          </div>
          <div className="flex items-end gap-3">
            <h3 className="text-2xl font-light text-white">{completed.remindersDone}</h3>
            <span className="text-zinc-600 text-xs font-mono">reminders done</span>
          </div>
        </div>
        <p className="text-[10px] text-text-secondary mt-4 font-mono">
          Keep the streak alive.
        </p>
      </div>
    </section>
  );
}

function estimateHabitualStorageBytes() {
  try {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith('habitual_')) continue;
      const value = localStorage.getItem(key) || '';
      // Rough estimate: JS strings are ~2 bytes/char.
      total += (key.length + value.length) * 2;
    }
    return total;
  } catch {
    return 0;
  }
}

// Account Section Component
function AccountSection() {
  const { user, updateUser } = useUser();

  const handleNameChange = (e) => {
    updateUser({ displayName: e.target.value });
  };

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-lg font-medium text-white">Account</h2>
      </div>
      <div className="p-6 bg-surface-dark rounded-xl border border-border-dark/50 flex flex-col gap-8">
        <div className="flex items-center gap-6">
          {/* Profile Image */}
          <div className="relative group cursor-pointer shrink-0">
            <div 
              className="bg-center bg-no-repeat bg-cover rounded-full size-20 grayscale hover:grayscale-0 transition-all duration-500" 
              style={{
                backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuArxeDDWhBCaLqh4gGlyeu_IoPFcQTu-BotbnM3rhwH8KXBBNE50P1gvUuO44e_aDA_-SapFo5kr_gyyQWPerNugHUaj31TI_SUhEhxGiuq-YoesRst21sgHMQjREiUfP3HbqWutxXcjT3z6fx05hR3OE1kDLSy3nUH5cBwfwF6s6AjygkXek-5vu1grKBWe1ghhQbsiZA_DIeKF5RWQ3VGzy9qfLr9Idn_9d0lG14XZ196MpsGgqc9UN6orJdTxWynchmVc-4u0d8')"
              }}
            />
          </div>

          {/* Display Name Input */}
          <div className="flex flex-col gap-6 w-full max-w-md">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Display Name</label>
              <input 
                className="bg-transparent border-0 border-b border-zinc-800 focus:border-primary focus:ring-0 px-0 py-2 text-white font-normal placeholder-zinc-700 transition-colors w-full" 
                type="text" 
                value={user.displayName}
                onChange={handleNameChange}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Appearance Section Component
function AppearanceSection() {
  const { user, updatePreferences } = useUser();

  const handleThemeChange = (theme) => {
    updatePreferences({ theme });
  };

  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-lg font-medium text-white">Appearance</h2>
      <div className="bg-surface-dark rounded-xl border border-border-dark/50 p-6 flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
          {/* Light Theme Option */}
          <label className="cursor-pointer group">
            <input 
              className="peer sr-only" 
              name="theme" 
              type="radio" 
              value="light"
              checked={user.preferences?.theme === 'light'}
              onChange={() => handleThemeChange('light')}
            />
            <div className="rounded-lg border border-zinc-800 peer-checked:border-zinc-500 bg-black p-4 flex flex-col items-center gap-3 transition-all opacity-50 peer-checked:opacity-100">
              <span className="material-symbols-outlined text-zinc-400">light_mode</span>
              <span className="text-xs font-medium text-zinc-400">Light</span>
            </div>
          </label>

          {/* Dark Theme Option (Default Selected) */}
          <label className="cursor-pointer group">
            <input 
              className="peer sr-only" 
              name="theme" 
              type="radio" 
              value="dark"
              checked={user.preferences?.theme === 'dark' || !user.preferences?.theme}
              onChange={() => handleThemeChange('dark')}
            />
            <div className="rounded-lg border border-zinc-800 peer-checked:border-primary peer-checked:text-primary bg-black p-4 flex flex-col items-center gap-3 transition-all">
              <span className="material-symbols-outlined text-white peer-checked:text-primary">dark_mode</span>
              <span className="text-xs font-medium text-white peer-checked:text-primary">Dark</span>
            </div>
          </label>
        </div>
      </div>
    </section>
  );
}
