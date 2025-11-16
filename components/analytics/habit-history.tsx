"use client"

import { useMemo, useState } from "react"
import { useHabitStore } from "@/store/habit-store"

export default function HabitHistory() {
  const { habits, categories } = useHabitStore()
  const [activeFilter, setActiveFilter] = useState("All")

  const cells = useMemo(() => {
    const today = new Date()
    const items: { date: string; label: string; intensity: number }[] = []
    const colors = [
      "rgba(255, 255, 255, 0.05)",
      "rgba(138, 43, 226, 0.2)",
      "rgba(138, 43, 226, 0.4)",
      "rgba(138, 43, 226, 0.6)",
      "rgba(138, 43, 226, 0.8)",
      "rgba(138, 43, 226, 1)",
    ]
    for (let i = 34; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const dateStr = d.toISOString().split("T")[0]
      const weekday = d.toLocaleDateString("en-US", { weekday: "long" })
      const filtered = activeFilter === "All" ? habits : habits.filter((h) => h.category === activeFilter)
      const scheduled = filtered.filter((h) => h.days?.includes(weekday))
      const total = scheduled.length || filtered.length || 1
      const completed = filtered.filter((h) => h.lastCompletedDate === dateStr).length
      const completionRate = completed / total
      const intensity = Math.min(5, Math.floor(completionRate * 6))
      items.push({
        date: dateStr,
        label: `${weekday}, ${d.toLocaleDateString()}`,
        intensity,
      })
    }
    return { items, colors }
  }, [habits, activeFilter])

  const topHabits = useMemo(() => {
    const filtered = activeFilter === "All" ? habits : habits.filter((h) => h.category === activeFilter)
    return [...filtered].sort((a, b) => (b.streak || 0) - (a.streak || 0)).slice(0, 5)
  }, [habits, activeFilter])

  return (
    <div className="card" id="analytics-dashboard">
      <div className="card-header">
        <div className="card-title">Habit Completion History</div>
        <button>View All</button>
      </div>
      <div style={{ marginTop: "15px", marginBottom: "15px" }}>
        <div className="tag-pills">
          <div className={`tag-pill ${activeFilter === "All" ? "active" : ""}`} onClick={() => setActiveFilter("All")}>
            All
          </div>
          {categories.map((category) => (
            <div
              key={category}
              className={`tag-pill ${activeFilter === category ? "active" : ""}`}
              onClick={() => setActiveFilter(category)}
            >
              {category}
            </div>
          ))}
        </div>
      </div>
      <div className="heatmap" style={{ display: "grid", gridTemplateColumns: "repeat(35, 1fr)", gap: 4 }}>
        {cells.items.map((c, i) => (
          <div
            key={`${c.date}-${i}`}
            className="heatmap-cell"
            title={c.label}
            style={{ backgroundColor: cells.colors[c.intensity], width: 12, height: 12, borderRadius: 2 }}
          />
        ))}
      </div>
      <div className="habit-list">
        {topHabits.length > 0 ? (
          topHabits.map((habit) => {
            const progressPercentage = Math.min(((habit.streak || 0) / 30) * 100, 100)
            const progressColor =
              progressPercentage > 80 ? "var(--success)" : progressPercentage > 50 ? "var(--primary)" : "var(--warning)"
            return (
              <div className="habit-row" key={habit.id}>
                <div>
                  <span className="habit-name">{habit.name}</span>
                  <span className="habit-category">{habit.category}</span>
                </div>
                <div className="habit-stat">
                  <div className="habit-streak">{habit.streak || 0} day streak</div>
                  <div className="habit-progress">
                    <div
                      className="habit-progress-bar"
                      style={{ width: `${progressPercentage}%`, backgroundColor: progressColor }}
                    />
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div style={{ padding: "20px 0", textAlign: "center", color: "var(--text-secondary)" }}>
            No habit data available yet. Start tracking habits to see your progress!
          </div>
        )}
      </div>
    </div>
  )
}
