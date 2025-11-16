"use client"

import { useEffect, useState } from "react"
import { useHabitStore } from "@/store/habit-store"
import { calculateCompletionRate, getTodayProgress } from "@/lib/habit-utils"

export default function StatCards() {
  const { habits } = useHabitStore()
  const [todayProgress, setTodayProgress] = useState({ percentage: 0, completed: 0, total: 0 })
  const [weeklyProgress, setWeeklyProgress] = useState({ percentage: 0, completed: 0, total: 0 })
  const [streakProgress, setStreakProgress] = useState({ percentage: 0, avgStreak: 0 })

  useEffect(() => {
    // Calculate today's progress using the utility function
    const todayProgressData = getTodayProgress(habits)
    const todayPercentage = calculateCompletionRate(habits, "today")
    setTodayProgress({
      percentage: todayPercentage,
      completed: todayProgressData.completed,
      total: todayProgressData.total,
    })

    // Calculate weekly progress
    const weeklyPercentage = calculateCompletionRate(habits, "week")
    const weeklyTotal = habits.reduce((sum, habit) => sum + (habit.days?.length || 7), 0)
    const weeklyCompleted = habits.reduce((sum, habit) => sum + (habit.weeklyCompleted || 0), 0)
    setWeeklyProgress({
      percentage: weeklyPercentage,
      completed: weeklyCompleted,
      total: weeklyTotal,
    })

    // Calculate streak progress
    const calculateStreakProgress = () => {
      if (!habits || habits.length === 0) return { percentage: 0, avgStreak: 0 }

      const totalStreak = habits.reduce((sum, habit) => sum + (habit.streak || 0), 0)
      const avgStreak = Math.round(totalStreak / habits.length)
      const percentage = Math.min(100, Math.round((avgStreak / 30) * 100))

      return { percentage, avgStreak }
    }

    setStreakProgress(calculateStreakProgress())
  }, [habits])

  return (
    <div className="grid-container">
      {/* Today's Habits Stat Card */}
      <div className="card stat-card">
        <div className="progress-container">
          <svg className="progress-circle" viewBox="0 0 36 36">
            <path
              className="progress-circle-bg"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="progress-circle-value"
              stroke="var(--purple-primary)"
              strokeDasharray={`${todayProgress.percentage}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="progress-text">{todayProgress.percentage}%</div>
        </div>
        <div className="stat-value">
          {todayProgress.completed}/{todayProgress.total}
        </div>
        <div className="stat-label">Today's Habits</div>
      </div>

      {/* Weekly Completion Stat Card */}
      <div className="card stat-card">
        <div className="progress-container">
          <svg className="progress-circle" viewBox="0 0 36 36">
            <path
              className="progress-circle-bg"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="progress-circle-value"
              stroke="var(--success)"
              strokeDasharray={`${weeklyProgress.percentage}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="progress-text">{weeklyProgress.percentage}%</div>
        </div>
        <div className="stat-value">
          {weeklyProgress.completed}/{weeklyProgress.total}
        </div>
        <div className="stat-label">Weekly Completion</div>
      </div>

      {/* Current Streak Stat Card */}
      <div className="card stat-card">
        <div className="progress-container">
          <svg className="progress-circle" viewBox="0 0 36 36">
            <path
              className="progress-circle-bg"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="progress-circle-value"
              stroke="var(--info)"
              strokeDasharray={`${streakProgress.percentage}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="progress-text">{streakProgress.percentage}%</div>
        </div>
        <div className="stat-value">{streakProgress.avgStreak}</div>
        <div className="stat-label">Current Streak (Days)</div>
      </div>
    </div>
  )
}
