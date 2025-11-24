"use client"

import type { Habit } from "@/store/habit-store"

declare global {
  interface Window {
    Chart: any
  }
}

export function initMonthlyTrendsChart(canvas: HTMLCanvasElement, habits: Habit[] = []) {
  if (typeof window === "undefined" || !window.Chart) return

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
  let data = []

  if (habits.length > 0) {
    // Calculate actual completion rates per month
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()

    data = months.map((month, index) => {
      const monthIndex = index
      const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate()

      // Count completions for this month
      let totalPossibleCompletions = 0
      let actualCompletions = 0

      habits.forEach((habit) => {
        // For each habit, count how many days it was scheduled in this month
        if (habit.days && habit.days.length > 0) {
          // Calculate expected completions based on habit frequency
          const daysPerWeek = habit.days.length
          const expectedCompletionsThisMonth = Math.round((daysPerWeek / 7) * daysInMonth)
          totalPossibleCompletions += expectedCompletionsThisMonth

          // Estimate actual completions based on habit's completion rate
          if (habit.completed > 0) {
            // Use a weighted estimate based on total completions and habit age
            const habitAgeInMonths = Math.max(1, index + 1) // Assume habit exists for at least the current month
            actualCompletions += ((habit.completed / habitAgeInMonths) * (monthIndex + 1)) / 9
          }
        }
      })

      return totalPossibleCompletions > 0
        ? Math.min(100, Math.round((actualCompletions / totalPossibleCompletions) * 100))
        : 0
    })
  } else {
    data = [0, 0, 0, 0, 0, 0, 0, 0, 0]
  }

  return new window.Chart(canvas.getContext("2d"), {
    type: "line",
    data: {
      labels: months,
      datasets: [
        {
          label: "Completion Rate",
          data: data,
          borderColor: "#8A2BE2",
          backgroundColor: "rgba(138, 43, 226, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: { color: "rgba(255, 255, 255, 0.05)" },
          ticks: {
            color: "#AAAAAA",
            callback: (value: any) => value + "%",
          },
        },
        x: {
          grid: { color: "rgba(255, 255, 255, 0.05)" },
          ticks: { color: "#AAAAAA" },
        },
      },
    },
  })
}

export function initCategoryChart(canvas: HTMLCanvasElement, habits: Habit[] = []) {
  if (typeof window === "undefined" || !window.Chart) return

  // Extract categories and count habits per category
  let categories: string[] = []
  let categoryData: number[] = []
  let completionData: number[] = []

  if (habits.length > 0) {
    const categoryMap = new Map<string, { count: number; completed: number }>()

    habits.forEach((habit) => {
      const category = habit.category || "Uncategorized"
      if (!categoryMap.has(category)) {
        categoryMap.set(category, { count: 0, completed: 0 })
      }

      const categoryStats = categoryMap.get(category)!
      categoryStats.count += 1
      categoryStats.completed += habit.completed || 0
    })

    // Convert map to arrays
    categories = Array.from(categoryMap.keys())
    categoryData = Array.from(categoryMap.values()).map((stats) => stats.count)
    completionData = Array.from(categoryMap.values()).map((stats) =>
      stats.count > 0 ? Math.round((stats.completed / (stats.count * 30)) * 100) : 0,
    )
  } else {
    // Default placeholder data
    categories = ["Health", "Work", "Learning", "Personal"]
    categoryData = [0, 0, 0, 0]
    completionData = [0, 0, 0, 0]
  }

  // Default colors
  const colors = ["#9d50ea", "#6a0dad", "#4CAF50", "#FFC107", "#F44336", "#2196F3"]

  return new window.Chart(canvas.getContext("2d"), {
    type: "doughnut",
    data: {
      labels: categories,
      datasets: [
        {
          data: categoryData,
          backgroundColor: colors.slice(0, categories.length),
          borderWidth: 0,
          hoverOffset: 10,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "75%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#AAAAAA",
            padding: 20,
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || ""
              const value = context.raw as number
              const completion = completionData[context.dataIndex]
              return `${label}: ${value} habits (${completion}% completion)`
            },
          },
        },
      },
    },
  })
}
