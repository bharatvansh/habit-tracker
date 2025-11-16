"use client"

import { useReminderStore } from "@/store/reminder-store"

export default function ReminderSummary() {
  const { reminders } = useReminderStore()

  // Calculate today's reminders
  const getTodayReminders = () => {
    if (!reminders || reminders.length === 0) return 0

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return reminders.filter((reminder) => {
      const reminderDate = new Date(reminder.datetime)
      reminderDate.setHours(0, 0, 0, 0)
      return reminderDate.getTime() === today.getTime()
    }).length
  }

  // Calculate upcoming reminders (next 7 days)
  const getUpcomingReminders = () => {
    if (!reminders || reminders.length === 0) return 0

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const nextWeek = new Date(today)
    nextWeek.setDate(today.getDate() + 7)

    return reminders.filter((reminder) => {
      const reminderDate = new Date(reminder.datetime)
      return reminderDate >= today && reminderDate <= nextWeek
    }).length
  }

  // Calculate completed reminders
  const getCompletedReminders = () => {
    // In a real app, you would track completed reminders
    // For now, we'll return a placeholder value
    return 0
  }

  // Calculate recurring reminders
  const getRecurringReminders = () => {
    // In a real app, you would track recurring reminders
    // For now, we'll return a placeholder value
    return 0
  }

  const todayReminders = getTodayReminders()
  const upcomingReminders = getUpcomingReminders()
  const completedReminders = getCompletedReminders()
  const recurringReminders = getRecurringReminders()

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2 className="section-title">Reminder Summary</h2>
        <span className="section-subtitle">Overview</span>
      </div>
      <div className="habit-summary">
        {/* Summary Card 1: Today's Reminders */}
        <div className="summary-card">
          <div className="summary-header">
            <span className="summary-title">TODAY'S REMINDERS</span>
            <div className="summary-icon">
              <i className="fa-solid fa-bell"></i>
            </div>
          </div>
          <div className="summary-value" id="todayRemindersValue">
            {todayReminders}
          </div>
          <div className="summary-subtitle">
            <span>Scheduled for today</span>
          </div>
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{
                width: upcomingReminders > 0 ? `${(todayReminders / upcomingReminders) * 100}%` : "0%",
                backgroundColor: "var(--purple-primary)",
              }}
            ></div>
          </div>
        </div>

        {/* Summary Card 2: Upcoming Reminders */}
        <div className="summary-card">
          <div className="summary-header">
            <span className="summary-title">UPCOMING</span>
            <div className="summary-icon">
              <i className="fa-solid fa-calendar-days"></i>
            </div>
          </div>
          <div className="summary-value" id="upcomingRemindersValue">
            {upcomingReminders}
          </div>
          <div className="summary-subtitle">
            <span>Next 7 days</span>
          </div>
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{
                width: reminders.length > 0 ? `${(upcomingReminders / reminders.length) * 100}%` : "0%",
                backgroundColor: "var(--warning)",
              }}
            ></div>
          </div>
        </div>

        {/* Summary Card 3: Completed Reminders */}
        <div className="summary-card">
          <div className="summary-header">
            <span className="summary-title">COMPLETED</span>
            <div className="summary-icon">
              <i className="fa-solid fa-check-circle"></i>
            </div>
          </div>
          <div className="summary-value" id="completedRemindersValue">
            {completedReminders}
          </div>
          <div className="summary-subtitle">
            <span>This week</span>
          </div>
          <div className="progress-circular">
            <svg width="70" height="70" viewBox="0 0 80 80">
              <circle className="progress-bg" cx="40" cy="40" r="35"></circle>
              <circle
                className="progress-value"
                cx="40"
                cy="40"
                r="35"
                strokeDasharray="220"
                strokeDashoffset="220"
              ></circle>
            </svg>
            <div className="progress-text" id="completionProgressText">
              0%
            </div>
          </div>
        </div>

        {/* Summary Card 4: Recurring Reminders */}
        <div className="summary-card">
          <div className="summary-header">
            <span className="summary-title">RECURRING</span>
            <div className="summary-icon">
              <i className="fa-solid fa-repeat"></i>
            </div>
          </div>
          <div className="summary-value" id="recurringRemindersValue">
            {recurringReminders}
          </div>
          <div className="summary-subtitle">
            <span>Active recurring reminders</span>
          </div>
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{
                width: "0%",
                backgroundColor: "var(--info)",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
