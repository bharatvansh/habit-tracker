"use client"

import { useHabitStore } from "@/store/habit-store"
import { calculateCompletionRate, getLongestStreak } from "@/lib/habit-utils"

export default function StatisticsGrid() {
  const { habits } = useHabitStore()
  
  // Calculate real statistics
  const completionRate = calculateCompletionRate(habits, "month")
  const longestStreak = getLongestStreak(habits)
  const totalCompletions = habits.reduce((sum, habit) => sum + (habit.completed || 0), 0)
  
  // Calculate change indicators (simplified for now)
  const completionChange = habits.length > 0 ? "Improving" : "No previous data"
  const habitsChange = habits.length > 0 ? `Active habits: ${habits.filter(h => h.days && h.days.length > 0).length}` : "No habits yet"
  const streakChange = longestStreak.name !== "None" ? `Best: ${longestStreak.name}` : "No streaks yet"
  const completionsChange = totalCompletions > 0 ? `This month: ${totalCompletions}` : "No completions yet"
  return (
    <div className="grid-container-4">
      <div className="card stat-card">
        <div>
          <div className="stat-label">Completion Rate</div>
          <div className="stat-value" id="analytics-completion-rate">
            {completionRate}%
          </div>
        </div>
        <div className="stat-change" id="analytics-completion-change">
          {completionChange}
        </div>
      </div>
      <div className="card stat-card">
        <div>
          <div className="stat-label">Habits Tracked</div>
          <div className="stat-value" id="analytics-habits-count">
            {habits.length}
          </div>
        </div>
        <div className="stat-change" id="analytics-habits-change">
          {habitsChange}
        </div>
      </div>
      <div className="card stat-card">
        <div>
          <div className="stat-label">Longest Streak</div>
          <div className="stat-value" id="analytics-longest-streak">
            {longestStreak.days} days
          </div>
        </div>
        <div className="stat-change" id="analytics-streak-habit">
          {streakChange}
        </div>
      </div>
      <div className="card stat-card">
        <div>
          <div className="stat-label">Total Completions</div>
          <div className="stat-value" id="analytics-total-completions">
            {totalCompletions}
          </div>
        </div>
        <div className="stat-change" id="analytics-completions-change">
          {completionsChange}
        </div>
      </div>
    </div>
  )
}
