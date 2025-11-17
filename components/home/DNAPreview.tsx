import React, { useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useDNAStore } from '../../store/habit-dna-store'
import { useHabitStore } from '../../store/habit-store'

export default function DNAPreview() {
  const router = useRouter()
  const { dna, generateDNA } = useDNAStore()
  const { habits } = useHabitStore()

  useEffect(() => {
    if (habits.length > 0) {
      generateDNA(habits)
    }
  }, [habits, generateDNA])

  if (!dna || dna.segments.length === 0) {
    return null
  }

  const latestMutation = dna.mutations.length > 0 ? dna.mutations[dna.mutations.length - 1] : null

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push('/(tabs)/dna')}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.icon}>🧬</Text>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Your Habit DNA™</Text>
            <Text style={styles.subtitle}>Tap to explore</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#8a2be2" />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{dna.complexity}%</Text>
          <Text style={styles.statLabel}>Complexity</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{dna.segments.length}</Text>
          <Text style={styles.statLabel}>Segments</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{dna.mutations.length}</Text>
          <Text style={styles.statLabel}>Mutations</Text>
        </View>
      </View>

      {latestMutation && (
        <View style={styles.mutationBanner}>
          <Text style={styles.mutationIcon}>{latestMutation.icon}</Text>
          <View style={styles.mutationText}>
            <Text style={styles.mutationLabel}>Latest Mutation</Text>
            <Text style={styles.mutationName}>{latestMutation.name}</Text>
          </View>
        </View>
      )}

      <View style={styles.colorsRow}>
        <Text style={styles.colorsLabel}>Dominant Colors:</Text>
        <View style={styles.colorDots}>
          {dna.dominantColors.map((color, index) => (
            <View
              key={index}
              style={[styles.colorDot, { backgroundColor: color }]}
            />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.3)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 32,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#8a2be2',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#252525',
    borderRadius: 8,
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#8a2be2',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#b3b3b3',
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: '#333333',
  },
  mutationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  mutationIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  mutationText: {
    flex: 1,
  },
  mutationLabel: {
    fontSize: 11,
    color: '#ffd700',
    fontWeight: '500',
    marginBottom: 2,
  },
  mutationName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  colorsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  colorsLabel: {
    fontSize: 12,
    color: '#b3b3b3',
  },
  colorDots: {
    flexDirection: 'row',
    gap: 8,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#252525',
  },
})
