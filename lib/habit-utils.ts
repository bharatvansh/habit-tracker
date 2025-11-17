"use client"

import type { Habit } from "../store/habit-store"

/**
 * Calculate completion rate for habits based on different timeframes
 * @param habits Array of habits
 * @param timeframe The timeframe to calculate for ('today', 'week', or 'month')
 * @returns Completion rate as a percentage
 */
export function calculateCompletionRate(habits: Habit[], timeframe: "today" | "week" | "month" = "today"): number {
  if (!habits || habits.length === 0) return 0

  const today = new Date()
  const todayStr = today.toISOString().split("T")[0]

  if (timeframe === "today") {
    const todayDayName = today.toLocaleDateString("en-US", { weekday: "long" })
    const scheduledToday = habits.filter((h) => h.days && h.days.includes(todayDayName))
    const totalToday = scheduledToday.length || habits.length
    const completedToday = habits.filter((h) => h.lastCompletedDate === todayStr).length

    return Math.round((completedToday / totalToday) * 100) || 0
  }

  if (timeframe === "week") {
    // Calculate for the current week
    const totalWeeklyPossible = habits.reduce((sum, habit) => sum + (habit.days?.length || 7), 0)
    const totalWeeklyCompleted = habits.reduce((sum, habit) => sum + (habit.weeklyCompleted || 0), 0)

    return totalWeeklyPossible > 0 ? Math.round((totalWeeklyCompleted / totalWeeklyPossible) * 100) : 0
  }

  // For month, we need a more accurate calculation
  // This calculates based on total completions vs expected completions in a month
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  let totalPossibleCompletions = 0
  let totalActualCompletions = 0

  habits.forEach((habit) => {
    // Calculate how many times this habit should be completed in a month
    const daysPerWeek = habit.days?.length || 7
    const expectedCompletionsPerMonth = Math.round((daysPerWeek / 7) * daysInMonth)
    totalPossibleCompletions += expectedCompletionsPerMonth

    // Use actual completions or estimate based on streak and completion rate
    totalActualCompletions += habit.completed || 0
  })

  return totalPossibleCompletions > 0
    ? Math.min(100, Math.round((totalActualCompletions / totalPossibleCompletions) * 100))
    : 0
}

/**
 * Calculate the longest streak among all habits
 * @param habits Array of habits
 * @returns Object containing the longest streak days and habit name
 */
export function getLongestStreak(habits: Habit[]): { days: number; name: string } {
  if (!habits || habits.length === 0) return { days: 0, name: "None" }

  const habitWithLongestStreak = habits.reduce(
    (max, habit) => ((habit.streak || 0) > (max.streak || 0) ? habit : max),
    { name: "None", streak: 0 } as Habit,
  )

  return {
    days: habitWithLongestStreak.streak || 0,
    name: habitWithLongestStreak.name,
  }
}

/**
 * Calculate today's progress for habits
 * @param habits Array of habits
 * @returns Object containing completed and total habits for today
 */
export function getTodayProgress(habits: Habit[]): { completed: number; total: number } {
  if (!habits || habits.length === 0) return { completed: 0, total: 0 }

  const today = new Date()
  const todayStr = today.toISOString().split("T")[0]
  const todayDayName = today.toLocaleDateString("en-US", { weekday: "long" })

  const todayHabits = habits.filter((h) => h.days && h.days.includes(todayDayName))
  const completedToday = habits.filter((h) => h.lastCompletedDate === todayStr).length

  return {
    completed: completedToday,
    total: todayHabits.length || habits.length,
  }
}

/**
 * Check if a habit was completed on a specific date
 * @param habit The habit to check
 * @param dateStr Date string in ISO format (YYYY-MM-DD)
 * @returns Boolean indicating if the habit was completed on that date
 */
export function wasHabitCompletedOnDate(habit: Habit, dateStr: string): boolean {
  return habit.lastCompletedDate === dateStr
}

/**
 * Get habits grouped by category
 * @param habits Array of habits
 * @param categories Array of category names
 * @returns Object with category names as keys and habit counts as values
 */
export function getHabitsByCategory(habits: Habit[], categories: string[]): Record<string, number> {
  const result: Record<string, number> = {}

  categories.forEach((category) => {
    result[category] = habits.filter((h) => h.category === category).length
  })

  return result
}

/**
 * Calculate weekly activity percentages for each day of the week
 * @param habits Array of habits
 * @param activeFilter Category filter (or "All Habits" for all)
 * @returns Array of percentages for each day of the week
 */
export function calculateWeeklyActivity(habits: Habit[], activeFilter: string): number[] {
  if (!habits || habits.length === 0) return Array(7).fill(0)

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const activityPercentages = daysOfWeek.map((day) => {
    const fullDay =
      day === "Sun"
        ? "Sunday"
        : day === "Mon"
          ? "Monday"
          : day === "Tue"
            ? "Tuesday"
            : day === "Wed"
              ? "Wednesday"
              : day === "Thu"
                ? "Thursday"
                : day === "Fri"
                  ? "Friday"
                  : "Saturday"

    // Filter habits by category if a specific category is selected
    const filteredHabits = activeFilter === "All Habits" ? habits : habits.filter((h) => h.category === activeFilter)

    const habitsForDay = filteredHabits.filter((h) => h.days && h.days.includes(fullDay))
    if (habitsForDay.length === 0) return 0

    const completedForDay = habitsForDay.filter((h) => h.completed > 0).length
    return Math.round((completedForDay / habitsForDay.length) * 100)
  })

  return activityPercentages
}
