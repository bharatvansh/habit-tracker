"use client"

import { useHabitStore } from "@/store/habit-store"
import { calculateCompletionRate, getLongestStreak, getTodayProgress, getHabitsByCategory } from "@/lib/habit-utils"

export default function HabitSummary() {
  const { habits, categories } = useHabitStore()

  // Calculate completion rate using the utility function
  const completionRate = calculateCompletionRate(habits, "month")

  // Get longest streak using the utility function
  const longestStreak = getLongestStreak(habits)

  // Get today's progress using the utility function
  const todayProgress = getTodayProgress(habits)

  // Get habits by category using the utility function
  const habitsByCategory = getHabitsByCategory(habits, categories)

  return (
    <div className="dashboard-section" id="habitSummarySection">
      <div className="section-header">
        <h2 className="section-title">Habit Summary</h2>
        <span className="section-subtitle">Last 30 days</span>
      </div>
      <div className="habit-summary">
        {/* Summary Card 1: Completion Rate */}
        <div className="summary-card">
          <div className="summary-header">
            <span className="summary-title">COMPLETION RATE</span>
            <div className="summary-icon">
              <i className="fa-solid fa-bullseye"></i>
            </div>
          </div>
          <div className="summary-value" id="completionRateValue">
            {completionRate}%
          </div>
          <div className="summary-subtitle">
            <span className={habits.length > 0 ? "positive" : ""}>
              {habits.length > 0 ? "↑ Based on your activity" : "No previous data"}
            </span>
          </div>
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{
                width: `${completionRate}%`,
                backgroundColor: "var(--accent-primary)",
              }}
            ></div>
          </div>
        </div>

        {/* Summary Card 2: Total Habits */}
        <div className="summary-card">
          <div className="summary-header">
            <span className="summary-title">TOTAL HABITS</span>
            <div className="summary-icon">
              <i className="fa-solid fa-list"></i>
            </div>
          </div>
          <div className="summary-value" id="totalHabitsValue">
            {habits.length}
          </div>
          <div className="summary-subtitle">
            <span id="activeTodayInfo">{todayProgress.total} active today</span>
          </div>
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{
                width: habits.length > 0 ? `${(todayProgress.total / habits.length) * 100}%` : "0%",
                backgroundColor: "var(--warning)",
              }}
            ></div>
          </div>
        </div>

        {/* Summary Card 3: Longest Streak */}
        <div className="summary-card">
          <div className="summary-header">
            <span className="summary-title">LONGEST STREAK</span>
            <div className="summary-icon">
              <i className="fa-solid fa-arrow-trend-up"></i>
            </div>
          </div>
          <div className="summary-value" id="longestStreakValue">
            {longestStreak.days} days
          </div>
          <div className="summary-subtitle">
            <span id="longestStreakHabit">{longestStreak.name}</span>
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
                strokeDashoffset={220 - (220 * Math.min(longestStreak.days, 30)) / 30}
              ></circle>
            </svg>
            <div className="progress-text" id="streakProgressText">
              {Math.min(Math.round((longestStreak.days / 30) * 100), 100)}%
            </div>
          </div>
        </div>

        {/* Summary Card 4: Today's Progress */}
        <div className="summary-card">
          <div className="summary-header">
            <span className="summary-title">TODAY'S PROGRESS</span>
            <div className="summary-icon">
              <i className="fa-solid fa-bolt"></i>
            </div>
          </div>
          <div className="summary-value" id="todayProgressValue">
            {todayProgress.completed}/{todayProgress.total}
          </div>
          <div className="summary-subtitle">
            <span>Habits completed</span>
          </div>
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{
                width: todayProgress.total > 0 ? `${(todayProgress.completed / todayProgress.total) * 100}%` : "0%",
                backgroundColor: "var(--success)",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
