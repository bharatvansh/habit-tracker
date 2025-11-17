import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Habit } from "../../store/habit-store"
import { getCategoryInsights } from "../../lib/category-insights"

interface CategoryInsightsProps {
  habits: Habit[]
  categories: string[]
}

export default function CategoryInsights({ habits, categories }: CategoryInsightsProps) {
  const insights = getCategoryInsights(habits, categories)

  if (insights.length === 0) {
    return null
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Category Insights</Text>
      {insights.map((insight, index) => (
        <View key={index} style={styles.insightCard}>
          <Text style={styles.insightText}>{insight}</Text>
        </View>
      ))}
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
    marginBottom: 12,
  },
  insightCard: {
    backgroundColor: "#2a2a2a",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#8a2be2",
  },
  insightText: {
    fontSize: 14,
    color: "#e0e0e0",
    lineHeight: 20,
  },
})
