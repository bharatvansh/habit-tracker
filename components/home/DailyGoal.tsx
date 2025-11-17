import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { useHabitStore } from "../../store/habit-store"

export default function DailyGoal() {
  const { habits } = useHabitStore()
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" })

  const todaysHabits = habits.filter((h) => h.days.includes(today))
  const todayStr = new Date().toISOString().split("T")[0]
  const completed = todaysHabits.filter((h) => h.lastCompletedDate === todayStr)

  const percentage =
    todaysHabits.length > 0 ? (completed.length / todaysHabits.length) * 100 : 0

  if (todaysHabits.length === 0) {
    return (
      <View style={styles.goalCard}>
        <Text style={styles.goalTitle}>Today's Goal</Text>
        <Text style={styles.emptyText}>No habits scheduled for today</Text>
      </View>
    )
  }

  return (
    <View style={styles.goalCard}>
      <Text style={styles.goalTitle}>Today's Goal</Text>
      <Text style={styles.goalProgress}>
        {completed.length} / {todaysHabits.length} habits completed
      </Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${percentage}%` }]} />
      </View>
      {percentage === 100 && <Text style={styles.goalComplete}>🎉 Perfect day!</Text>}
      {percentage >= 80 && percentage < 100 && (
        <Text style={styles.goalAlmost}>🌟 Almost there!</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  goalCard: {
    backgroundColor: "#1e1e1e",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  goalProgress: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8a2be2",
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#2a2a2a",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#8a2be2",
    borderRadius: 4,
  },
  goalComplete: {
    fontSize: 16,
    color: "#4caf50",
    fontWeight: "600",
    marginTop: 12,
    textAlign: "center",
  },
  goalAlmost: {
    fontSize: 16,
    color: "#ffc107",
    fontWeight: "600",
    marginTop: 12,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#b3b3b3",
    marginTop: 4,
  },
})
