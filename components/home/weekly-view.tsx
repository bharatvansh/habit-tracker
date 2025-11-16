"use client"

import { useEffect, useState } from "react"
import { useHabitStore } from "@/store/habit-store"

export default function WeeklyView() {
  const { habits } = useHabitStore()
  const [weekDays, setWeekDays] = useState<
    Array<{
      name: string
      date: number
      isToday: boolean
      habits: Array<{ name: string; completed: boolean; category: string }>
    }>
  >([])

  useEffect(() => {
    // Calculate the week days and habits for each day
    const today = new Date()
    const day = today.getDay()
    const diff = today.getDate() - day + (day === 0 ? -6 : 1)
    const monday = new Date(today)
    monday.setDate(diff)

    const days = []
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(monday)
      currentDay.setDate(monday.getDate() + i)
      const dayName = currentDay.toLocaleDateString("en-US", { weekday: "short" })
      const dayDate = currentDay.getDate()
      const isToday = currentDay.toDateString() === today.toDateString()
      const weekdayFull = currentDay.toLocaleDateString("en-US", { weekday: "long" })

      // Filter habits that are scheduled for this day AND were created on or before this day
      const dayHabits = habits
        .filter((habit) => {
          // Get the habit creation date, default to today if not available
          const habitCreatedAt = habit.createdAt ? new Date(habit.createdAt) : new Date()

          // Reset time portion to compare just the dates
          habitCreatedAt.setHours(0, 0, 0, 0)
          const dayToCompare = new Date(currentDay)
          dayToCompare.setHours(0, 0, 0, 0)

          // Only show habits on days that are scheduled AND on or after the habit was created
          return habit.days && habit.days.includes(weekdayFull) && dayToCompare >= habitCreatedAt
        })
        .map((habit) => ({
          name: habit.name,
          completed: habit.lastCompletedDate === currentDay.toISOString().split("T")[0],
          category: habit.category,
        }))

      days.push({
        name: dayName,
        date: dayDate,
        isToday,
        habits: dayHabits,
      })
    }

    setWeekDays(days)
  }, [habits])

  // Check if there are any habits scheduled for the week
  const hasHabitsThisWeek = weekDays.some((day) => day.habits.length > 0)

  return (
    <div className="weekly-view">
      {/* Always show the days and dates */}
      {weekDays.map((day, index) => (
        <div className="day-column" key={index}>
          <div className="day-name">{day.name}</div>
          <div className={`day-date ${day.isToday ? "today" : ""}`}>{day.date}</div>
        </div>
      ))}

      {/* Conditionally show habits or the "no habits" message */}
      {hasHabitsThisWeek ? (
        <div className="weekly-view" style={{ marginTop: "10px" }}>
          {weekDays.map((day, index) => (
            <div className="day-column" key={`habits-${index}`}>
              <div className="day-habits">
                {day.habits.map((habit, habitIndex) => (
                  <div
                    className={`day-habit ${habit.completed ? "completed" : ""}`}
                    key={habitIndex}
                    title={`${habit.name} (${habit.category})`}
                  >
                    {habit.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifySelf: "center",
            alignSelf: "center",
            gridColumn: "1 / -1",
            padding: "2rem",
            color: "var(--text-secondary)",
            textAlign: "center",
            marginTop: "10px",
            width: "100%",
          }}
        >
          <i className="fa-solid fa-calendar-day" style={{ fontSize: "2rem", marginBottom: "1rem" }}></i>
          <p>No habits scheduled for this week. Add habits to see your weekly view.</p>
        </div>
      )}
    </div>
  )
}
