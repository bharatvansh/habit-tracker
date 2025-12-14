import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useUser } from '../../context';

const navItems = [
  { path: '/', icon: 'dashboard', label: 'Overview' },
  { path: '/calendar', icon: 'calendar_month', label: 'Calendar' },
  { path: '/tasks', icon: 'check_circle', label: 'Tasks' },
  { path: '/reminders', icon: 'timer', label: 'Focus' },
];

const bottomNavItems = [
  { path: '/settings', icon: 'settings', label: 'Settings' },
];

export default function DesktopSidebar() {
  const location = useLocation();
  const { user } = useUser();

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group ${
      isActive(path)
        ? 'bg-primary/10 text-primary border border-primary/20'
        : 'text-theme-muted hover:text-theme-primary hover:bg-[var(--hover-overlay)]'
    }`;

  return (
    <nav
      className="w-20 lg:w-64 flex-col border-r border-theme-primary bg-theme-card h-full flex-shrink-0 z-20 hidden md:flex transition-colors duration-200"
      data-testid="desktop-sidebar"
    >
      {/* Logo Section */}
      <div className="p-6 flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-white text-[18px]">all_inclusive</span>
        </div>
        <div className="hidden lg:flex flex-col">
          <h1 className="text-theme-primary text-sm font-bold tracking-tight">Habitual</h1>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={linkClass(item.path)}
            data-testid={`sidebar-nav-${item.label.toLowerCase()}`}
          >
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            <span className="hidden lg:block text-sm">{item.label}</span>
          </NavLink>
        ))}

        {/* Divider */}
        <div className="my-4 border-t border-theme-primary"></div>

        {/* Bottom Navigation Items (Settings) */}
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={linkClass(item.path)}
            data-testid={`sidebar-nav-${item.label.toLowerCase()}`}
          >
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            <span className="hidden lg:block text-sm">{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-theme-primary">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--hover-overlay)] cursor-pointer transition-colors">
          <div
            className="h-6 w-6 rounded-full bg-cover bg-center ring-1 ring-theme-primary"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBwxTbu8JnlhJ_p5kU7_TkNXMciOOJNpYsR_gGnMTg0Q5N_Mh1NPJMVfaTsV8D35MJ4qOR3WZ22Jl0PzWbq__BpLCzyQrEnzND8wzBw2qXkirmdNivp7eERoxVyZLdRYPbafDHJ4cX1Q-K9YSePV_8jEfGN0twAHWnZHgighELV8eyVPWrfXYPYh2RUCipAZaaFKX5ppp1NEUspR-eMWZxUkWnEcQhH3V-WbOp9PYmwcfb01Wtx3cfCbR4T6kCxv6eUNP9G5eZXqCk')",
            }}
          ></div>
          <div className="hidden lg:flex flex-col">
            <p className="text-xs font-medium text-theme-primary">{user?.displayName || user?.name || 'User'}</p>
          </div>
        </div>
      </div>
    </nav>
  );
}

export { navItems, bottomNavItems };
