import React, { useRef } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert, Share } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useDNAStore } from '../../store/habit-dna-store'
import { useHabitStore } from '../../store/habit-store'
import DNAVisualization from './DNAVisualization'

export default function ShareableDNACard() {
  const { dna } = useDNAStore()
  const { habits } = useHabitStore()

  const handleShare = async () => {
    if (!dna) return

    const totalStreak = habits.reduce((sum, h) => sum + (h.streak || 0), 0)
    const avgCompletionRate = habits.length > 0
      ? Math.round((habits.reduce((sum, h) => sum + h.completed, 0) / (habits.length * 30)) * 100)
      : 0

    const shareText = `🧬 My Habit DNA - ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}

🔥 ${totalStreak}-day total streak
💪 ${avgCompletionRate}% completion rate
🎯 ${habits.length} active habits
✨ ${dna.mutations.length} mutations unlocked

Built with Habitual - Your Intelligent Habit Tracker`

    try {
      await Share.share({
        message: shareText,
        title: 'My Habit DNA',
      })
    } catch (error) {
      Alert.alert('Error', 'Failed to share DNA')
    }
  }

  if (!dna) return null

  const totalStreak = habits.reduce((sum, h) => sum + (h.streak || 0), 0)
  const totalCompletions = habits.reduce((sum, h) => sum + h.completed, 0)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shareable DNA Card</Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color="#8a2be2" />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <DNAVisualization />
        
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statValue}>{totalStreak}</Text>
            <Text style={styles.statLabel}>Total Streak</Text>
          </View>
          
          <View style={styles.statBox}>
            <Text style={styles.statIcon}>💪</Text>
            <Text style={styles.statValue}>{dna.complexity}%</Text>
            <Text style={styles.statLabel}>DNA Power</Text>
          </View>
          
          <View style={styles.statBox}>
            <Text style={styles.statIcon}>🎯</Text>
            <Text style={styles.statValue}>{habits.length}</Text>
            <Text style={styles.statLabel}>Active Habits</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statIcon}>✨</Text>
            <Text style={styles.statValue}>{dna.mutations.length}</Text>
            <Text style={styles.statLabel}>Mutations</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Built with Habitual</Text>
          <Text style={styles.footerSubtext}>Your Intelligent Habit Tracker</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  shareButton: {
    padding: 8,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#8a2be2',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  statBox: {
    width: '48%',
    backgroundColor: '#252525',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#b3b3b3',
    textAlign: 'center',
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#252525',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8a2be2',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#b3b3b3',
  },
})
