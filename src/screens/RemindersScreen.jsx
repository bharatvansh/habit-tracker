import React, { useEffect, useMemo, useState } from 'react';
import DesktopSidebar from '../components/navigation/DesktopSidebar';
import SimpleHeader from '../components/shared/SimpleHeader';
import { useReminders, useUser } from '../context';

export default function RemindersScreen() {
  const { firstName } = useUser();
  const {
    upcomingReminders,
    overdueReminders,
    addReminder,
    toggleReminderComplete,
    deleteReminder,
    snoozeReminder,
    requestNotificationPermission,
  } = useReminders();

  const [now, setNow] = useState(() => new Date());
  const [title, setTitle] = useState('');

  const [hour, setHour] = useState(() => {
    const d = new Date();
    const h = d.getHours();
    return h % 12 || 12;
  });
  const [minute, setMinute] = useState(() => new Date().getMinutes());
  const [ampm, setAmpm] = useState(() => (new Date().getHours() >= 12 ? 'PM' : 'AM'));

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const greeting = useMemo(() => {
    const h = now.getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, [now]);

  const currentTimeLabel = useMemo(() => {
    const hh = `${now.getHours()}`.padStart(2, '0');
    const mm = `${now.getMinutes()}`.padStart(2, '0');
    const ss = `${now.getSeconds()}`.padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }, [now]);

  const nextUp = upcomingReminders[0] || null;

  const handleSetReminder = async () => {
    const trimmed = title.trim();
    if (!trimmed) return;

    const h12 = Math.min(12, Math.max(1, Number(hour) || 12));
    const m = Math.min(59, Math.max(0, Number(minute) || 0));

    const h24 = (() => {
      if (ampm === 'AM') return h12 === 12 ? 0 : h12;
      return h12 === 12 ? 12 : h12 + 12;
    })();

    const due = new Date(now);
    due.setSeconds(0, 0);
    due.setHours(h24, m, 0, 0);
    if (due.getTime() <= now.getTime()) due.setDate(due.getDate() + 1);

    addReminder({ title: trimmed, dueAt: due.toISOString() });
    setTitle('');

    try {
      if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
        await requestNotificationPermission();
      }
    } catch {
      // ignore
    }
  };

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
                <h1 className="text-3xl md:text-5xl font-extralight tracking-tight text-white">
                  {greeting}, {firstName}
                </h1>
                <div className="flex items-center gap-2 text-text-secondary font-mono text-sm uppercase tracking-wide">
                  <span className="size-1.5 bg-primary rounded-full"></span>
                  <span>{currentTimeLabel}</span>
                </div>
              </div>

              {/* Circular Time Dial */}
              <TimeDial
                hour={hour}
                minute={minute}
                ampm={ampm}
                onChangeHour={setHour}
                onChangeMinute={setMinute}
                onChangeAmPm={setAmpm}
              />

              {/* Reminder Input Section */}
              <ReminderInput
                title={title}
                onChangeTitle={setTitle}
                onSubmit={handleSetReminder}
                onRequestNotifications={requestNotificationPermission}
              />
            </div>

            {/* Right Column - Next Up Reminders */}
            <div className="lg:col-span-5 flex flex-col gap-10">
              <NextUpReminders
                nextUp={nextUp}
                upcoming={upcomingReminders}
                overdue={overdueReminders}
                onToggleComplete={toggleReminderComplete}
                onDelete={deleteReminder}
                onSnooze={snoozeReminder}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Circular Time Dial Component
function TimeDial({ hour, minute, ampm, onChangeHour, onChangeMinute, onChangeAmPm }) {
  const safeHour = Math.min(12, Math.max(1, Number(hour) || 12));
  const safeMinute = Math.min(59, Math.max(0, Number(minute) || 0));

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
            <span className="text-text-secondary text-[10px] uppercase tracking-[0.2em] mb-4 font-medium opacity-60">Set Time</span>
            <div className="flex items-baseline text-white font-mono leading-none">
              <input
                aria-label="Hour"
                inputMode="numeric"
                value={`${safeHour}`.padStart(2, '0')}
                onChange={(e) => onChangeHour(e.target.value.replace(/[^0-9]/g, ''))}
                onBlur={() => onChangeHour(String(Math.min(12, Math.max(1, Number(safeHour) || 12))))}
                className="w-[2.2ch] md:w-[2.4ch] bg-transparent text-6xl md:text-7xl font-light tracking-tighter text-white text-center focus:outline-none"
              />
              <span className="text-6xl md:text-7xl font-light tracking-tighter text-border-dark mx-1">:</span>
              <input
                aria-label="Minute"
                inputMode="numeric"
                value={`${safeMinute}`.padStart(2, '0')}
                onChange={(e) => onChangeMinute(e.target.value.replace(/[^0-9]/g, ''))}
                onBlur={() => onChangeMinute(String(Math.min(59, Math.max(0, Number(safeMinute) || 0))))}
                className="w-[2.2ch] md:w-[2.4ch] bg-transparent text-6xl md:text-7xl font-light tracking-tighter text-white text-center focus:outline-none"
              />
            </div>
            {/* AM/PM Toggle */}
            <div className="flex gap-2 mt-6">
              <button
                type="button"
                onClick={() => onChangeAmPm('AM')}
                className={`w-10 h-6 flex items-center justify-center rounded-full text-[10px] font-bold transition-colors border border-border-dark ${
                  ampm === 'AM'
                    ? 'bg-primary text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]'
                    : 'bg-accent-dark text-text-secondary hover:text-white'
                }`}
              >
                AM
              </button>
              <button
                type="button"
                onClick={() => onChangeAmPm('PM')}
                className={`w-10 h-6 flex items-center justify-center rounded-full text-[10px] font-bold transition-colors border border-border-dark ${
                  ampm === 'PM'
                    ? 'bg-primary text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]'
                    : 'bg-accent-dark text-text-secondary hover:text-white'
                }`}
              >
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
function ReminderInput({ title, onChangeTitle, onSubmit, onRequestNotifications }) {
  return (
    <div className="flex flex-col gap-8">
      {/* Task name input with mic button */}
      <div className="flex w-full items-center border-b border-border-dark focus-within:border-primary transition-colors pb-2">
        <input
          className="w-full bg-transparent border-none text-white placeholder-text-secondary/50 px-0 py-2 text-2xl font-light focus:ring-0 focus:outline-none"
          placeholder="Task name..."
          type="text"
          value={title}
          onChange={(e) => onChangeTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onSubmit();
            }
          }}
        />
        <button
          type="button"
          className="px-2 text-text-secondary hover:text-primary transition-colors"
          aria-label="Enable notifications"
          onClick={onRequestNotifications}
        >
          <span className="material-symbols-outlined font-light">notifications</span>
        </button>
      </div>

      {/* Set Reminder button */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={!title.trim()}
        className="mt-6 w-full py-4 rounded-2xl bg-white text-black hover:bg-primary hover:text-white font-semibold text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span className="material-symbols-outlined">add_alarm</span>
        Set Reminder
      </button>
    </div>
  );
}

// Next Up Reminders List Component
function NextUpReminders({ nextUp, upcoming, overdue, onToggleComplete, onDelete, onSnooze }) {
  const items = upcoming.slice(0, 6);
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-dark pb-4">
        <h3 className="text-lg font-light text-white">Next Up</h3>
        {nextUp ? (
          <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">
            {formatTime24(nextUp.dueAt)}
          </span>
        ) : (
          <span className="text-[10px] font-mono text-text-secondary">No reminders</span>
        )}
      </div>

      {/* Reminders Timeline */}
      <div className="flex flex-col gap-4 relative">
        {/* Vertical connector line */}
        <div className="absolute left-[23px] top-4 bottom-4 w-px bg-border-dark z-0"></div>

        {overdue.length > 0 && (
          <div className="text-[10px] uppercase tracking-widest text-red-400 font-bold mt-1">Overdue</div>
        )}
        {overdue.slice(0, 2).map((reminder) => (
          <ReminderCard
            key={reminder.id}
            reminder={reminder}
            isActive={reminder.id === nextUp?.id}
            isOverdue
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
            onSnooze={onSnooze}
          />
        ))}

        {items.length === 0 ? (
          <div className="text-text-secondary text-sm py-6 text-center">No reminders yet. Add one on the left.</div>
        ) : (
          items.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              isActive={reminder.id === nextUp?.id}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onSnooze={onSnooze}
            />
          ))
        )}
      </div>
    </>
  );
}

// Reminder Card Component
function ReminderCard({ reminder, isActive, isOverdue, onToggleComplete, onDelete, onSnooze }) {
  return (
    <div className="relative z-10 group">
      <div
        className={`${isActive ? 'bg-surface-dark' : 'bg-black'} border border-border-dark p-4 rounded-xl flex items-center justify-between transition-all hover:border-primary/30 hover:bg-accent-dark`}
      >
        <div className="flex items-center gap-4">
          {/* Icon circle */}
          <button
            type="button"
            onClick={() => onToggleComplete(reminder.id)}
            className={`size-12 rounded-full bg-black border ${
              isActive
                ? 'border-primary text-primary shadow-[0_0_10px_rgba(124,58,237,0.2)]'
                : isOverdue
                ? 'border-red-500/30 text-red-400'
                : 'border-border-dark text-text-secondary'
            } flex items-center justify-center transition-colors hover:border-primary/40 hover:text-primary`}
            aria-label={reminder.isCompleted ? 'Mark reminder as not completed' : 'Mark reminder as completed'}
          >
            <span className="material-symbols-outlined text-xl">{reminder.isCompleted ? 'check' : 'alarm'}</span>
          </button>

          {/* Time and label */}
          <div className={isActive ? '' : 'opacity-70 group-hover:opacity-100 transition-opacity'}>
            <p
              className={`text-xl font-medium ${
                isActive ? 'text-white' : isOverdue ? 'text-red-300' : 'text-text-secondary'
              } font-mono leading-none`}
            >
              {formatTime24(reminder.dueAt)}
            </p>
            <p className={`text-xs mt-1 ${reminder.isCompleted ? 'text-text-muted line-through' : 'text-text-secondary'}`}>
              {reminder.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!reminder.isCompleted && (
            <button
              type="button"
              onClick={() => onSnooze(reminder.id, 10)}
              className="p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/5"
              aria-label="Snooze 10 minutes"
            >
              <span className="material-symbols-outlined text-[18px]">snooze</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => onDelete(reminder.id)}
            className="p-2 rounded-lg text-red-400 hover:bg-red-500/10"
            aria-label="Delete reminder"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function formatTime24(iso) {
  const d = new Date(iso);
  const hh = `${d.getHours()}`.padStart(2, '0');
  const mm = `${d.getMinutes()}`.padStart(2, '0');
  return `${hh}:${mm}`;
}
