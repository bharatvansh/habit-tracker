import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

const REMINDERS_STORAGE_KEY = 'habitual_reminders';

const defaultReminders = [
  {
    id: '1',
    title: 'Evening Run',
    dueAt: (() => {
      const d = new Date();
      d.setHours(19, 30, 0, 0);
      return d.toISOString();
    })(),
    createdAt: new Date().toISOString(),
    isCompleted: false,
    completedAt: null,
  },
  {
    id: '2',
    title: 'Vitamins',
    dueAt: (() => {
      const d = new Date();
      d.setHours(21, 0, 0, 0);
      return d.toISOString();
    })(),
    createdAt: new Date().toISOString(),
    isCompleted: false,
    completedAt: null,
  },
];

const RemindersContext = createContext(undefined);

function safeJsonParse(value, fallback) {
  try {
    if (!value) return fallback;
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function normalizeReminder(r) {
  if (!r || typeof r !== 'object') return null;
  const id = typeof r.id === 'string' ? r.id : Date.now().toString();
  const title = typeof r.title === 'string' ? r.title : 'Reminder';
  const dueAt = typeof r.dueAt === 'string' ? r.dueAt : new Date().toISOString();
  const createdAt = typeof r.createdAt === 'string' ? r.createdAt : new Date().toISOString();
  const isCompleted = Boolean(r.isCompleted);
  const completedAt = typeof r.completedAt === 'string' ? r.completedAt : null;
  return { id, title, dueAt, createdAt, isCompleted, completedAt };
}

function sortByDueAtAsc(a, b) {
  return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
}

export function RemindersProvider({ children }) {
  const [reminders, setReminders] = useState(() => {
    const stored = safeJsonParse(localStorage.getItem(REMINDERS_STORAGE_KEY), null);
    if (Array.isArray(stored)) {
      const normalized = stored.map(normalizeReminder).filter(Boolean);
      if (normalized.length > 0) return normalized;
    }
    return defaultReminders;
  });

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
    } catch (error) {
      console.error('Failed to save reminders to localStorage:', error);
    }
  }, [reminders]);

  const addReminder = ({ title, dueAt }) => {
    const newReminder = normalizeReminder({
      id: Date.now().toString(),
      title: title?.trim() || 'Reminder',
      dueAt,
      createdAt: new Date().toISOString(),
      isCompleted: false,
      completedAt: null,
    });

    setReminders((prev) => [...prev, newReminder].sort(sortByDueAtAsc));
    return newReminder;
  };

  const deleteReminder = (reminderId) => {
    setReminders((prev) => prev.filter((r) => r.id !== reminderId));
  };

  const updateReminder = (reminderId, updates) => {
    setReminders((prev) =>
      prev
        .map((r) => (r.id === reminderId ? normalizeReminder({ ...r, ...updates }) : r))
        .filter(Boolean)
        .sort(sortByDueAtAsc)
    );
  };

  const toggleReminderComplete = (reminderId) => {
    setReminders((prev) =>
      prev
        .map((r) => {
          if (r.id !== reminderId) return r;
          const nextCompleted = !r.isCompleted;
          return {
            ...r,
            isCompleted: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : null,
          };
        })
        .sort(sortByDueAtAsc)
    );
  };

  const snoozeReminder = (reminderId, minutes = 10) => {
    const deltaMs = Math.max(1, minutes) * 60 * 1000;
    setReminders((prev) =>
      prev
        .map((r) => {
          if (r.id !== reminderId) return r;
          const nextDueAt = new Date(Date.now() + deltaMs).toISOString();
          return { ...r, dueAt: nextDueAt, isCompleted: false, completedAt: null };
        })
        .sort(sortByDueAtAsc)
    );
  };

  const nowMs = Date.now();

  const upcomingReminders = useMemo(() => {
    return reminders
      .filter((r) => !r.isCompleted)
      .slice()
      .sort(sortByDueAtAsc);
  }, [reminders]);

  const overdueReminders = useMemo(() => {
    return reminders
      .filter((r) => !r.isCompleted && new Date(r.dueAt).getTime() < nowMs)
      .slice()
      .sort(sortByDueAtAsc);
  }, [reminders, nowMs]);

  const nextReminder = upcomingReminders[0] || null;

  // Best-effort notifications while the app is open (web + electron renderer).
  const notifiedIdsRef = useRef(new Set());
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const due = reminders.filter((r) => !r.isCompleted && new Date(r.dueAt).getTime() <= now);
      due.forEach((r) => {
        if (notifiedIdsRef.current.has(r.id)) return;
        notifiedIdsRef.current.add(r.id);

        try {
          if (typeof Notification !== 'undefined') {
            if (Notification.permission === 'granted') {
              // eslint-disable-next-line no-new
              new Notification('Reminder', { body: r.title });
              return;
            }
          }
        } catch {
          // ignore
        }
      });
    }, 15 * 1000);

    return () => clearInterval(interval);
  }, [reminders]);

  const requestNotificationPermission = async () => {
    if (typeof Notification === 'undefined') return 'unsupported';
    try {
      const result = await Notification.requestPermission();
      return result;
    } catch {
      return 'denied';
    }
  };

  const value = {
    reminders,
    upcomingReminders,
    overdueReminders,
    nextReminder,
    addReminder,
    deleteReminder,
    updateReminder,
    toggleReminderComplete,
    snoozeReminder,
    requestNotificationPermission,
  };

  return <RemindersContext.Provider value={value}>{children}</RemindersContext.Provider>;
}

export function useReminders() {
  const context = useContext(RemindersContext);
  if (context === undefined) {
    throw new Error('useReminders must be used within a RemindersProvider');
  }
  return context;
}
