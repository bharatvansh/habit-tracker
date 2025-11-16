"use client"

export default function ReminderHeader({ onAddReminder }: { onAddReminder: () => void }) {
  return (
    <div className="header">
      <h1 className="page-title">Reminders</h1>
      <div className="header-actions">
        <button className="btn btn-outline">
          <i className="fa-solid fa-filter"></i>
          <span>Filter</span>
        </button>
        <button className="btn btn-primary" onClick={onAddReminder}>
          <i className="fa-solid fa-plus"></i>
          <span>Add Reminder</span>
        </button>
      </div>
    </div>
  )
}
