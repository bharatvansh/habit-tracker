import React, { useMemo, useState } from 'react';
import DesktopSidebar from '../components/navigation/DesktopSidebar';
import SimpleHeader from '../components/shared/SimpleHeader';
import { useCalendar, useReminders, useTasks } from '../context';

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function CalendarScreen() {
  const { eventsByDate, addEvent, formatDateKey } = useCalendar();
  const { tasks } = useTasks();
  const { reminders } = useReminders();

  const today = new Date();
  const [viewMode, setViewMode] = useState('Month');

  const [monthCursor, setMonthCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  const [isAddOpen, setIsAddOpen] = useState(false);

  const year = monthCursor.getFullYear();
  const month = monthCursor.getMonth();

  // Month grid math
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays = useMemo(() => {
    const out = [];

    for (let i = startOffset - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const d = new Date(year, month - 1, day);
      out.push({ date: d, inCurrentMonth: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      out.push({ date: d, inCurrentMonth: true });
    }

    // Pad to complete the final week
    while (out.length % 7 !== 0) {
      const last = out[out.length - 1].date;
      const d = new Date(last);
      d.setDate(d.getDate() + 1);
      out.push({ date: d, inCurrentMonth: false });
    }
    return out;
  }, [daysInMonth, daysInPrevMonth, month, startOffset, year]);

  const selectedKey = formatDateKey(selectedDate);

  const dayItems = useMemo(() => {
    return buildScheduleForDate({
      date: selectedDate,
      formatDateKey,
      eventsByDate,
      tasks,
      reminders,
    });
  }, [eventsByDate, formatDateKey, reminders, selectedDate, tasks]);

  const upNextItem = useMemo(() => {
    const nowMs = Date.now();
    const isToday = isSameDay(selectedDate, new Date());
    const ordered = dayItems.slice().sort((a, b) => a.startAtMs - b.startAtMs);
    if (!isToday) return ordered[0] || null;
    return ordered.find((i) => i.startAtMs >= nowMs) || ordered[0] || null;
  }, [dayItems, selectedDate]);

  const handlePrevMonth = () => {
    setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleToday = () => {
    const d = new Date();
    setMonthCursor(new Date(d.getFullYear(), d.getMonth(), 1));
    setSelectedDate(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
  };

  const openAdd = () => setIsAddOpen(true);
  const closeAdd = () => setIsAddOpen(false);

  const handleAddEvent = ({ title, time, durationMinutes, location }) => {
    const [hh, mm] = (time || '10:00').split(':').map((v) => Number(v));
    const start = new Date(selectedDate);
    start.setHours(Number.isFinite(hh) ? hh : 10, Number.isFinite(mm) ? mm : 0, 0, 0);

    const end = new Date(start);
    end.setMinutes(end.getMinutes() + Math.max(15, Number(durationMinutes) || 60));

    addEvent({
      title,
      startAt: start.toISOString(),
      endAt: end.toISOString(),
      location,
      color: 'primary',
    });

    closeAdd();
  };

  const weekStart = useMemo(() => startOfWeekMonday(selectedDate), [selectedDate]);
  const weekDays = useMemo(() => {
    const out = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      out.push(d);
    }
    return out;
  }, [weekStart]);

  return (
    <div className="flex h-full w-full bg-theme-primary transition-colors duration-200">
      <DesktopSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <SimpleHeader title="Calendar" />
        <main className="flex-1 flex flex-col lg:flex-row w-full p-4 lg:p-6 gap-6 overflow-hidden lg:h-[calc(100vh-64px)] overflow-y-auto pb-20">
          {/* Main Calendar Section */}
          <section className="flex flex-col flex-1 h-full min-h-0">
            {/* Header with Month/Year and Navigation */}
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-6">
                <h1 className="text-3xl font-bold text-theme-primary tracking-tighter">
                  {monthNames[month]} <span className="text-theme-muted font-light">{year}</span>
                </h1>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-1 hover:bg-[var(--hover-overlay)] rounded-full transition-colors text-theme-muted hover:text-theme-primary"
                    aria-label="Previous month"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-1 hover:bg-[var(--hover-overlay)] rounded-full transition-colors text-theme-muted hover:text-theme-primary"
                    aria-label="Next month"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleToday}
                    className="ml-2 px-3 py-1 text-xs font-semibold text-theme-secondary hover:text-theme-primary border border-theme-subtle rounded-md hover:bg-[var(--hover-overlay)] transition-all"
                  >
                    Today
                  </button>
                </div>
              </div>
              {/* View Toggle (Month/Week/Day) */}
              <div className="flex items-center p-0.5 bg-theme-surface border border-theme-subtle rounded-lg">
                {['Month', 'Week', 'Day'].map((view) => (
                  <button
                    type="button"
                    key={view}
                    onClick={() => setViewMode(view)}
                    className={`px-4 py-1.5 text-xs font-semibold transition-colors ${
                      viewMode === view
                        ? 'text-theme-primary bg-theme-elevated rounded-[5px] shadow-sm'
                        : 'text-theme-muted hover:text-theme-secondary'
                    }`}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendar Grid / Week / Day */}
            {viewMode === 'Day' ? (
              <div className="flex-1 min-h-[420px]">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-theme-muted text-xs font-bold tracking-widest uppercase">Selected</p>
                    <h2 className="text-theme-primary text-xl font-medium">
                      {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={openAdd}
                    className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-primary/80 transition-colors"
                  >
                    Add Event
                  </button>
                </div>
                <ScheduleTimeline selectedDate={selectedDate} items={dayItems} />
              </div>
            ) : viewMode === 'Week' ? (
              <div className="flex-1 flex flex-col gap-3 min-h-[500px]">
                <div className="grid grid-cols-7 gap-2 lg:gap-3">
                  {dayNames.map((day) => (
                    <div key={day} className="text-center text-theme-muted text-[10px] font-bold uppercase tracking-widest py-2">
                      {day}
                    </div>
                  ))}
                  {weekDays.map((d) => (
                    <CalendarDayCell
                      key={d.toISOString()}
                      date={d}
                      inCurrentMonth={d.getMonth() === monthCursor.getMonth()}
                      selectedDate={selectedDate}
                      onSelectDate={(next) => {
                        setSelectedDate(next);
                        setMonthCursor(new Date(next.getFullYear(), next.getMonth(), 1));
                      }}
                      badges={buildBadgesForDate({ date: d, formatDateKey, eventsByDate, tasks, reminders })}
                    />
                  ))}
                </div>

                <div className="mt-2">
                  <ScheduleTimeline selectedDate={selectedDate} items={dayItems} />
                </div>
              </div>
            ) : (
              <div className="flex-1 grid grid-cols-7 grid-rows-[auto_1fr] gap-2 lg:gap-3 lg:overflow-y-auto pr-2 pb-2 min-h-[500px]">
                {/* Day Headers */}
                {dayNames.map((day) => (
                  <div key={day} className="text-center text-theme-muted text-[10px] font-bold uppercase tracking-widest py-2">
                    {day}
                  </div>
                ))}

                {calendarDays.map(({ date, inCurrentMonth }) => (
                  <CalendarDayCell
                    key={date.toISOString()}
                    date={date}
                    inCurrentMonth={inCurrentMonth}
                    selectedDate={selectedDate}
                    onSelectDate={(next) => setSelectedDate(next)}
                    badges={buildBadgesForDate({ date, formatDateKey, eventsByDate, tasks, reminders })}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Right Sidebar - Up Next & Schedule */}
          <aside className="w-full lg:w-[380px] shrink-0 flex flex-col gap-6 overflow-y-auto pr-1 pb-20 lg:pb-0">
            <UpNextPanel selectedDate={selectedDate} upNext={upNextItem} onAddEvent={openAdd} />
            <ScheduleTimeline selectedDate={selectedDate} items={dayItems} />
          </aside>

          {/* Floating Add Button */}
          <button
            type="button"
            onClick={openAdd}
            className="fixed bottom-20 md:bottom-8 right-8 size-12 bg-primary text-white rounded-full shadow-[0_0_20px_rgba(124,58,237,0.4)] flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 z-50 group"
            aria-label="Add event"
          >
            <span className="material-symbols-outlined text-[24px] transition-transform group-hover:rotate-90">add</span>
          </button>

          {isAddOpen && (
            <AddEventModal
              selectedDate={selectedDate}
              onClose={closeAdd}
              onSubmit={handleAddEvent}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function CalendarDayCell({ date, inCurrentMonth, selectedDate, onSelectDate, badges }) {
  const isToday = isSameDay(date, new Date());
  const isSelected = isSameDay(date, selectedDate);
  const day = date.getDate();

  const base = `minimal-card bg-transparent border border-theme-subtle min-h-[80px] lg:min-h-[120px] rounded-lg p-2 flex flex-col gap-1 relative group cursor-pointer transition-colors`;
  const dim = inCurrentMonth ? '' : ' opacity-30';
  const hover = ' hover:bg-[var(--hover-overlay)]';
  const selected = isSelected ? ' border border-primary/40 bg-primary/5' : '';
  const today = isToday ? ' border border-primary/30' : '';

  return (
    <button
      type="button"
      onClick={() => onSelectDate(new Date(date.getFullYear(), date.getMonth(), date.getDate()))}
      className={`${base}${dim}${hover}${selected}${today}`}
      aria-label={`Select ${date.toDateString()}`}
    >
      <div className="flex justify-between items-center">
        {isToday ? (
          <span className="size-6 flex items-center justify-center rounded-full bg-primary text-white text-xs font-bold shadow-lg shadow-primary/20">
            {day}
          </span>
        ) : (
          <span className={`text-xs font-semibold ${inCurrentMonth ? 'text-theme-secondary group-hover:text-theme-primary' : 'text-theme-muted'} transition-colors`}>
            {day}
          </span>
        )}
      </div>

      {badges.slice(0, 2).map((b, idx) => (
        <EventBadge key={`${b.title}-${idx}`} badge={b} isToday={isToday} />
      ))}
    </button>
  );
}

function EventBadge({ badge, isToday }) {
  const colorClasses = {
    zinc: 'bg-theme-elevated border-theme-subtle text-theme-secondary',
    primary: isToday ? 'bg-primary/20 border-primary/30 text-theme-primary' : 'bg-primary/20 border-primary/40 text-theme-primary',
    'primary-light': 'bg-primary/10 border-primary/20 text-primary',
    green: 'bg-green-500/10 border-green-500/20 text-green-300',
    red: 'bg-red-500/10 border-red-500/20 text-red-300',
  };

  return (
    <div className={`${colorClasses[badge.color] || colorClasses.zinc} border rounded px-1.5 py-0.5 text-[10px] truncate flex items-center gap-1 mt-1`}>
      {badge.icon ? (
        <span className="material-symbols-outlined text-[10px]">{badge.icon}</span>
      ) : (
        <span className="size-1.5 rounded-full bg-theme-muted"></span>
      )}
      {badge.title}
    </div>
  );
}

function UpNextPanel({ selectedDate, upNext, onAddEvent }) {
  const subtitle = upNext
    ? `${formatTime24FromMs(upNext.startAtMs)}${upNext.endAtMs ? ` - ${formatTime24FromMs(upNext.endAtMs)}` : ''}${upNext.location ? ` • ${upNext.location}` : ''}`
    : 'No items scheduled';

  return (
    <div className="bg-theme-card border border-theme-subtle rounded-xl p-5 relative overflow-hidden group transition-colors duration-200">
      <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary/10 rounded-full blur-[40px] pointer-events-none"></div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-theme-muted">Up Next</h3>
        <button type="button" onClick={onAddEvent} className="text-theme-muted hover:text-theme-primary transition-colors" aria-label="Add event">
          <span className="material-symbols-outlined text-[18px]">add</span>
        </button>
      </div>

      <div className="flex items-start gap-4 mb-3">
        <div className="w-1 h-14 bg-primary rounded-full shadow-[0_0_10px_rgba(124,58,237,0.4)]"></div>
        <div className="flex-1 z-10">
          <h2 className="text-xl font-bold text-theme-primary mb-1 leading-none">
            {upNext ? upNext.title : selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </h2>
          <p className="text-theme-muted text-xs mb-3">{subtitle}</p>
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <button
          type="button"
          onClick={onAddEvent}
          className="flex-1 bg-[var(--hover-overlay)] border border-theme-subtle text-theme-primary hover:bg-primary hover:border-primary hover:text-white py-2 rounded-md text-xs font-semibold transition-all"
        >
          Add to Schedule
        </button>
      </div>
    </div>
  );
}

function ScheduleTimeline({ selectedDate, items }) {
  const now = new Date();
  const showNow = isSameDay(selectedDate, now);
  const nowLabel = `${`${now.getHours()}`.padStart(2, '0')}:${`${now.getMinutes()}`.padStart(2, '0')}`;

  const sorted = items.slice().sort((a, b) => a.startAtMs - b.startAtMs);

  const withNowLine = useMemo(() => {
    if (!showNow) return sorted;
    const nowMs = Date.now();
    const out = [];
    let inserted = false;
    for (const it of sorted) {
      if (!inserted && it.startAtMs >= nowMs) {
        out.push({ isCurrentTime: true, time: nowLabel, key: 'now' });
        inserted = true;
      }
      out.push(it);
    }
    if (!inserted) out.push({ isCurrentTime: true, time: nowLabel, key: 'now' });
    return out;
  }, [nowLabel, showNow, sorted]);

  return (
    <div className="bg-theme-card border border-theme-subtle rounded-xl p-5 flex-1 min-h-[400px] transition-colors duration-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-theme-muted">Schedule</h3>
          <p className="text-[10px] text-theme-muted mt-1">
            {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </p>
        </div>
        <span className="text-[10px] font-mono text-theme-muted">{items.length} item{items.length === 1 ? '' : 's'}</span>
      </div>

      <div className="relative pl-2 space-y-6">
        <div className="absolute left-[54px] top-2 bottom-0 w-[1px] bg-theme-elevated"></div>

        {withNowLine.length === 0 ? (
          <div className="text-theme-secondary text-sm py-8 text-center">No scheduled items.</div>
        ) : (
          withNowLine.map((item, index) => {
            if (item.isCurrentTime) {
              return (
                <div key={item.key || index} className="flex items-center gap-4 relative z-10">
                  <span className="w-10 text-right text-xs font-mono font-bold text-primary pt-0">{item.time}</span>
                  <div className="flex-1 h-[1px] bg-primary/50 laser-line relative flex items-center">
                    <div className="absolute -left-1 size-2 rounded-full bg-primary shadow-[0_0_8px_#7c3aed]"></div>
                  </div>
                </div>
              );
            }

            const isPast = showNow ? item.startAtMs < Date.now() : false;
            const isActive = showNow ? item.startAtMs <= Date.now() && (item.endAtMs || item.startAtMs + 45 * 60 * 1000) >= Date.now() : false;

            if (isActive) {
              return (
                <div key={item.key || index} className="flex gap-4 group">
                  <span className="w-10 text-right text-xs font-mono text-theme-primary pt-1">{formatTime24FromMs(item.startAtMs)}</span>
                  <div className="flex-1 bg-primary/5 rounded border border-primary/20 p-2 ml-1 shadow-[0_0_15px_-5px_rgba(124,58,237,0.1)]">
                    <div className="flex justify-between items-start">
                      <p className="text-xs font-bold text-theme-primary">{item.title}</p>
                      <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
                    </div>
                    <p className="text-[10px] text-primary mt-0.5">{item.location || item.meta || ''}</p>
                  </div>
                </div>
              );
            }

            return (
              <div key={item.key || index} className={`flex gap-4 group ${isPast ? 'opacity-60 hover:opacity-100' : ''} transition-opacity`}>
                <span className="w-10 text-right text-xs font-mono text-theme-muted pt-1">{formatTime24FromMs(item.startAtMs)}</span>
                <div className="flex-1 pl-4 relative">
                  <div className="absolute left-[-5px] top-2 size-1.5 rounded-full bg-theme-elevated ring-4 ring-[var(--bg-primary)]"></div>
                  <p className="text-sm font-medium text-theme-secondary">{item.title}</p>
                  <p className="text-[10px] text-theme-muted">{item.location || item.meta || ''}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function AddEventModal({ selectedDate, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('10:00');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [location, setLocation] = useState('');

  const dateLabel = selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/70" onClick={onClose} aria-label="Close" />
      <div className="relative w-full max-w-lg rounded-2xl bg-card-dark border border-white/10 p-6 shadow-2xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Add Event</p>
            <h2 className="text-white text-xl font-medium">{dateLabel}</h2>
          </div>
          <button type="button" onClick={onClose} className="text-text-muted hover:text-white transition-colors" aria-label="Close">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What’s happening?"
              className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Duration</label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
              >
                {[15, 30, 45, 60, 90, 120].map((m) => (
                  <option key={m} value={m}>
                    {m} min
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Location (optional)</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Room 402 / Google Meet"
              className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={() => onSubmit({ title: title.trim() || 'Event', time, durationMinutes, location })}
              className="flex-1 bg-primary text-white text-xs font-bold uppercase tracking-widest py-3 rounded-xl hover:bg-primary/80 transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest py-3 rounded-xl hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function buildBadgesForDate({ date, formatDateKey, eventsByDate, tasks, reminders }) {
  const key = formatDateKey(date);
  const badges = [];

  const events = eventsByDate.get(key) || [];
  events.slice(0, 2).forEach((e) => {
    badges.push({ title: e.title, icon: 'event', color: 'primary' });
  });

  const taskCount = tasksForDate(tasks, date).length;
  if (taskCount > 0) badges.push({ title: `${taskCount} task${taskCount === 1 ? '' : 's'}`, icon: 'check_circle', color: 'zinc' });

  const reminderCount = remindersForDate(reminders, date).length;
  if (reminderCount > 0) badges.push({ title: `${reminderCount} reminder${reminderCount === 1 ? '' : 's'}`, icon: 'alarm', color: 'zinc' });

  return badges;
}

function buildScheduleForDate({ date, formatDateKey, eventsByDate, tasks, reminders }) {
  const key = formatDateKey(date);
  const out = [];

  const events = eventsByDate.get(key) || [];
  events.forEach((e) => {
    out.push({
      key: `event-${e.id}`,
      type: 'event',
      title: e.title,
      startAtMs: new Date(e.startAt).getTime(),
      endAtMs: e.endAt ? new Date(e.endAt).getTime() : null,
      location: e.location || '',
      meta: e.location || '',
    });
  });

  tasksForDate(tasks, date).forEach((t) => {
    const dueAtMs = getTaskDueAtMs(t, date);
    if (!dueAtMs) return;
    out.push({
      key: `task-${t.id}`,
      type: 'task',
      title: t.title,
      startAtMs: dueAtMs,
      endAtMs: null,
      location: '',
      meta: t.label ? `${t.label} • ${t.status}` : t.status,
    });
  });

  remindersForDate(reminders, date).forEach((r) => {
    out.push({
      key: `rem-${r.id}`,
      type: 'reminder',
      title: r.title,
      startAtMs: new Date(r.dueAt).getTime(),
      endAtMs: null,
      location: '',
      meta: r.isCompleted ? 'Completed' : 'Reminder',
    });
  });

  return out.sort((a, b) => a.startAtMs - b.startAtMs);
}

function tasksForDate(tasks, date) {
  return tasks.filter((t) => {
    const dueAtMs = getTaskDueAtMs(t);
    if (!dueAtMs) return false;
    return isSameDay(new Date(dueAtMs), date);
  });
}

function remindersForDate(reminders, date) {
  return reminders.filter((r) => isSameDay(new Date(r.dueAt), date));
}

function getTaskDueAtMs(task) {
  // Best-effort: prefer an ISO field if present; otherwise try to interpret existing sample strings.
  if (task?.dueAt) {
    const ms = new Date(task.dueAt).getTime();
    return Number.isFinite(ms) ? ms : null;
  }
  const now = new Date();
  let base = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (task?.dueDate) {
    const d = String(task.dueDate).toLowerCase();
    if (d.includes('tomorrow')) {
      base.setDate(base.getDate() + 1);
    } else if (d.includes('today')) {
      // keep today
    }
  }

  const time = task?.dueTime ? String(task.dueTime) : null;
  if (time && time.includes(':')) {
    const [hh, mm] = time.split(':').map((v) => Number(v));
    base.setHours(Number.isFinite(hh) ? hh : 9, Number.isFinite(mm) ? mm : 0, 0, 0);
  } else {
    base.setHours(9, 0, 0, 0);
  }

  return base.getTime();
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function startOfWeekMonday(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay();
  const mondayBased = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - mondayBased);
  return d;
}

function formatTime24FromMs(ms) {
  const d = new Date(ms);
  const hh = `${d.getHours()}`.padStart(2, '0');
  const mm = `${d.getMinutes()}`.padStart(2, '0');
  return `${hh}:${mm}`;
}
