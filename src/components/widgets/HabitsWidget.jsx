import React, { useState } from 'react';
import { useHabits } from '../../context';

// Calculate stroke-dashoffset for progress rings
// circumference = 2 * PI * r = 2 * 3.14159 * 18 ≈ 113
const CIRCUMFERENCE = 113;

function HabitItem({ habit, onIncrement }) {
  const progress = habit.current / habit.target;
  const offset = CIRCUMFERENCE * (1 - progress);
  const isComplete = habit.current >= habit.target;
  const colorClass = habit.color === 'primary' ? 'text-primary' : 'text-theme-primary';

  return (
    <div 
      className="flex items-center gap-4 group cursor-pointer"
      onClick={() => !isComplete && onIncrement(habit.id)}
    >
      <div className="relative size-10 flex items-center justify-center">
        <svg className="transform -rotate-90 size-10">
          {/* Background circle */}
          <circle 
            className="text-theme-subtle" 
            cx="20" 
            cy="20" 
            fill="transparent" 
            r="18" 
            stroke="currentColor" 
            strokeWidth="2"
            style={{ color: 'var(--border-subtle)' }}
          />
          {/* Progress circle */}
          <circle 
            className={`${colorClass} transition-all duration-500 ease-out`}
            cx="20" 
            cy="20" 
            fill="transparent" 
            r="18" 
            stroke="currentColor" 
            strokeDasharray={CIRCUMFERENCE} 
            strokeDashoffset={offset} 
            strokeLinecap="round" 
            strokeWidth="2"
          />
        </svg>
        <span className={`material-symbols-outlined absolute text-xs ${isComplete ? 'text-green-400' : 'text-theme-primary'}`}>
          {isComplete ? 'check' : habit.icon}
        </span>
      </div>
      <div className="flex flex-col flex-1">
        <span className={`text-theme-primary font-medium text-sm group-hover:${habit.color === 'primary' ? 'text-primary' : 'text-theme-primary'} transition-colors`}>
          {habit.name}
        </span>
        <span className="text-theme-muted text-[10px] font-mono">
          {habit.current}{habit.unit} / {habit.target}{habit.unit}
        </span>
      </div>
      {!isComplete && (
        <span className="text-theme-muted text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
          +{habit.increment}{habit.unit}
        </span>
      )}
    </div>
  );
}

function AddHabitForm({ onAdd, onCancel }) {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [unit, setUnit] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && target) {
      onAdd({
        name,
        target: parseFloat(target),
        unit: unit || 'x',
        icon: 'check_circle',
        color: 'primary',
        increment: Math.ceil(parseFloat(target) / 10) || 1,
      });
      setName('');
      setTarget('');
      setUnit('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-3 bg-[var(--hover-overlay)] rounded-lg">
      <input
        type="text"
        placeholder="Habit name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="bg-transparent border border-theme-primary rounded px-3 py-2 text-theme-primary text-sm focus:border-primary focus:outline-none"
        autoFocus
      />
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Target"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="bg-transparent border border-theme-primary rounded px-3 py-2 text-theme-primary text-sm focus:border-primary focus:outline-none flex-1"
        />
        <input
          type="text"
          placeholder="Unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="bg-transparent border border-theme-primary rounded px-3 py-2 text-theme-primary text-sm focus:border-primary focus:outline-none w-16"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-primary text-white text-xs font-medium py-2 rounded hover:bg-primary/80 transition-colors"
        >
          Add
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-[var(--hover-overlay)] text-theme-primary text-xs font-medium py-2 rounded hover:opacity-80 transition-colors border border-theme-primary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function HabitsWidget() {
  const { habits, incrementProgress, addHabit, resetDailyProgress } = useHabits();
  const [isAddMode, setIsAddMode] = useState(false);

  const handleAddHabit = (habit) => {
    addHabit(habit);
    setIsAddMode(false);
  };

  return (
    <div className="xl:col-span-1 rounded-3xl bg-theme-card border border-theme-subtle p-8 flex flex-col justify-between transition-colors duration-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-theme-primary text-lg font-light">Habits</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const ok = window.confirm('Archive today and reset all habit progress?');
              if (ok) resetDailyProgress();
            }}
            className="text-theme-muted hover:text-theme-primary transition-colors"
            aria-label="Archive today and reset habits"
            title="Archive today & reset"
          >
            <span className="material-symbols-outlined text-[20px]">restart_alt</span>
          </button>
          <button 
            type="button"
            onClick={() => setIsAddMode(!isAddMode)}
            className="text-theme-muted hover:text-theme-primary transition-colors"
            aria-label={isAddMode ? 'Close add habit form' : 'Add habit'}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isAddMode ? 'close' : 'add'}
            </span>
          </button>
        </div>
      </div>
      
      {/* Add Habit Form */}
      {isAddMode && (
        <div className="mb-4">
          <AddHabitForm 
            onAdd={handleAddHabit} 
            onCancel={() => setIsAddMode(false)} 
          />
        </div>
      )}
      
      {/* Habits List */}
      <div className="flex flex-col gap-6">
        {habits.length === 0 ? (
          <p className="text-theme-muted text-sm text-center py-4">
            No habits yet. Click + to add one!
          </p>
        ) : (
          habits.map((habit) => (
            <HabitItem 
              key={habit.id} 
              habit={habit} 
              onIncrement={incrementProgress}
            />
          ))
        )}
      </div>
    </div>
  );
}
