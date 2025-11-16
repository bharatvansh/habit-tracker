"use client"

import { useEffect, useState } from "react"
import { useReminderStore } from "@/store/reminder-store"
import { useHabitStore } from "@/store/habit-store"
import { useToast } from "@/hooks/use-toast"

interface UpcomingItem {
  type: "reminder" | "habit"
  title: string
  hour: number
  minute: string
  ampm: string
  alarm?: boolean
  notification?: boolean
  tags?: string
  id: string
}

export default function UpcomingList() {
  const { reminders } = useReminderStore()
  const { habits, markHabitComplete } = useHabitStore()
  const [upcomingItems, setUpcomingItems] = useState<UpcomingItem[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const now = new Date()
    const todayDayName = now.toLocaleDateString("en-US", { weekday: "long" })

    // Process reminders for today
    const todayReminders = reminders
      .filter((reminder) => {
        const reminderDate = new Date(reminder.datetime)
        return reminderDate.toDateString() === now.toDateString() && reminderDate.getTime() > now.getTime()
      })
      .map((reminder, index) => {
        const reminderDate = new Date(reminder.datetime)
        let hour = reminderDate.getHours()
        const minute = reminderDate.getMinutes()
        const ampm = hour >= 12 ? "PM" : "AM"
        hour = hour % 12
        if (hour === 0) hour = 12
        const minuteStr = minute < 10 ? "0" + minute : minute.toString()

        return {
          type: "reminder" as const,
          title: reminder.title,
          hour,
          minute: minuteStr,
          ampm,
          alarm: reminder.alarm,
          notification: reminder.notification,
          id: index.toString(),
        }
      })

    // Process habits for today
    const todayHabits = habits
      .filter((habit) => {
        const todayStr = now.toISOString().split("T")[0]
        const todayDayName = now.toLocaleDateString("en-US", { weekday: "long" })
        return habit.days?.includes(todayDayName) && habit.lastCompletedDate !== todayStr
      })
      .map((habit) => {
        let hour24 = 8
        let minute = 0
        if (habit.time && /^\d{2}:\d{2}$/.test(habit.time)) {
          const [h, m] = habit.time.split(":")
          hour24 = Number.parseInt(h, 10)
          minute = Number.parseInt(m, 10)
        }
        const ampm = hour24 >= 12 ? "PM" : "AM"
        let hour12 = hour24 % 12
        if (hour12 === 0) hour12 = 12
        const minuteStr = minute < 10 ? "0" + minute : String(minute)
        return {
          type: "habit" as const,
          title: habit.name,
          hour: hour12,
          minute: minuteStr,
          ampm,
          tags: (habit as any).tags,
          id: habit.id,
        }
      })

    // Combine and sort by time
    const combinedItems = [...todayReminders, ...todayHabits].sort((a, b) => {
      // Sort by AM/PM first
      if (a.ampm !== b.ampm) return a.ampm === "AM" ? -1 : 1
      // Then by hour
      if (a.hour !== b.hour) return a.hour - b.hour
      // Then by minute
      return Number.parseInt(a.minute) - Number.parseInt(b.minute)
    })

    setUpcomingItems(combinedItems)
  }, [reminders, habits])

  const handleCompleteHabit = (id: string, title: string) => {
    markHabitComplete(id)
    toast({ title: "Habit completed", description: `"${title}" marked complete for today.` })
  }

  if (upcomingItems.length === 0) {
    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            padding: "2rem",
            color: "var(--text-secondary)",
            textAlign: "center",
          }}
        >
          <div>
            <i className="fa-solid fa-calendar-day" style={{ fontSize: "2rem", marginBottom: "1rem" }}></i>
            <p>No upcoming habits or reminders for today. Add some to see them here.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {upcomingItems.map((item, index) => (
        <div className="upcoming-item" key={`${item.type}-${item.id}-${index}`}>
          <div className="upcoming-time">
            <div className="hour">
              {item.hour}:{item.minute}
            </div>
            <div className="ampm">{item.ampm}</div>
          </div>
          <div className="upcoming-info">
            <div className="upcoming-title">
              {item.type === "habit" && (
                <span className="tag" style={{ marginRight: "8px", backgroundColor: "rgba(138, 43, 226, 0.2)" }}>
                  Habit
                </span>
              )}
              {item.type === "reminder" && (
                <span
                  className="tag"
                  style={{ marginRight: "8px", backgroundColor: "rgba(33, 150, 243, 0.2)", color: "var(--info)" }}
                >
                  Reminder
                </span>
              )}
              {item.title}
            </div>
            <div className="upcoming-meta">
              {item.type === "reminder" && (item.alarm || item.notification) && (
                <span>
                  {item.alarm && (
                    <>
                      <i className="fa-solid fa-bell"></i> Alarm
                    </>
                  )}
                  {item.alarm && item.notification && " | "}
                  {item.notification && "Notification"}
                </span>
              )}
              {item.type === "habit" && item.tags && (
                <span>
                  <i className="fa-solid fa-tag"></i> {item.tags.split(",")[0].trim()}
                </span>
              )}
            </div>
          </div>
          <div className="upcoming-actions">
            {item.type === "habit" && (
              <button
                className="action-btn mark-complete-btn"
                onClick={() => handleCompleteHabit(item.id, item.title)}
                title="Mark Complete"
              >
                <i className="fa-solid fa-check"></i>
              </button>
            )}
            <button className="action-btn">
              <i className="fa-solid fa-ellipsis"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
