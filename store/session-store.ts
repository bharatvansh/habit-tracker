"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"

export interface AppSession {
  openedAt: string
  closedAt?: string
}

interface SessionStore {
  sessions: AppSession[]
  currentSession: AppSession | null
  startSession: () => void
  endSession: () => void
  getBestNotificationTimes: () => string[]
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSession: null,

      startSession: () => {
        const session: AppSession = {
          openedAt: new Date().toISOString(),
        }
        set({ currentSession: session })
      },

      endSession: () => {
        set((state) => {
          if (!state.currentSession) return state

          const closedSession = {
            ...state.currentSession,
            closedAt: new Date().toISOString(),
          }

          return {
            sessions: [...state.sessions, closedSession],
            currentSession: null,
          }
        })
      },

      getBestNotificationTimes: () => {
        const { sessions } = get()

        if (sessions.length < 3) {
          // Default times if not enough data
          return ["9:00", "14:00", "19:00"]
        }

        const hourCounts: Record<number, number> = {}

        sessions.forEach((session) => {
          const hour = new Date(session.openedAt).getHours()
          hourCounts[hour] = (hourCounts[hour] || 0) + 1
        })

        // Return top 3 hours
        const topHours = Object.entries(hourCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([hour]) => {
            const h = Number(hour)
            return `${h}:00`
          })

        return topHours.length > 0 ? topHours : ["9:00", "14:00", "19:00"]
      },
    }),
    {
      name: "session-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
