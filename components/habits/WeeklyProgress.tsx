import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Habit } from "../../store/habit-store"

interface WeeklyProgressProps {
  habit: Habit
}

export default function WeeklyProgress({ habit }: WeeklyProgressProps) {
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const today = new Date()

  return (
    <View style={styles.container}>
      <View style={styles.weekRow}>
        {weekDays.map((day, i) => {
          const date = new Date()
          // Get Monday of current week
          const firstDayOfWeek = date.getDate() - date.getDay() + 1
          date.setDate(firstDayOfWeek + i)
          const dateStr = date.toISOString().split("T")[0]

          const fullDayName = date.toLocaleDateString("en-US", { weekday: "long" })
          const isScheduled = habit.days.includes(fullDayName)
          const isCompleted =
            habit.completionHistory?.some((c) => c.date === dateStr) || false

          return (
            <View key={day} style={styles.dayCircle}>
              <Text style={styles.dayLabel}>{day}</Text>
              <View
                style={[
                  styles.indicator,
                  !isScheduled && styles.notScheduled,
                  isCompleted && styles.completed,
                ]}
              />
            </View>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 4,
  },
  dayCircle: {
    alignItems: "center",
    gap: 4,
  },
  dayLabel: {
    fontSize: 10,
    color: "#b3b3b3",
    fontWeight: "500",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#8a2be2",
  },
  notScheduled: {
    backgroundColor: "#3a3a3a",
  },
  completed: {
    backgroundColor: "#4caf50",
  },
})
