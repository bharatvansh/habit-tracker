"use client"

import { useState } from "react"
import { useHabitStore } from "@/store/habit-store"
import { calculateWeeklyActivity } from "@/lib/habit-utils"

export default function WeeklyActivity() {
  const { habits, categories } = useHabitStore()
  const [activeFilter, setActiveFilter] = useState("All Habits")

  // Calculate activity percentages using the utility function
  const activityData = calculateWeeklyActivity(habits, activeFilter)
  const hasActivity = activityData.some((value) => value > 0)

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Weekly Activity</div>
      </div>
      <div className="weekday-chart">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
          <div className="weekday-col" key={day}>
            <div
              className={`weekday-bar ${hasActivity && activityData[index] > 50 ? "active" : ""}`}
              id={`bar-${day.toLowerCase()}`}
              style={{ height: `${hasActivity ? activityData[index] : 0}%` }}
            ></div>
            <div className="weekday-label">{day}</div>
          </div>
        ))}
      </div>
      <div className="card-footer">
        <div className="tag-pills">
          <div
            className={`tag-pill ${activeFilter === "All Habits" ? "active" : ""}`}
            onClick={() => setActiveFilter("All Habits")}
          >
            All Habits
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
    </div>
  )
}
