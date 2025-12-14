import React from 'react';
import { UserProvider, useUser } from './UserContext';
import { HabitsProvider, useHabits } from './HabitsContext';
import { TasksProvider, useTasks } from './TasksContext';
import { WeatherProvider, useWeather } from './WeatherContext';
import { TimerProvider, useTimer } from './TimerContext';
import { RemindersProvider, useReminders } from './RemindersContext';
import { CalendarProvider, useCalendar } from './CalendarContext';
import { ProductivityProvider, useProductivity } from './ProductivityContext';
import { ThemeProvider, useTheme } from './ThemeContext';

// Combined provider that wraps all context providers
export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <UserProvider>
        <TasksProvider>
          <HabitsProvider>
            <RemindersProvider>
              <CalendarProvider>
                <WeatherProvider>
                  <TimerProvider>
                    <ProductivityProvider>
                      {children}
                    </ProductivityProvider>
                  </TimerProvider>
                </WeatherProvider>
              </CalendarProvider>
            </RemindersProvider>
          </HabitsProvider>
        </TasksProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

// Re-export all hooks for easy access
export { useUser } from './UserContext';
export { useHabits } from './HabitsContext';
export { useTasks } from './TasksContext';
export { useWeather } from './WeatherContext';
export { useTimer } from './TimerContext';
export { useReminders } from './RemindersContext';
export { useCalendar } from './CalendarContext';
export { useProductivity } from './ProductivityContext';
export { useTheme } from './ThemeContext';
