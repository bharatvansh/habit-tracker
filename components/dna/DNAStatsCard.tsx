import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useDNAStore } from '../../store/habit-dna-store'

export default function DNAStatsCard() {
  const { dna } = useDNAStore()

  if (!dna) return null

  // Group segments by category
  const categoryGroups = dna.segments.reduce((acc, segment) => {
    if (!acc[segment.category]) {
      acc[segment.category] = {
        count: 0,
        totalStreak: 0,
        color: segment.color,
      }
    }
    acc[segment.category].count += 1
    acc[segment.category].totalStreak += segment.streak
    return acc
  }, {} as Record<string, { count: number; totalStreak: number; color: string }>)

  return (
    <View style={styles.container}>
      <View style={styles.complexitySection}>
        <Text style={styles.label}>DNA Complexity</Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${dna.complexity}%` }]} />
        </View>
        <Text style={styles.complexityText}>{dna.complexity}%</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.segmentsSection}>
        <Text style={styles.sectionTitle}>Active Segments</Text>
        {Object.entries(categoryGroups).map(([category, data]) => (
          <View key={category} style={styles.segmentRow}>
            <View style={styles.segmentLeft}>
              <View style={[styles.colorDot, { backgroundColor: data.color }]} />
              <Text style={styles.categoryName}>{category}</Text>
              <Text style={styles.habitCount}>({data.count} habits)</Text>
            </View>
            <Text style={styles.streakText}>Streak: {Math.floor(data.totalStreak / data.count)}d</Text>
          </View>
        ))}
      </View>

      {dna.mutations.length > 0 && (
        <>
          <View style={styles.divider} />
          <View style={styles.mutationsSection}>
            <Text style={styles.sectionTitle}>Latest Mutation</Text>
            <View style={styles.mutationCard}>
              <Text style={styles.mutationIcon}>{dna.mutations[dna.mutations.length - 1].icon}</Text>
              <View style={styles.mutationInfo}>
                <Text style={styles.mutationName}>{dna.mutations[dna.mutations.length - 1].name}</Text>
                <Text style={styles.mutationDate}>
                  Unlocked: {new Date(dna.mutations[dna.mutations.length - 1].unlockedAt!).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  complexitySection: {
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#b3b3b3',
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#252525',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#8a2be2',
    borderRadius: 4,
  },
  complexityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  divider: {
    height: 1,
    backgroundColor: '#252525',
    marginVertical: 16,
  },
  segmentsSection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  segmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  segmentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '500',
  },
  habitCount: {
    fontSize: 12,
    color: '#b3b3b3',
    marginLeft: 4,
  },
  streakText: {
    fontSize: 14,
    color: '#b3b3b3',
  },
  mutationsSection: {
    marginTop: 8,
  },
  mutationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252525',
    padding: 12,
    borderRadius: 8,
  },
  mutationIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  mutationInfo: {
    flex: 1,
  },
  mutationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffd700',
    marginBottom: 4,
  },
  mutationDate: {
    fontSize: 12,
    color: '#b3b3b3',
  },
})
