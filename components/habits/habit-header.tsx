"use client"

export default function HabitHeader({ onAddHabit }: { onAddHabit: () => void }) {
  return (
    <div className="header">
      <h1 className="page-title">My Habits</h1>
      <div className="header-actions">
        <button className="btn btn-outline" id="filter-btn">
          <i className="fa-solid fa-filter"></i>
          <span>Filter</span>
        </button>
        <button className="btn btn-primary" onClick={onAddHabit}>
          <i className="fa-solid fa-plus"></i>
          <span>Add Habit</span>
        </button>
      </div>
    </div>
  )
}
