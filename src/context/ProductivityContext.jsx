import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const PRODUCTIVITY_STORAGE_KEY = 'habitual_productivity';

const ProductivityContext = createContext(undefined);

// Generate hourly slots for today (24 hours)
function generateTodaySlots() {
  const slots = [];
  for (let i = 0; i < 24; i++) {
    slots.push({
      hour: i,
      focusMinutes: 0,
      tasksCompleted: 0,
      habitsProgress: 0,
      score: 0,
    });
  }
  return slots;
}

// Generate daily slots for the week (7 days)
function generateWeekSlots() {
  const slots = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    slots.push({
      date: date.toISOString().split('T')[0],
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      focusMinutes: 0,
      tasksCompleted: 0,
      habitsCompletion: 0,
      score: 0,
    });
  }
  return slots;
}

function calculateScore(focusMinutes, tasksCompleted, habitsProgress) {
  // Weighted score: focus time (40%), tasks (35%), habits (25%)
  const focusScore = Math.min(focusMinutes / 180, 1) * 40; // Max 3 hours = 100%
  const taskScore = Math.min(tasksCompleted / 5, 1) * 35; // Max 5 tasks = 100%
  const habitScore = habitsProgress * 25;
  return Math.round(focusScore + taskScore + habitScore);
}

export function ProductivityProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(PRODUCTIVITY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Check if data is from today
        const today = new Date().toISOString().split('T')[0];
        if (parsed.lastUpdated?.startsWith(today)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Failed to load productivity data:', error);
    }
    return {
      todaySlots: generateTodaySlots(),
      weekSlots: generateWeekSlots(),
      lastUpdated: new Date().toISOString(),
      totalFocusToday: 0,
      totalTasksToday: 0,
    };
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTIVITY_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save productivity data:', error);
    }
  }, [data]);

  // Record focus session completion
  const recordFocusSession = useCallback((durationMinutes) => {
    const hour = new Date().getHours();
    setData(prev => {
      const newTodaySlots = [...prev.todaySlots];
      newTodaySlots[hour] = {
        ...newTodaySlots[hour],
        focusMinutes: newTodaySlots[hour].focusMinutes + durationMinutes,
        score: calculateScore(
          newTodaySlots[hour].focusMinutes + durationMinutes,
          newTodaySlots[hour].tasksCompleted,
          newTodaySlots[hour].habitsProgress
        ),
      };

      // Update week slot for today
      const today = new Date().toISOString().split('T')[0];
      const newWeekSlots = prev.weekSlots.map(slot => {
        if (slot.date === today) {
          const newFocus = slot.focusMinutes + durationMinutes;
          return {
            ...slot,
            focusMinutes: newFocus,
            score: calculateScore(newFocus, slot.tasksCompleted, slot.habitsCompletion),
          };
        }
        return slot;
      });

      return {
        ...prev,
        todaySlots: newTodaySlots,
        weekSlots: newWeekSlots,
        totalFocusToday: prev.totalFocusToday + durationMinutes,
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  // Record task completion
  const recordTaskCompletion = useCallback(() => {
    const hour = new Date().getHours();
    setData(prev => {
      const newTodaySlots = [...prev.todaySlots];
      newTodaySlots[hour] = {
        ...newTodaySlots[hour],
        tasksCompleted: newTodaySlots[hour].tasksCompleted + 1,
        score: calculateScore(
          newTodaySlots[hour].focusMinutes,
          newTodaySlots[hour].tasksCompleted + 1,
          newTodaySlots[hour].habitsProgress
        ),
      };

      const today = new Date().toISOString().split('T')[0];
      const newWeekSlots = prev.weekSlots.map(slot => {
        if (slot.date === today) {
          const newTasks = slot.tasksCompleted + 1;
          return {
            ...slot,
            tasksCompleted: newTasks,
            score: calculateScore(slot.focusMinutes, newTasks, slot.habitsCompletion),
          };
        }
        return slot;
      });

      return {
        ...prev,
        todaySlots: newTodaySlots,
        weekSlots: newWeekSlots,
        totalTasksToday: prev.totalTasksToday + 1,
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  // Update habits progress for current hour
  const updateHabitsProgress = useCallback((completionRate) => {
    const hour = new Date().getHours();
    setData(prev => {
      const newTodaySlots = [...prev.todaySlots];
      newTodaySlots[hour] = {
        ...newTodaySlots[hour],
        habitsProgress: completionRate,
        score: calculateScore(
          newTodaySlots[hour].focusMinutes,
          newTodaySlots[hour].tasksCompleted,
          completionRate
        ),
      };

      const today = new Date().toISOString().split('T')[0];
      const newWeekSlots = prev.weekSlots.map(slot => {
        if (slot.date === today) {
          return {
            ...slot,
            habitsCompletion: completionRate,
            score: calculateScore(slot.focusMinutes, slot.tasksCompleted, completionRate),
          };
        }
        return slot;
      });

      return {
        ...prev,
        todaySlots: newTodaySlots,
        weekSlots: newWeekSlots,
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  // Calculate trend percentage
  const calculateTrend = useCallback((view) => {
    if (view === 'today') {
      const hour = new Date().getHours();
      const recentHours = data.todaySlots.slice(Math.max(0, hour - 6), hour + 1);
      if (recentHours.length < 2) return 0;
      
      const mid = Math.floor(recentHours.length / 2);
      const oldAvg = recentHours.slice(0, mid).reduce((a, s) => a + s.score, 0) / mid || 0;
      const newAvg = recentHours.slice(mid).reduce((a, s) => a + s.score, 0) / (recentHours.length - mid) || 0;
      
      if (oldAvg === 0) return newAvg > 0 ? 100 : 0;
      return Math.round(((newAvg - oldAvg) / oldAvg) * 100);
    } else {
      const weekData = data.weekSlots;
      if (weekData.length < 2) return 0;
      
      const mid = Math.floor(weekData.length / 2);
      const oldAvg = weekData.slice(0, mid).reduce((a, s) => a + s.score, 0) / mid || 0;
      const newAvg = weekData.slice(mid).reduce((a, s) => a + s.score, 0) / (weekData.length - mid) || 0;
      
      if (oldAvg === 0) return newAvg > 0 ? 100 : 0;
      return Math.round(((newAvg - oldAvg) / oldAvg) * 100);
    }
  }, [data]);

  const value = {
    todaySlots: data.todaySlots,
    weekSlots: data.weekSlots,
    totalFocusToday: data.totalFocusToday,
    totalTasksToday: data.totalTasksToday,
    recordFocusSession,
    recordTaskCompletion,
    updateHabitsProgress,
    calculateTrend,
  };

  return (
    <ProductivityContext.Provider value={value}>
      {children}
    </ProductivityContext.Provider>
  );
}

export function useProductivity() {
  const context = useContext(ProductivityContext);
  if (context === undefined) {
    throw new Error('useProductivity must be used within a ProductivityProvider');
  }
  return context;
}
