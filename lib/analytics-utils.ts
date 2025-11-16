"use client"

export function generateHeatmap() {
  const heatmap = document.querySelector("#analytics-dashboard .heatmap")
  if (!heatmap) return

  // Get habits from local storage if available
  let habits = []
  try {
    const habitsData = localStorage.getItem("habits")
    if (habitsData) {
      habits = JSON.parse(habitsData)
    }
  } catch (e) {
    console.error("Error loading habits for heatmap:", e)
  }

  // Define colors based on activity intensity
  const colors = [
    "rgba(255, 255, 255, 0.05)", // No activity
    "rgba(138, 43, 226, 0.2)", // Very low
    "rgba(138, 43, 226, 0.4)", // Low
    "rgba(138, 43, 226, 0.6)", // Medium
    "rgba(138, 43, 226, 0.8)", // High
    "rgba(138, 43, 226, 1)", // Very high
  ]

  try {
    // Safely clear existing cells
    heatmap.innerHTML = ""

    // Generate cells for the last 35 days (5 weeks)
    const today = new Date()

    for (let i = 34; i >= 0; i--) {
      const cellDate = new Date(today)
      cellDate.setDate(today.getDate() - i)
      const dateStr = cellDate.toISOString().split("T")[0]
      const dayOfWeek = cellDate.toLocaleDateString("en-US", { weekday: "long" })

      const cell = document.createElement("div")
      cell.className = "heatmap-cell"
      cell.title = `${dayOfWeek}, ${cellDate.toLocaleDateString()}`

      // Calculate activity intensity based on actual habit completions
      let intensity = 0

      if (habits.length > 0) {
        // Count habits scheduled for this day
        const habitsForDay = habits.filter((h) => h.days && h.days.includes(dayOfWeek))
        const totalHabitsForDay = habitsForDay.length || habits.length

        // Count completed habits for this day
        const completedHabits = habits.filter((h) => h.lastCompletedDate === dateStr).length

        // Calculate intensity based on completion percentage
        if (totalHabitsForDay > 0) {
          const completionRate = completedHabits / totalHabitsForDay
          intensity = Math.min(5, Math.floor(completionRate * 6))
        }
      }

      cell.style.backgroundColor = colors[intensity]
      heatmap.appendChild(cell)
    }

    // Make tag pills interactive
    const tagPills = document.querySelectorAll("#analytics-dashboard .tag-pill")
    tagPills.forEach((pill) => {
      pill.addEventListener("click", () => {
        const siblings = Array.from(pill.parentElement?.children || [])
        siblings.forEach((sib) => sib.classList.remove("active"))
        pill.classList.add("active")
      })
    })
  } catch (error) {
    console.error("Error generating heatmap:", error)
    if (heatmap) {
      heatmap.innerHTML = `
        <div style="color: var(--text-secondary); padding: 1rem; text-align: center;">
          Error loading heatmap. Please refresh the page.
        </div>
      `
    }
  }
}
