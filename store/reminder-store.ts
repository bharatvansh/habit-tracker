"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Reminder {
  id: string
  title: string
  datetime: string
  alarm: boolean
  notification: boolean
  priority?: "high" | "medium" | "low"
  category?: string
  completed?: boolean
  completedAt?: string
}

interface ReminderStore {
  reminders: Reminder[]
  isLoading: boolean
  loadReminders: () => void
  addReminder: (reminder: Omit<Reminder, "id">) => void
  editReminder: (id: string, reminder: Omit<Reminder, "id">) => void
  deleteReminder: (id: string) => void
  toggleComplete: (id: string) => void
}

export const useReminderStore = create<ReminderStore>()(
  persist(
    (set, get) => ({
      reminders: [],
      isLoading: true,

      loadReminders: () => {
        set({ isLoading: false })
      },

      addReminder: (reminder) => {
        set((state) => {
          const withId: Reminder = {
            id:
              typeof crypto !== "undefined" && "randomUUID" in crypto
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random()}`,
            ...reminder,
          }
          return { reminders: [...state.reminders, withId] }
        })
      },

      editReminder: (id, reminder) => {
        set((state) => {
          const reminders = state.reminders.map((r) => (r.id === id ? { ...r, ...reminder, id } : r))
          return { reminders }
        })
      },

      deleteReminder: (id) => {
        set((state) => {
          const reminders = state.reminders.filter((r) => r.id !== id)
          return { reminders }
        })
      },

      toggleComplete: (id) => {
        set((state) => {
          const reminders = state.reminders.map((r) =>
            r.id === id
              ? {
                  ...r,
                  completed: !r.completed,
                  completedAt: !r.completed ? new Date().toISOString() : undefined,
                }
              : r,
          )
          return { reminders }
        })
      },
    }),
    {
      name: "reminder-storage",
      onRehydrateStorage: () => (state) => {
        state?.isLoading !== undefined && (state.isLoading = false)
      },
    },
  ),
)
