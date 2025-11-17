import { Habit } from "../store/habit-store"

export function analyzeOptimalTime(habit: Habit): string {
  if (!habit.completionHistory || habit.completionHistory.length < 3) {
    return "Not enough data yet"
  }

  // Group completions by hour
  const hourCounts: Record<number, number> = {}

  habit.completionHistory.forEach((completion) => {
    const hour = new Date(completion.time).getHours()
    hourCounts[hour] = (hourCounts[hour] || 0) + 1
  })

  // Find the hour with most completions
  const bestHourEntry = Object.entries(hourCounts).sort(([, a], [, b]) => b - a)[0]

  if (bestHourEntry) {
    const hour = Number(bestHourEntry[0])
    return `You usually complete this at ${formatHour(hour)}`
  }

  return "Not enough data yet"
}

function formatHour(hour: number): string {
  const ampm = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 || 12
  return `${displayHour}:00 ${ampm}`
}
