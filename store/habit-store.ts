"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { updateWidgetData } from "../lib/widget-data"

export interface Habit {
  id: string
  name: string
  time?: string
  frequency: string
  days: string[]
  category: string
  reminder: boolean
  completed: number
  streak: number
  lastCompletedDate: string | null
  weeklyCompleted: number
  createdAt: string
  // Additional fields
  completionNotes?: { date: string; note: string }[]
  color?: string
  completionHistory?: { date: string; time: string }[]
}

// Default categories
export const DEFAULT_CATEGORIES = ["Health", "Work", "Personal"]

interface HabitStore {
  habits: Habit[]
  categories: string[]
  isLoading: boolean
  loadHabits: () => void
  addHabit: (habit: Omit<Habit, "id">) => void
  markHabitComplete: (id: string, note?: string) => void
  deleteHabit: (id: string) => void
  addCategory: (category: string) => void
  deleteCategory: (category: string) => void
  resetWeeklyStats: () => void
  updateHabitColor: (id: string, color: string) => void
}

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      habits: [],
      categories: DEFAULT_CATEGORIES,
      isLoading: true,

      loadHabits: () => {
        set({ isLoading: false })
      },

      addHabit: (habit) => {
        set((state) => {
          const habitWithId: Habit = {
            id:
              typeof crypto !== "undefined" && "randomUUID" in crypto
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random()}`,
            ...habit,
            createdAt: habit.createdAt || new Date().toISOString(),
          }
          const newHabits = [...state.habits, habitWithId]
          return { habits: newHabits }
        })
      },

      markHabitComplete: (id, note) => {
        set((state) => {
          const habits = state.habits.map((h) => ({ ...h }))
          const index = habits.findIndex((h) => h.id === id)
          if (index === -1) return { habits: state.habits }

          const habit = habits[index]
          const todayStr = new Date().toISOString().split("T")[0]
          if (habit.lastCompletedDate === todayStr) {
            // Already completed today; no change
            return { habits }
          }

          const today = new Date()
          const dayOfWeek = today.toLocaleDateString("en-US", { weekday: "long" })
          if (habit.days.includes(dayOfWeek)) {
            if (habit.lastCompletedDate) {
              const previousScheduledDate = new Date(today)
              let daysChecked = 0
              let foundPreviousDay = false
              while (daysChecked < 7 && !foundPreviousDay) {
                previousScheduledDate.setDate(previousScheduledDate.getDate() - 1)
                const prevDayOfWeek = previousScheduledDate.toLocaleDateString("en-US", { weekday: "long" })
                if (habit.days.includes(prevDayOfWeek)) {
                  foundPreviousDay = true
                  const prevDateStr = previousScheduledDate.toISOString().split("T")[0]
                  habit.streak = habit.lastCompletedDate === prevDateStr ? (habit.streak || 0) + 1 : 1
                }
                daysChecked++
              }
              if (!foundPreviousDay) habit.streak = (habit.streak || 0) + 1
            } else {
              habit.streak = 1
            }
          }

          habit.lastCompletedDate = todayStr
          habit.completed = (habit.completed || 0) + 1
          habit.weeklyCompleted = (habit.weeklyCompleted || 0) + 1
          
          // Track completion history for analytics
          if (!habit.completionHistory) {
            habit.completionHistory = []
          }
          habit.completionHistory.push({
            date: todayStr,
            time: new Date().toISOString(),
          })
          
          // Add completion note if provided
          if (note) {
            if (!habit.completionNotes) {
              habit.completionNotes = []
            }
            habit.completionNotes.push({
              date: todayStr,
              note,
            })
          }
          
          // Update widget data after completion
          updateWidgetData().catch(console.error)
          
          return { habits }
        })
      },

      deleteHabit: (id) => {
        set((state) => {
          const habits = state.habits.filter((h) => h.id !== id)
          return { habits }
        })
      },

      addCategory: (category) => {
        set((state) => {
          if (state.categories.includes(category)) return state
          const newCategories = [...state.categories, category]
          return { categories: newCategories }
        })
      },

      deleteCategory: (category) => {
        set((state) => {
          const habitsWithCategory = state.habits.filter((h) => h.category === category)
          if (habitsWithCategory.length > 0) {
            // For React Native, we'll use Alert instead of alert
            import('react-native').then(({ Alert }) => {
              Alert.alert(
                "Cannot Delete Category",
                `Cannot delete category "${category}" because it is being used by ${habitsWithCategory.length} habit(s).`,
              )
            })
            return state
          }
          const newCategories = state.categories.filter((c) => c !== category)
          return { categories: newCategories }
        })
      },

      resetWeeklyStats: () => {
        set((state) => {
          const habits = state.habits.map((habit) => ({
            ...habit,
            weeklyCompleted: 0,
          }))

          return { habits }
        })
      },

      updateHabitColor: (id, color) => {
        set((state) => {
          const habits = state.habits.map((h) => 
            h.id === id ? { ...h, color } : h
          )
          return { habits }
        })
      },
    }),
    {
      name: "habit-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.isLoading !== undefined && (state.isLoading = false)
      },
    },
  ),
)
