import { Habit } from "../store/habit-store"

export function getCategoryInsights(habits: Habit[], categories: string[]): string[] {
  const insights: string[] = []

  if (habits.length === 0 || categories.length === 0) {
    return insights
  }

  const categoryStats = categories
    .map((cat) => {
      const catHabits = habits.filter((h) => h.category === cat)
      if (catHabits.length === 0) return null

      const totalCompleted = catHabits.reduce((sum, h) => sum + h.completed, 0)
      const totalPossible = catHabits.reduce((sum, h) => {
        // Estimate based on days since creation
        const daysSinceCreation = Math.floor(
          (Date.now() - new Date(h.createdAt).getTime()) / (1000 * 60 * 60 * 24),
        )
        // Count scheduled days per week
        const scheduledDaysPerWeek = h.days.length
        const possibleCompletions = Math.ceil(
          (daysSinceCreation / 7) * scheduledDaysPerWeek,
        )
        return sum + possibleCompletions
      }, 0)

      const rate = totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0

      return { category: cat, rate, habitCount: catHabits.length }
    })
    .filter((stat) => stat !== null) as {
    category: string
    rate: number
    habitCount: number
  }[]

  if (categoryStats.length === 0) {
    return insights
  }

  categoryStats.sort((a, b) => b.rate - a.rate)

  // Best category insight
  const best = categoryStats[0]
  insights.push(
    `🏆 ${best.category} is your strongest category with ${best.rate.toFixed(0)}% completion rate`,
  )

  // Comparison insight
  if (categoryStats.length >= 2) {
    const worst = categoryStats[categoryStats.length - 1]
    const diff = best.rate - worst.rate

    if (diff > 10) {
      insights.push(
        `Your ${best.category} habits have ${diff.toFixed(0)}% higher completion than ${worst.category} habits`,
      )
    }
  }

  // Most habits insight
  const mostHabits = categoryStats.sort((a, b) => b.habitCount - a.habitCount)[0]
  if (mostHabits.habitCount > 1) {
    insights.push(`You focus most on ${mostHabits.category} with ${mostHabits.habitCount} habits`)
  }

  return insights
}
