import { Habit } from "../store/habit-store"

export type TrendDirection = "up" | "down" | "stable"

export function getCompletionTrend(habit: Habit): TrendDirection {
  if (!habit.completionHistory || habit.completionHistory.length < 7) {
    return "stable"
  }

  // Get last 7 days and previous 7 days
  const today = new Date()
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    return date.toISOString().split("T")[0]
  })

  const previous7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today)
    date.setDate(date.getDate() - (i + 7))
    return date.toISOString().split("T")[0]
  })

  const last7Count = habit.completionHistory.filter((c) =>
    last7Days.includes(c.date),
  ).length

  const previous7Count = habit.completionHistory.filter((c) =>
    previous7Days.includes(c.date),
  ).length

  if (last7Count > previous7Count * 1.1) return "up"
  if (last7Count < previous7Count * 0.9) return "down"
  return "stable"
}

export function getTrendIcon(trend: TrendDirection): string {
  switch (trend) {
    case "up":
      return "📈"
    case "down":
      return "📉"
    case "stable":
      return "➡️"
  }
}

export function getTrendColor(trend: TrendDirection): string {
  switch (trend) {
    case "up":
      return "#4caf50"
    case "down":
      return "#f44336"
    case "stable":
      return "#b3b3b3"
  }
}
