"use client"

import { useEffect, useRef } from "react"
import { useHabitStore } from "@/store/habit-store"
import { useReminderStore } from "@/store/reminder-store"

export function useNotifications() {
  const habits = useHabitStore((state) => state.habits)
  const reminders = useReminderStore((state) => state.reminders)
  const scheduledNotifications = useRef<Map<string, NodeJS.Timeout>>(new Map())

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  // Schedule notifications for habits with reminders
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "granted") {
      // Clear existing timeouts
      scheduledNotifications.current.forEach((timeout) => clearTimeout(timeout))
      scheduledNotifications.current.clear()

      const now = new Date()

      // Schedule habit reminders
      habits.forEach((habit) => {
        if (habit.reminder && habit.time) {
          const [hours, minutes] = habit.time.split(":").map(Number)
          const notificationTime = new Date()
          notificationTime.setHours(hours, minutes, 0, 0)

          // If time has passed today, schedule for tomorrow
          if (notificationTime <= now) {
            notificationTime.setDate(notificationTime.getDate() + 1)
          }

          const timeUntilNotification = notificationTime.getTime() - now.getTime()

          const timeout = setTimeout(() => {
            new Notification("Habit Reminder", {
              body: `Time to complete: ${habit.name}`,
              icon: "/icon-192x192.png",
              badge: "/icon-192x192.png",
              tag: `habit-${habit.id}`,
            })
          }, timeUntilNotification)

          scheduledNotifications.current.set(`habit-${habit.id}`, timeout)
        }
      })

      // Schedule standalone reminders
      reminders.forEach((reminder) => {
        if (!reminder.completed && reminder.notification) {
          const reminderTime = new Date(reminder.datetime)

          // Only schedule if in the future
          if (reminderTime > now) {
            const timeUntilNotification = reminderTime.getTime() - now.getTime()

            const timeout = setTimeout(() => {
              new Notification("Reminder", {
                body: reminder.title,
                icon: "/icon-192x192.png",
                badge: "/icon-192x192.png",
                tag: `reminder-${reminder.id}`,
              })
            }, timeUntilNotification)

            scheduledNotifications.current.set(`reminder-${reminder.id}`, timeout)
          }
        }
      })
    }

    // Cleanup on unmount
    return () => {
      scheduledNotifications.current.forEach((timeout) => clearTimeout(timeout))
      scheduledNotifications.current.clear()
    }
  }, [habits, reminders])

  return null
}
