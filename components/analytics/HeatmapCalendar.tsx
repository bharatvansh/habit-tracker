import React from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { Habit } from "../../store/habit-store"

interface HeatmapCalendarProps {
  habits: Habit[]
}

export default function HeatmapCalendar({ habits }: HeatmapCalendarProps) {
  // Generate last 90 days
  const last90Days = Array.from({ length: 90 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (89 - i))
    return date.toISOString().split("T")[0]
  })

  // Calculate completions per day
  const getDayIntensity = (date: string): number => {
    const count = habits.filter((h) => {
      if (!h.completionHistory) return false
      return h.completionHistory.some((c) => c.date === date)
    }).length

    if (count === 0) return 0
    // Normalize intensity between 0.2 and 1 based on completion count
    return Math.min(0.2 + count * 0.2, 1)
  }

  // Group days by weeks
  const weeks: string[][] = []
  let currentWeek: string[] = []

  last90Days.forEach((date, index) => {
    currentWeek.push(date)
    if (currentWeek.length === 7 || index === last90Days.length - 1) {
      weeks.push([...currentWeek])
      currentWeek = []
    }
  })

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activity Heatmap</Text>
      <Text style={styles.subtitle}>Last 90 days</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.grid}>
          {weeks.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.column}>
              {week.map((date) => {
                const intensity = getDayIntensity(date)
                return (
                  <View
                    key={date}
                    style={[
                      styles.cell,
                      {
                        backgroundColor:
                          intensity === 0
                            ? "#2a2a2a"
                            : `rgba(138, 43, 226, ${intensity})`,
                      },
                    ]}
                  />
                )
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.legend}>
        <Text style={styles.legendText}>Less</Text>
        <View style={styles.legendSquares}>
          <View style={[styles.legendSquare, { backgroundColor: "#2a2a2a" }]} />
          <View
            style={[styles.legendSquare, { backgroundColor: "rgba(138, 43, 226, 0.3)" }]}
          />
          <View
            style={[styles.legendSquare, { backgroundColor: "rgba(138, 43, 226, 0.6)" }]}
          />
          <View
            style={[styles.legendSquare, { backgroundColor: "rgba(138, 43, 226, 1)" }]}
          />
        </View>
        <Text style={styles.legendText}>More</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#b3b3b3",
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    gap: 3,
  },
  column: {
    gap: 3,
  },
  cell: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 8,
  },
  legendText: {
    fontSize: 12,
    color: "#b3b3b3",
  },
  legendSquares: {
    flexDirection: "row",
    gap: 3,
  },
  legendSquare: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
})
