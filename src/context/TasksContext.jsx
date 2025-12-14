import React, { createContext, useContext, useState, useEffect } from 'react';

const TASKS_STORAGE_KEY = 'habitual_tasks';

const defaultTasks = [
  {
    id: '1',
    title: 'Review Pull Requests',
    label: 'DEV',
    dueDate: 'Tomorrow',
    priority: 'high',
    status: 'todo', // 'todo', 'in-progress', 'done'
    subtasks: [
      { id: 's1', title: 'Frontend changes', completed: false },
      { id: 's2', title: 'API updates', completed: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Product Design Review',
    label: 'DESIGN',
    dueDate: 'Today',
    dueTime: '13:00',
    priority: 'medium',
    status: 'todo',
    subtasks: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Project Alpha Interface',
    label: 'DEV',
    dueDate: 'Today',
    priority: 'high',
    status: 'in-progress',
    subtasks: [],
    createdAt: new Date().toISOString(),
  },
];

const TasksContext = createContext(undefined);

function safeJsonParse(value, fallback) {
  try {
    if (!value) return fallback;
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function isIsoDateString(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function toDueAtISO({ dueAt, dueDate, dueTime }) {
  // Prefer explicit dueAt if valid
  if (typeof dueAt === 'string') {
    const ms = new Date(dueAt).getTime();
    if (Number.isFinite(ms)) return new Date(ms).toISOString();
  }

  const now = new Date();
  let base = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (typeof dueDate === 'string') {
    const lower = dueDate.toLowerCase();
    if (lower.includes('tomorrow')) {
      base.setDate(base.getDate() + 1);
    } else if (lower.includes('today')) {
      // keep
    } else if (isIsoDateString(dueDate)) {
      const [y, m, d] = dueDate.split('-').map((v) => Number(v));
      base = new Date(y, (m || 1) - 1, d || 1);
    } else {
      const parsed = new Date(dueDate);
      if (Number.isFinite(parsed.getTime())) {
        base = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
      }
    }
  }

  if (typeof dueTime === 'string' && dueTime.includes(':')) {
    const [hh, mm] = dueTime.split(':').map((v) => Number(v));
    base.setHours(Number.isFinite(hh) ? hh : 9, Number.isFinite(mm) ? mm : 0, 0, 0);
  } else {
    base.setHours(9, 0, 0, 0);
  }

  return base.toISOString();
}

function normalizeTask(task) {
  if (!task || typeof task !== 'object') return null;
  const id = typeof task.id === 'string' ? task.id : Date.now().toString();
  const title = typeof task.title === 'string' ? task.title : 'Untitled Task';
  const label = typeof task.label === 'string' ? task.label : 'TASK';
  const status = ['todo', 'in-progress', 'done'].includes(task.status) ? task.status : 'todo';
  const priority = typeof task.priority === 'string' ? task.priority : 'medium';
  const dueDate = typeof task.dueDate === 'string' ? task.dueDate : 'Today';
  const dueTime = typeof task.dueTime === 'string' ? task.dueTime : undefined;
  const dueAt = toDueAtISO({ dueAt: task.dueAt, dueDate, dueTime });
  const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
  const createdAt = typeof task.createdAt === 'string' ? task.createdAt : new Date().toISOString();
  const completedAt = typeof task.completedAt === 'string' ? task.completedAt : undefined;

  return {
    ...task,
    id,
    title,
    label,
    status,
    priority,
    dueDate,
    dueTime,
    dueAt,
    subtasks,
    createdAt,
    completedAt,
  };
}

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    const stored = safeJsonParse(localStorage.getItem(TASKS_STORAGE_KEY), null);
    const seed = Array.isArray(stored) ? stored : defaultTasks;
    return seed.map(normalizeTask).filter(Boolean);
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error);
    }
  }, [tasks]);

  const addTask = (task) => {
    const newTask = normalizeTask({
      ...task,
      id: Date.now().toString(),
      status: 'todo',
      subtasks: task.subtasks || [],
      createdAt: new Date().toISOString(),
      dueAt: task.dueAt,
      dueDate: task.dueDate || 'Today',
      dueTime: task.dueTime,
    });
    setTasks((prev) => [...prev, newTask].map(normalizeTask).filter(Boolean));
    return newTask;
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const updateTask = (taskId, updates) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? normalizeTask({ ...task, ...updates }) : task)).filter(Boolean)
    );
  };

  const completeTask = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: 'done', completedAt: new Date().toISOString() } : task
      )
    );
  };

  const startTask = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: 'in-progress' } : task
      )
    );
  };

  const toggleSubtask = (taskId, subtaskId) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: task.subtasks.map((st) =>
              st.id === subtaskId ? { ...st, completed: !st.completed } : st
            ),
          };
        }
        return task;
      })
    );
  };

  // Get tasks by status
  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress');
  const doneTasks = tasks.filter((t) => t.status === 'done');

  // Get the current active task (first in-progress task)
  const activeTask = inProgressTasks[0] || null;

  // Get the next upcoming task (first todo task with the earliest due date/time)
  const upNextTask = todoTasks
    .slice()
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())[0] || null;

  // Calculate focus blocks remaining (tasks not done)
  const focusBlocksRemaining = tasks.filter((t) => t.status !== 'done').length;

  const value = {
    tasks,
    todoTasks,
    inProgressTasks,
    doneTasks,
    activeTask,
    upNextTask,
    focusBlocksRemaining,
    addTask,
    deleteTask,
    updateTask,
    completeTask,
    startTask,
    toggleSubtask,
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
}
