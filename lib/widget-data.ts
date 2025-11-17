import AsyncStorage from "@react-native-async-storage/async-storage"
import { useHabitStore } from "../store/habit-store"

export interface WidgetData {
  total: number
  completed: number
  habits: {
    name: string
    completed: boolean
    streak: number
  }[]
  longestStreak: number
}

export function getWidgetData(): WidgetData {
  const { habits } = useHabitStore.getState()
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" })
  const todayStr = new Date().toISOString().split("T")[0]

  const todaysHabits = habits
    .filter((h) => h.days.includes(today))
    .map((h) => ({
      name: h.name,
      completed: h.lastCompletedDate === todayStr,
      streak: h.streak,
    }))

  return {
    total: todaysHabits.length,
    completed: todaysHabits.filter((h) => h.completed).length,
    habits: todaysHabits.slice(0, 5), // Top 5
    longestStreak: todaysHabits.length > 0 ? Math.max(...todaysHabits.map((h) => h.streak)) : 0,
  }
}

export async function updateWidgetData(): Promise<void> {
  const data = getWidgetData()
  await AsyncStorage.setItem("widget-data", JSON.stringify(data))
}
