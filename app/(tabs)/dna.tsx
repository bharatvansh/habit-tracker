import React, { useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useDNAStore } from '../../store/habit-dna-store'
import { useHabitStore } from '../../store/habit-store'
import DNAVisualization from '../../components/dna/DNAVisualization'
import DNAStatsCard from '../../components/dna/DNAStatsCard'
import MutationsGallery from '../../components/dna/MutationsGallery'
import ShareableDNACard from '../../components/dna/ShareableDNACard'

export default function DNAPage() {
  const { habits } = useHabitStore()
  const { dna, generateDNA } = useDNAStore()

  useEffect(() => {
    // Generate DNA when component mounts or habits change
    generateDNA(habits)
  }, [habits, generateDNA])

  const handleRegenerateDNA = () => {
    generateDNA(habits)
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>🧬</Text>
            </View>
            <View>
              <Text style={styles.title}>Habit DNA™</Text>
              <Text style={styles.subtitle}>Your unique visual identity</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleRegenerateDNA}
            style={styles.refreshButton}
          >
            <Ionicons name="refresh" size={24} color="#8a2be2" />
          </TouchableOpacity>
        </View>

        {dna ? (
          <>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Your DNA Visualization</Text>
                <Text style={styles.cardSubtitle}>
                  Last updated: {new Date(dna.lastUpdated).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
              <DNAVisualization />
            </View>

            <DNAStatsCard />
            <MutationsGallery />
            <ShareableDNACard />

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>About Habit DNA™</Text>
              <Text style={styles.infoText}>
                Your Habit DNA is a unique visual representation of your habit patterns. 
                Each segment represents a habit, with its color determined by category, 
                size by streak length, and shape by frequency. As you build and maintain 
                habits, your DNA evolves and becomes more complex.
              </Text>
              <Text style={styles.infoText}>
                Unlock special mutations by achieving milestones like maintaining long 
                streaks, building multiple habits in a category, or reaching completion goals.
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🧬</Text>
            <Text style={styles.emptyTitle}>Build Your DNA</Text>
            <Text style={styles.emptyText}>
              Start creating habits to generate your unique Habit DNA visualization. 
              Your DNA will evolve as you build and maintain your habits.
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => {
                // Navigate to habits page
              }}
            >
              <Text style={styles.emptyButtonText}>Create Your First Habit</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#b3b3b3',
  },
  refreshButton: {
    padding: 8,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#b3b3b3',
  },
  infoCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.3)',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8a2be2',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#b3b3b3',
    lineHeight: 20,
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#b3b3b3',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyButton: {
    backgroundColor: '#8a2be2',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
})
