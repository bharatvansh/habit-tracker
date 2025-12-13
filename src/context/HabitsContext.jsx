import React, { createContext, useContext, useState, useEffect } from 'react';

const HABITS_STORAGE_KEY = 'habitual_habits';

const defaultHabits = [
  {
    id: '1',
    name: 'Hydration',
    icon: 'water_drop',
    current: 1.2,
    target: 2,
    unit: 'L',
    color: 'primary', // uses theme primary color
    increment: 0.25,
  },
  {
    id: '2',
    name: 'Reading',
    icon: 'menu_book',
    current: 15,
    target: 30,
    unit: 'm',
    color: 'white',
    increment: 5,
  },
];

const HabitsContext = createContext(undefined);

export function HabitsProvider({ children }) {
  const [habits, setHabits] = useState(() => {
    try {
      const stored = localStorage.getItem(HABITS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load habits from localStorage:', error);
    }
    return defaultHabits;
  });

  const [history, setHistory] = useState(() => {
    try {
      const stored = localStorage.getItem(`${HABITS_STORAGE_KEY}_history`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load habits history from localStorage:', error);
    }
    return [];
  });

  // Persist habits to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
    } catch (error) {
      console.error('Failed to save habits to localStorage:', error);
    }
  }, [habits]);

  // Persist history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${HABITS_STORAGE_KEY}_history`, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save habits history to localStorage:', error);
    }
  }, [history]);

  const addHabit = (habit) => {
    const newHabit = {
      ...habit,
      id: Date.now().toString(),
      current: 0,
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const deleteHabit = (habitId) => {
    setHabits((prev) => prev.filter((h) => h.id !== habitId));
  };

  const incrementProgress = (habitId) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === habitId) {
          const newCurrent = Math.min(habit.current + habit.increment, habit.target);
          return { ...habit, current: newCurrent };
        }
        return habit;
      })
    );
  };

  const resetDailyProgress = () => {
    // Save today's progress to history before resetting
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = {
      date: today,
      habits: habits.map((h) => ({
        id: h.id,
        name: h.name,
        current: h.current,
        target: h.target,
        completed: h.current >= h.target,
      })),
    };
    setHistory((prev) => [...prev.filter((r) => r.date !== today), todayRecord]);

    // Reset all habits to 0
    setHabits((prev) => prev.map((h) => ({ ...h, current: 0 })));
  };

  const updateHabit = (habitId, updates) => {
    setHabits((prev) =>
      prev.map((habit) => (habit.id === habitId ? { ...habit, ...updates } : habit))
    );
  };

  // Calculate overall completion percentage
  const overallCompletion =
    habits.length > 0
      ? habits.reduce((acc, h) => acc + (h.current / h.target) * 100, 0) / habits.length
      : 0;

  const value = {
    habits,
    history,
    addHabit,
    deleteHabit,
    incrementProgress,
    resetDailyProgress,
    updateHabit,
    overallCompletion,
  };

  return <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>;
}

export function useHabits() {
  const context = useContext(HabitsContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitsProvider');
  }
  return context;
}
