import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', icon: 'dashboard', label: 'Dashboard' },
  { path: '/calendar', icon: 'calendar_month', label: 'Calendar' },
  { path: '/tasks', icon: 'check_circle', label: 'Tasks' },
  { path: '/reminders', icon: 'timer', label: 'Reminders' },
  { path: '/settings', icon: 'settings', label: 'Settings' },
];

export default function GlobalNavigation() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="fixed bottom-0 w-full z-[100] md:hidden bg-card-dark border-t border-white/10 p-2 flex justify-around items-center"
      data-testid="mobile-navigation"
    >
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
            isActive(item.path) ? 'text-primary' : 'text-text-muted'
          }`}
          data-testid={`nav-${item.label.toLowerCase()}`}
        >
          <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
        </Link>
      ))}
    </nav>
  );
}

export { navItems };
