import React from 'react';
import DesktopSidebar from '../components/navigation/DesktopSidebar';
import SimpleHeader from '../components/shared/SimpleHeader';

export default function TasksScreen() {
  // Sample day selector data
  const days = [
    { date: 14, day: 'Thu', isActive: true },
    { date: 15, day: 'Fri', isActive: false },
  ];

  return (
    <div className="flex h-full w-full bg-background-dark">
      <DesktopSidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <SimpleHeader title="Task Manager" />
        <main className="flex-1 flex flex-col relative overflow-hidden bg-black h-full">
          <div className="relative z-10 flex flex-col h-full overflow-y-auto overflow-x-hidden pb-20">
            {/* Header with date and day selector */}
            <header className="flex flex-col md:flex-row md:items-end justify-between px-8 py-8 gap-6 border-b border-[#27272a]/50">
              <div className="flex flex-col gap-1">
                <h2 className="text-text-muted text-xs font-medium uppercase tracking-widest">Thursday, Nov 14</h2>
                <h1 className="text-2xl font-semibold text-white tracking-tight">Task Manager</h1>
              </div>
              {/* Day Selector */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {days.map((dayItem) => (
                  <button
                    key={dayItem.date}
                    className={`flex flex-col items-center justify-center w-10 h-14 rounded-lg shrink-0 transition-colors ${
                      dayItem.isActive
                        ? 'bg-primary text-white shadow-neon'
                        : 'text-text-muted hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className={`text-[10px] font-medium ${dayItem.isActive ? 'opacity-80' : ''}`}>
                      {dayItem.date}
                    </span>
                    <span className="text-xs font-bold">{dayItem.day}</span>
                  </button>
                ))}
              </div>
            </header>

            {/* Main Content Grid */}
            <div className="flex-1 px-8 py-8 grid grid-cols-1 xl:grid-cols-12 gap-8">
              {/* Left Column - Active Focus */}
              <div className="xl:col-span-7 flex flex-col gap-6">
                <ActiveFocusCard />
              </div>

              {/* Right Column - Task Board */}
              <div className="xl:col-span-5 flex flex-col gap-6 h-full">
                <TaskBoard />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Active Focus Card Component
function ActiveFocusCard() {
  return (
    <div className="min-panel rounded-xl p-8 relative overflow-hidden group hover:border-primary/50 transition-all duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            <span className="text-primary text-xs font-bold uppercase tracking-widest">Active Focus</span>
          </div>
          <h2 className="text-2xl font-medium text-white leading-tight">Project Alpha Interface</h2>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="inline-flex items-center px-2 py-1 rounded border border-white/10 bg-white/5 text-[10px] uppercase font-bold text-text-muted tracking-wider">
            High Priority
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-mono font-light text-white tracking-tighter">00:45</span>
            <span className="text-text-muted text-xs uppercase tracking-wider">remaining</span>
          </div>
          <div className="h-[2px] w-full bg-[#27272a] mt-2">
            <div className="h-full bg-primary w-[65%] shadow-[0_0_10px_rgba(124,58,237,0.5)]"></div>
          </div>
        </div>
        <div className="flex flex-col gap-3 justify-center">
          <button className="w-full py-3 bg-white text-black hover:bg-gray-200 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">pause</span>
            Pause
          </button>
        </div>
      </div>
    </div>
  );
}

// Task Board Component
function TaskBoard() {
  const tasks = [
    {
      id: 1,
      label: 'DEV',
      title: 'Review Pull Requests',
      dueDate: 'Tomorrow',
      subtasks: { completed: 0, total: 2 },
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-white">Board</h2>
        <button className="p-2 hover:bg-white/5 rounded-lg text-text-muted hover:text-white transition-colors">
          <span className="material-symbols-outlined text-[20px]">tune</span>
        </button>
      </div>
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-1 rounded-full bg-white"></div>
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">To Do ({tasks.length})</h3>
          </div>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </>
  );
}

// Task Card Component
function TaskCard({ task }) {
  return (
    <div className="min-panel p-4 rounded-lg group hover:border-primary/50 transition-all duration-300 cursor-pointer">
      <div className="flex justify-between items-start mb-3">
        <span className="px-2 py-1 rounded text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
          {task.label}
        </span>
      </div>
      <p className="text-white text-sm font-medium mb-3 group-hover:text-primary-hover transition-colors">
        {task.title}
      </p>
      <div className="flex items-center gap-4 text-xs text-text-muted">
        <span className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[14px]">calendar_today</span>
          {task.dueDate}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[14px]">checklist</span>
          {task.subtasks.completed}/{task.subtasks.total}
        </span>
      </div>
    </div>
  );
}
