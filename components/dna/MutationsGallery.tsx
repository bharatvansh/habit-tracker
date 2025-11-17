import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useDNAStore } from '../../store/habit-dna-store'

export default function MutationsGallery() {
  const { dna, availableMutations } = useDNAStore()

  const unlockedMutationIds = new Set(dna?.mutations.map(m => m.id) || [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mutations Gallery</Text>
      <Text style={styles.subtitle}>
        {dna?.mutations.length || 0} of {availableMutations.length} unlocked
      </Text>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {availableMutations.map((mutation) => {
          const isUnlocked = unlockedMutationIds.has(mutation.id)
          const unlockedMutation = dna?.mutations.find(m => m.id === mutation.id)

          return (
            <TouchableOpacity
              key={mutation.id}
              style={[
                styles.mutationCard,
                isUnlocked ? styles.mutationCardUnlocked : styles.mutationCardLocked,
              ]}
              activeOpacity={0.8}
            >
              <View style={styles.mutationIconContainer}>
                <Text style={[styles.mutationIcon, !isUnlocked && styles.mutationIconLocked]}>
                  {isUnlocked ? mutation.icon : '🔒'}
                </Text>
              </View>
              <Text style={[styles.mutationName, !isUnlocked && styles.mutationNameLocked]}>
                {isUnlocked ? mutation.name : '???'}
              </Text>
              <Text style={styles.mutationDescription}>
                {isUnlocked ? mutation.description : 'Locked'}
              </Text>
              {isUnlocked && unlockedMutation?.unlockedAt && (
                <Text style={styles.unlockedDate}>
                  {new Date(unlockedMutation.unlockedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              )}
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.legendBoxUnlocked]} />
          <Text style={styles.legendText}>Unlocked</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.legendBoxLocked]} />
          <Text style={styles.legendText}>Locked</Text>
        </View>
      </View>
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
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#b3b3b3',
    marginBottom: 16,
  },
  scrollContent: {
    paddingRight: 16,
  },
  mutationCard: {
    width: 150,
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  mutationCardUnlocked: {
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    borderColor: '#8a2be2',
  },
  mutationCardLocked: {
    backgroundColor: '#252525',
    borderColor: '#333333',
  },
  mutationIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#252525',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  mutationIcon: {
    fontSize: 32,
  },
  mutationIconLocked: {
    opacity: 0.3,
  },
  mutationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffd700',
    textAlign: 'center',
    marginBottom: 8,
  },
  mutationNameLocked: {
    color: '#666666',
  },
  mutationDescription: {
    fontSize: 12,
    color: '#b3b3b3',
    textAlign: 'center',
    marginBottom: 8,
  },
  unlockedDate: {
    fontSize: 10,
    color: '#8a2be2',
    fontWeight: '500',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 6,
    borderWidth: 2,
  },
  legendBoxUnlocked: {
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
    borderColor: '#8a2be2',
  },
  legendBoxLocked: {
    backgroundColor: '#252525',
    borderColor: '#333333',
  },
  legendText: {
    fontSize: 12,
    color: '#b3b3b3',
  },
})
