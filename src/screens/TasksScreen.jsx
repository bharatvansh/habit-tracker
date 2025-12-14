import React, { useMemo, useState } from 'react';
import { useTasks, useTimer } from '../context';
import DesktopSidebar from '../components/navigation/DesktopSidebar';
import SimpleHeader from '../components/shared/SimpleHeader';

export default function TasksScreen() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  });

  const days = useMemo(() => {
    const base = new Date();
    const start = new Date(base.getFullYear(), base.getMonth(), base.getDate());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return {
        key: d.toISOString(),
        date: d.getDate(),
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: d,
      };
    });
  }, []);

  const dateString = selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

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
                <h2 className="text-text-muted text-xs font-medium uppercase tracking-widest">{dateString}</h2>
                <h1 className="text-2xl font-semibold text-white tracking-tight">Task Manager</h1>
              </div>
              {/* Day Selector */}
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {days.map((dayItem) => (
                  <button
                      key={dayItem.key}
                      onClick={() => setSelectedDate(dayItem.fullDate)}
                    className={`flex flex-col items-center justify-center w-10 h-14 rounded-lg shrink-0 transition-colors ${
                        isSameDay(dayItem.fullDate, selectedDate)
                        ? 'bg-primary text-white shadow-neon'
                        : 'text-text-muted hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className={`text-[10px] font-medium ${isSameDay(dayItem.fullDate, selectedDate) ? 'opacity-80' : ''}`}>
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
                <TaskBoard selectedDate={selectedDate} />
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
  const { activeTask, completeTask } = useTasks();
  const { 
    formattedTime, 
    isRunning, 
    isPaused, 
    progress,
    startTimer, 
    pauseTimer, 
    resumeTimer, 
    stopTimer 
  } = useTimer();

  const task = activeTask;

  const handlePauseResume = () => {
    if (isRunning) {
      pauseTimer();
    } else if (isPaused) {
      resumeTimer();
    } else if (task) {
      startTimer(task.title, 45);
    }
  };

  const handleComplete = () => {
    if (task) {
      completeTask(task.id);
      stopTimer();
    }
  };

  if (!task) {
    return (
      <div className="min-panel rounded-xl p-8 relative overflow-hidden group hover:border-primary/50 transition-all duration-300">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <span className="material-symbols-outlined text-4xl text-text-muted mb-4">task_alt</span>
          <h2 className="text-xl font-medium text-white mb-2">No Active Task</h2>
          <p className="text-text-muted text-sm">Start a task from your board to begin focusing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-panel rounded-xl p-8 relative overflow-hidden group hover:border-primary/50 transition-all duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-primary animate-pulse' : isPaused ? 'bg-yellow-500' : 'bg-white/30'}`}></span>
            <span className={`text-xs font-bold uppercase tracking-widest ${isRunning ? 'text-primary' : isPaused ? 'text-yellow-500' : 'text-text-muted'}`}>
              {isRunning ? 'Active Focus' : isPaused ? 'Paused' : 'Ready to Focus'}
            </span>
          </div>
          <h2 className="text-2xl font-medium text-white leading-tight">{task.title}</h2>
        </div>
        <div className="mt-4 md:mt-0">
          <span className={`inline-flex items-center px-2 py-1 rounded border text-[10px] uppercase font-bold tracking-wider ${
            task.priority === 'high' 
              ? 'border-red-500/20 bg-red-500/10 text-red-400' 
              : 'border-white/10 bg-white/5 text-text-muted'
          }`}>
            {task.priority || 'Normal'} Priority
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-mono font-light text-white tracking-tighter">
              {formattedTime.minutes}:{formattedTime.seconds}
            </span>
            <span className="text-text-muted text-xs uppercase tracking-wider">
              {isRunning ? 'remaining' : isPaused ? 'paused' : 'ready'}
            </span>
          </div>
          <div className="h-[2px] w-full bg-[#27272a] mt-2">
            <div 
              className="h-full bg-primary shadow-[0_0_10px_rgba(124,58,237,0.5)] transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="flex flex-col gap-3 justify-center">
          <button 
            onClick={handlePauseResume}
            className={`w-full py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              isRunning 
                ? 'bg-white text-black hover:bg-gray-200' 
                : 'bg-primary text-white hover:bg-primary/80'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isRunning ? 'pause' : 'play_arrow'}
            </span>
            {isRunning ? 'Pause' : isPaused ? 'Resume' : 'Start Focus'}
          </button>
          {(isRunning || isPaused) && (
            <button 
              onClick={handleComplete}
              className="w-full py-3 border border-green-500/30 text-green-400 hover:bg-green-500/10 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">check</span>
              Complete Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Task Board Component
function TaskBoard({ selectedDate }) {
  const { tasks, addTask, startTask, deleteTask } = useTasks();
  const [isAddMode, setIsAddMode] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskLabel, setNewTaskLabel] = useState('DEV');
  const [newTaskTime, setNewTaskTime] = useState('');

  const tasksForDay = useMemo(() => {
    return tasks.filter((t) => {
      const ms = new Date(t.dueAt).getTime();
      if (!Number.isFinite(ms)) return false;
      return isSameDay(new Date(ms), selectedDate);
    });
  }, [selectedDate, tasks]);

  const todoTasks = tasksForDay.filter((t) => t.status === 'todo');
  const inProgressTasks = tasksForDay.filter((t) => t.status === 'in-progress');
  const doneTasks = tasksForDay.filter((t) => t.status === 'done');

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      const due = new Date(selectedDate);
      if (newTaskTime && newTaskTime.includes(':')) {
        const [hh, mm] = newTaskTime.split(':').map((v) => Number(v));
        due.setHours(Number.isFinite(hh) ? hh : 9, Number.isFinite(mm) ? mm : 0, 0, 0);
      } else {
        due.setHours(9, 0, 0, 0);
      }

      addTask({
        title: newTaskTitle.trim(),
        label: newTaskLabel,
        dueAt: due.toISOString(),
        dueDate: isSameDay(selectedDate, new Date()) ? 'Today' : selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        dueTime: newTaskTime || undefined,
        priority: 'medium',
      });
      setNewTaskTitle('');
      setNewTaskTime('');
      setIsAddMode(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-white">Board</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsAddMode(!isAddMode)}
            className="p-2 hover:bg-white/5 rounded-lg text-text-muted hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">{isAddMode ? 'close' : 'add'}</span>
          </button>
          <button className="p-2 hover:bg-white/5 rounded-lg text-text-muted hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>
        </div>
      </div>

      {/* Add Task Form */}
      {isAddMode && (
        <form onSubmit={handleAddTask} className="flex flex-col gap-3 p-4 bg-white/5 rounded-lg">
          <input
            type="text"
            placeholder="Task title..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="bg-transparent border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-primary focus:outline-none"
            autoFocus
          />
          <div className="flex gap-2">
            <select
              value={newTaskLabel}
              onChange={(e) => setNewTaskLabel(e.target.value)}
              className="bg-black border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-primary focus:outline-none"
            >
              <option value="DEV">DEV</option>
              <option value="DESIGN">DESIGN</option>
              <option value="MEETING">MEETING</option>
              <option value="PERSONAL">PERSONAL</option>
            </select>
            <input
              type="time"
              value={newTaskTime}
              onChange={(e) => setNewTaskTime(e.target.value)}
              className="bg-black border border-white/10 rounded px-3 py-2 text-white text-sm focus:border-primary focus:outline-none w-28"
              aria-label="Due time"
            />
            <button
              type="submit"
              className="flex-1 bg-primary text-white text-sm font-medium py-2 px-4 rounded hover:bg-primary/80 transition-colors"
            >
              Add Task
            </button>
          </div>
        </form>
      )}

      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* To Do Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-1 rounded-full bg-white"></div>
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">To Do ({todoTasks.length})</h3>
          </div>
          {todoTasks.length === 0 ? (
            <p className="text-text-muted text-xs text-center py-4">No tasks to do</p>
          ) : (
            todoTasks.map((task) => (
              <TaskCard key={task.id} task={task} onStart={startTask} onDelete={deleteTask} />
            ))
          )}
        </div>

        {/* In Progress Section */}
        {inProgressTasks.length > 0 && (
          <div className="flex flex-col gap-3 mt-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-1 rounded-full bg-primary"></div>
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">In Progress ({inProgressTasks.length})</h3>
            </div>
            {inProgressTasks.map((task) => (
              <TaskCard key={task.id} task={task} isActive onDelete={deleteTask} />
            ))}
          </div>
        )}

        {/* Done Section */}
        {doneTasks.length > 0 && (
          <div className="flex flex-col gap-3 mt-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-1 rounded-full bg-green-500"></div>
              <h3 className="text-xs font-bold text-green-500 uppercase tracking-wider">Done ({doneTasks.length})</h3>
            </div>
            {doneTasks.slice(0, 3).map((task) => (
              <TaskCard key={task.id} task={task} isDone onDelete={deleteTask} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

// Task Card Component
function TaskCard({ task, isActive, isDone, onStart, onDelete }) {
  return (
    <div className={`min-panel p-4 rounded-lg group transition-all duration-300 cursor-pointer ${
      isActive ? 'border-primary/50 bg-primary/5' : isDone ? 'opacity-60' : 'hover:border-primary/50'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <span className={`px-2 py-1 rounded text-[10px] font-bold border ${
          isActive 
            ? 'bg-primary/20 text-primary border-primary/30'
            : isDone
            ? 'bg-green-500/10 text-green-400 border-green-500/20'
            : 'bg-primary/10 text-primary border-primary/20'
        }`}>
          {task.label}
        </span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isActive && !isDone && onStart && (
            <button 
              onClick={() => onStart(task.id)}
              className="p-1 hover:bg-primary/20 rounded text-primary"
            >
              <span className="material-symbols-outlined text-[16px]">play_arrow</span>
            </button>
          )}
          <button 
            onClick={() => onDelete(task.id)}
            className="p-1 hover:bg-red-500/20 rounded text-red-400"
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
          </button>
        </div>
      </div>
      <p className={`text-sm font-medium mb-3 transition-colors ${
        isDone ? 'text-text-muted line-through' : 'text-white group-hover:text-primary-hover'
      }`}>
        {task.title}
      </p>
      <div className="flex items-center gap-4 text-xs text-text-muted">
        <span className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[14px]">calendar_today</span>
          {task.dueDate}
        </span>
        {task.subtasks && task.subtasks.length > 0 && (
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">checklist</span>
            {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
          </span>
        )}
      </div>
    </div>
  );
}
