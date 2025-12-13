import React from 'react';
import { useUser, useTasks } from '../context';
import DesktopSidebar from '../components/navigation/DesktopSidebar';
import SimpleHeader from '../components/shared/SimpleHeader';
import FocusTimer from '../components/widgets/FocusTimer';
import WeatherCard from '../components/widgets/WeatherCard';
import UpNextCard from '../components/widgets/UpNextCard';
import ProductivityChart from '../components/widgets/ProductivityChart';
import HabitsWidget from '../components/widgets/HabitsWidget';

// Get appropriate greeting based on time of day
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function DashboardScreen() {
  const { firstName } = useUser();
  const { focusBlocksRemaining } = useTasks();
  const greeting = getGreeting();

  return (
    <div className="flex h-full w-full bg-background-dark">
      <DesktopSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <SimpleHeader title="Dashboard" />
        
        <main className="flex-1 flex flex-col items-center w-full px-4 lg:px-10 py-8 lg:py-12 overflow-y-auto pb-20">
          <div className="w-full max-w-[1400px] flex flex-col gap-8">
            {/* Header Section */}
            <div className="flex flex-wrap justify-between items-end gap-4">
              <div>
                <p className="text-text-muted text-sm font-medium tracking-widest uppercase mb-1">Overview</p>
                <h1 className="text-white text-4xl lg:text-5xl font-light tracking-tight">{greeting}, {firstName}.</h1>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-muted font-mono bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                  {focusBlocksRemaining} Focus Block{focusBlocksRemaining !== 1 ? 's' : ''} remaining
                </span>
              </div>
            </div>
            
            {/* Widgets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
              {/* Focus Timer - spans 2 columns on xl */}
              <FocusTimer />
              
              {/* Weather Card */}
              <WeatherCard />
              
              {/* Up Next Card */}
              <UpNextCard />
              
              {/* Productivity Chart - spans 3 columns on xl */}
              <ProductivityChart />
              
              {/* Habits Widget */}
              <HabitsWidget />
            </div>
          </div>
          
          {/* Mobile Command Input */}
          <div className="w-full max-w-md mt-10 md:hidden pb-10">
            <div className="pointer-events-auto flex items-center gap-3 bg-[#0a0a0a] border border-white/10 rounded-full p-1.5 pl-4 shadow-2xl shadow-black/80 hover:scale-[1.02] hover:border-primary/50 transition-all duration-300 group">
              <span className="material-symbols-outlined text-text-muted text-[18px] group-hover:text-primary transition-colors">terminal</span>
              <input 
                className="bg-transparent border-none text-white placeholder-text-muted focus:ring-0 w-full font-mono text-xs h-full py-2" 
                placeholder="Ask Habitual..." 
                type="text"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
