import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CALENDAR_STORAGE_KEY = 'habitual_calendar_events';

const defaultEvents = [
  {
    id: '1',
    title: 'Client Meeting',
    startAt: (() => {
      const d = new Date();
      d.setHours(10, 0, 0, 0);
      return d.toISOString();
    })(),
    endAt: (() => {
      const d = new Date();
      d.setHours(11, 30, 0, 0);
      return d.toISOString();
    })(),
    location: 'Room 402',
    color: 'primary',
    createdAt: new Date().toISOString(),
  },
];

const CalendarContext = createContext(undefined);

function safeJsonParse(value, fallback) {
  try {
    if (!value) return fallback;
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function normalizeEvent(e) {
  if (!e || typeof e !== 'object') return null;
  const id = typeof e.id === 'string' ? e.id : Date.now().toString();
  const title = typeof e.title === 'string' ? e.title : 'Event';
  const startAt = typeof e.startAt === 'string' ? e.startAt : new Date().toISOString();
  const endAt = typeof e.endAt === 'string' ? e.endAt : null;
  const location = typeof e.location === 'string' ? e.location : '';
  const color = typeof e.color === 'string' ? e.color : 'zinc';
  const createdAt = typeof e.createdAt === 'string' ? e.createdAt : new Date().toISOString();
  return { id, title, startAt, endAt, location, color, createdAt };
}

function sortByStartAtAsc(a, b) {
  return new Date(a.startAt).getTime() - new Date(b.startAt).getTime();
}

function formatDateKey(d) {
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function CalendarProvider({ children }) {
  const [events, setEvents] = useState(() => {
    const stored = safeJsonParse(localStorage.getItem(CALENDAR_STORAGE_KEY), null);
    if (Array.isArray(stored)) {
      const normalized = stored.map(normalizeEvent).filter(Boolean);
      if (normalized.length > 0) return normalized.sort(sortByStartAtAsc);
    }
    return defaultEvents;
  });

  useEffect(() => {
    try {
      localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(events));
    } catch (error) {
      console.error('Failed to save calendar events to localStorage:', error);
    }
  }, [events]);

  const addEvent = ({ title, startAt, endAt, location, color }) => {
    const newEvent = normalizeEvent({
      id: Date.now().toString(),
      title: title?.trim() || 'Event',
      startAt,
      endAt: endAt || null,
      location: location || '',
      color: color || 'primary',
      createdAt: new Date().toISOString(),
    });
    setEvents((prev) => [...prev, newEvent].sort(sortByStartAtAsc));
    return newEvent;
  };

  const updateEvent = (eventId, updates) => {
    setEvents((prev) =>
      prev
        .map((e) => (e.id === eventId ? normalizeEvent({ ...e, ...updates }) : e))
        .filter(Boolean)
        .sort(sortByStartAtAsc)
    );
  };

  const deleteEvent = (eventId) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  const eventsByDate = useMemo(() => {
    const map = new Map();
    events.forEach((e) => {
      const key = formatDateKey(new Date(e.startAt));
      const list = map.get(key) || [];
      list.push(e);
      map.set(key, list);
    });
    // Sort each bucket
    map.forEach((list, key) => {
      map.set(key, list.slice().sort(sortByStartAtAsc));
    });
    return map;
  }, [events]);

  const value = {
    events,
    eventsByDate,
    addEvent,
    updateEvent,
    deleteEvent,
    formatDateKey,
  };

  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}
