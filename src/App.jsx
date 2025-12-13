import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import GlobalNavigation from './components/navigation/GlobalNavigation';
import TitleBar from './components/shared/TitleBar';
import DashboardScreen from './screens/DashboardScreen';
import CalendarScreen from './screens/CalendarScreen';
import TasksScreen from './screens/TasksScreen';
import RemindersScreen from './screens/RemindersScreen';
import SettingsScreen from './screens/SettingsScreen';

// Route configuration for the application
export const routes = [
  { path: '/', element: <DashboardScreen />, name: 'Dashboard' },
  { path: '/calendar', element: <CalendarScreen />, name: 'Calendar' },
  { path: '/tasks', element: <TasksScreen />, name: 'Tasks' },
  { path: '/reminders', element: <RemindersScreen />, name: 'Reminders' },
  { path: '/settings', element: <SettingsScreen />, name: 'Settings' },
];

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-background-dark">
        <TitleBar />
        <main className="pb-16 md:pb-0 pt-8">
          <Routes>
            {routes.map((route) => (
              <Route key={route.path} path={route.path} element={route.element} />
            ))}
          </Routes>
        </main>
        <GlobalNavigation />
      </div>
    </HashRouter>
  );
}
