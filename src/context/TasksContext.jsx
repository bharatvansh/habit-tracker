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

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    try {
      const stored = localStorage.getItem(TASKS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load tasks from localStorage:', error);
    }
    return defaultTasks;
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
    const newTask = {
      ...task,
      id: Date.now().toString(),
      status: 'todo',
      subtasks: task.subtasks || [],
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const updateTask = (taskId, updates) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
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
    .filter((t) => t.dueTime)
    .sort((a, b) => {
      if (a.dueTime && b.dueTime) {
        return a.dueTime.localeCompare(b.dueTime);
      }
      return 0;
    })[0] || todoTasks[0] || null;

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
