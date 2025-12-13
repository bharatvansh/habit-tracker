import React from 'react';
import { useUser } from '../context';
import DesktopSidebar from '../components/navigation/DesktopSidebar';
import SimpleHeader from '../components/shared/SimpleHeader';

export default function SettingsScreen() {
  return (
    <div className="flex h-full w-full bg-background-dark">
      <DesktopSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <SimpleHeader title="Settings" />
        <main className="flex-1 flex flex-col relative overflow-y-auto overflow-x-hidden bg-background-dark pb-20">
          {/* Header Section */}
          <header className="px-8 pt-12 pb-8 max-w-6xl mx-auto w-full">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-medium tracking-tight text-white">Settings</h1>
              <p className="text-text-secondary text-base font-light">Manage your preferences and account security.</p>
            </div>
          </header>

          {/* Content Section */}
          <div className="flex-1 px-8 pb-12 max-w-6xl mx-auto w-full flex flex-col gap-10">
            {/* Stat Cards Section */}
            <StatCardsSection />

            {/* Main Settings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Left Column - Account */}
              <div className="lg:col-span-2 flex flex-col gap-10">
                <AccountSection />
              </div>

              {/* Right Column - Appearance */}
              <div className="flex flex-col gap-10">
                <AppearanceSection />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Stat Cards Section Component
function StatCardsSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Storage Card */}
      <div className="flex flex-col justify-between p-6 bg-surface-dark rounded-xl border border-border-dark/50">
        <div className="flex justify-between items-start mb-6">
          <p className="text-text-secondary text-sm font-medium">Storage</p>
          <span className="material-symbols-outlined text-zinc-600 text-[20px]">cloud</span>
        </div>
        <div className="flex items-end gap-3">
          <h3 className="text-3xl font-light text-white">45<span className="text-zinc-600 text-xl">%</span></h3>
        </div>
        <div className="w-full bg-zinc-900 h-0.5 mt-4">
          <div className="bg-primary h-full w-[45%]"></div>
        </div>
      </div>

      {/* Streak Card */}
      <div className="flex flex-col justify-between p-6 bg-surface-dark rounded-xl border border-border-dark/50">
        <div className="flex justify-between items-start mb-6">
          <p className="text-text-secondary text-sm font-medium">Streak</p>
          <span className="material-symbols-outlined text-zinc-600 text-[20px]">local_fire_department</span>
        </div>
        <div className="flex items-end gap-3">
          <h3 className="text-3xl font-light text-white">85<span className="text-zinc-600 text-xl">Days</span></h3>
        </div>
        <p className="text-xs text-text-secondary mt-4 font-mono">BEST: 120</p>
      </div>
    </section>
  );
}

// Account Section Component
function AccountSection() {
  const { user, updateUser } = useUser();

  const handleNameChange = (e) => {
    updateUser({ displayName: e.target.value });
  };

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-lg font-medium text-white">Account</h2>
      </div>
      <div className="p-6 bg-surface-dark rounded-xl border border-border-dark/50 flex flex-col gap-8">
        <div className="flex items-center gap-6">
          {/* Profile Image */}
          <div className="relative group cursor-pointer shrink-0">
            <div 
              className="bg-center bg-no-repeat bg-cover rounded-full size-20 grayscale hover:grayscale-0 transition-all duration-500" 
              style={{
                backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuArxeDDWhBCaLqh4gGlyeu_IoPFcQTu-BotbnM3rhwH8KXBBNE50P1gvUuO44e_aDA_-SapFo5kr_gyyQWPerNugHUaj31TI_SUhEhxGiuq-YoesRst21sgHMQjREiUfP3HbqWutxXcjT3z6fx05hR3OE1kDLSy3nUH5cBwfwF6s6AjygkXek-5vu1grKBWe1ghhQbsiZA_DIeKF5RWQ3VGzy9qfLr9Idn_9d0lG14XZ196MpsGgqc9UN6orJdTxWynchmVc-4u0d8')"
              }}
            />
          </div>

          {/* Display Name Input */}
          <div className="flex flex-col gap-6 w-full max-w-md">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Display Name</label>
              <input 
                className="bg-transparent border-0 border-b border-zinc-800 focus:border-primary focus:ring-0 px-0 py-2 text-white font-normal placeholder-zinc-700 transition-colors w-full" 
                type="text" 
                value={user.displayName}
                onChange={handleNameChange}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Appearance Section Component
function AppearanceSection() {
  const { user, updatePreferences } = useUser();

  const handleThemeChange = (theme) => {
    updatePreferences({ theme });
  };

  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-lg font-medium text-white">Appearance</h2>
      <div className="bg-surface-dark rounded-xl border border-border-dark/50 p-6 flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
          {/* Light Theme Option */}
          <label className="cursor-pointer group">
            <input 
              className="peer sr-only" 
              name="theme" 
              type="radio" 
              value="light"
              checked={user.preferences?.theme === 'light'}
              onChange={() => handleThemeChange('light')}
            />
            <div className="rounded-lg border border-zinc-800 peer-checked:border-zinc-500 bg-black p-4 flex flex-col items-center gap-3 transition-all opacity-50 peer-checked:opacity-100">
              <span className="material-symbols-outlined text-zinc-400">light_mode</span>
              <span className="text-xs font-medium text-zinc-400">Light</span>
            </div>
          </label>

          {/* Dark Theme Option (Default Selected) */}
          <label className="cursor-pointer group">
            <input 
              className="peer sr-only" 
              name="theme" 
              type="radio" 
              value="dark"
              checked={user.preferences?.theme === 'dark' || !user.preferences?.theme}
              onChange={() => handleThemeChange('dark')}
            />
            <div className="rounded-lg border border-zinc-800 peer-checked:border-primary peer-checked:text-primary bg-black p-4 flex flex-col items-center gap-3 transition-all">
              <span className="material-symbols-outlined text-white peer-checked:text-primary">dark_mode</span>
              <span className="text-xs font-medium text-white peer-checked:text-primary">Dark</span>
            </div>
          </label>
        </div>
      </div>
    </section>
  );
}
