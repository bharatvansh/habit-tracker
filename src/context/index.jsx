import React from 'react';
import { UserProvider, useUser } from './UserContext';
import { HabitsProvider, useHabits } from './HabitsContext';
import { TasksProvider, useTasks } from './TasksContext';
import { WeatherProvider, useWeather } from './WeatherContext';
import { TimerProvider, useTimer } from './TimerContext';

// Combined provider that wraps all context providers
export function AppProviders({ children }) {
  return (
    <UserProvider>
      <TasksProvider>
        <HabitsProvider>
          <WeatherProvider>
            <TimerProvider>
              {children}
            </TimerProvider>
          </WeatherProvider>
        </HabitsProvider>
      </TasksProvider>
    </UserProvider>
  );
}

// Re-export all hooks for easy access
export { useUser } from './UserContext';
export { useHabits } from './HabitsContext';
export { useTasks } from './TasksContext';
export { useWeather } from './WeatherContext';
export { useTimer } from './TimerContext';
