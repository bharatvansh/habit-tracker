"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Habit } from "./habit-store"

export interface DNASegment {
  id: string
  color: string
  size: number
  shape: 'helix' | 'sphere' | 'cube' | 'pyramid'
  category: string
  earnedAt: string
  unlocked: boolean
  habitName: string
  streak: number
}

export interface Mutation {
  id: string
  name: string
  description: string
  triggerCondition: string
  visualEffect: string
  unlockedAt?: string
  icon: string
}

export interface HabitDNA {
  userId: string
  segments: DNASegment[]
  overallShape: string
  complexity: number
  dominantColors: string[]
  mutations: Mutation[]
  lastUpdated: string
}

interface DNAStore {
  dna: HabitDNA | null
  availableMutations: Mutation[]
  generateDNA: (habits: Habit[]) => void
  updateDNA: () => void
  unlockMutation: (mutationId: string) => void
  shareDNA: () => Promise<string>
}

// Category color mapping
const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    'Health': '#4caf50',
    'Work': '#f44336',
    'Personal': '#8a2be2',
    'Learning': '#2196f3',
    'Finance': '#ffc107',
    'Fitness': '#ff5722',
    'Social': '#e91e63',
    'Mind': '#9c27b0',
  }
  return colorMap[category] || '#8a2be2'
}

// Shape mapping based on frequency
const getShapeFromFrequency = (frequency: string): 'helix' | 'sphere' | 'cube' | 'pyramid' => {
  const shapeMap: Record<string, 'helix' | 'sphere' | 'cube' | 'pyramid'> = {
    'Daily': 'helix',
    'Weekdays': 'cube',
    'Weekends': 'pyramid',
    'Custom': 'sphere',
  }
  return shapeMap[frequency] || 'sphere'
}

// Calculate DNA shape path
const calculateDNAShape = (segments: DNASegment[]): string => {
  if (segments.length === 0) return 'M 0 0'
  
  const width = 300
  const height = 400
  const amplitude = 50
  const frequency = segments.length / 10
  
  let path = `M 0 ${height / 2}`
  
  for (let i = 0; i <= segments.length * 10; i++) {
    const x = (i / (segments.length * 10)) * width
    const y = height / 2 + Math.sin(i * frequency) * amplitude
    path += ` L ${x} ${y}`
  }
  
  return path
}

// Calculate complexity score
const calculateComplexity = (habits: Habit[]): number => {
  if (habits.length === 0) return 0
  
  const habitCount = habits.length
  const avgStreak = habits.reduce((sum, h) => sum + (h.streak || 0), 0) / habits.length
  const categoryCount = new Set(habits.map(h => h.category)).size
  const totalCompletions = habits.reduce((sum, h) => sum + (h.completed || 0), 0)
  
  const complexity = Math.min(
    100,
    (habitCount * 5) + 
    (avgStreak * 2) + 
    (categoryCount * 10) + 
    (totalCompletions * 0.5)
  )
  
  return Math.round(complexity)
}

// Get dominant colors
const getDominantColors = (segments: DNASegment[]): string[] => {
  const colorCounts = segments.reduce((acc, seg) => {
    acc[seg.color] = (acc[seg.color] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return Object.entries(colorCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([color]) => color)
}

// Default mutations available
const DEFAULT_MUTATIONS: Mutation[] = [
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak on any habit',
    triggerCondition: 'streak >= 7',
    visualEffect: 'fire-glow',
    icon: '🔥',
  },
  {
    id: 'month-master',
    name: 'Month Master',
    description: 'Maintain a 30-day streak on any habit',
    triggerCondition: 'streak >= 30',
    visualEffect: 'golden-shine',
    icon: '⭐',
  },
  {
    id: 'category-king',
    name: 'Category King',
    description: 'Complete 5 habits in one category',
    triggerCondition: 'categoryHabits >= 5',
    visualEffect: 'rainbow-gradient',
    icon: '👑',
  },
  {
    id: 'century-club',
    name: 'Century Club',
    description: 'Reach 100 total completions',
    triggerCondition: 'totalCompletions >= 100',
    visualEffect: 'sparkle-burst',
    icon: '💯',
  },
  {
    id: 'consistent-champion',
    name: 'Consistent Champion',
    description: 'Maintain 10+ active habits',
    triggerCondition: 'habitCount >= 10',
    visualEffect: 'pulse-wave',
    icon: '🏆',
  },
  {
    id: 'year-legend',
    name: 'Year Legend',
    description: 'Maintain a 365-day streak',
    triggerCondition: 'streak >= 365',
    visualEffect: 'legendary-aura',
    icon: '🌟',
  },
]

export const useDNAStore = create<DNAStore>()(
  persist(
    (set, get) => ({
      dna: null,
      availableMutations: DEFAULT_MUTATIONS,
      
      generateDNA: (habits: Habit[]) => {
        const segments: DNASegment[] = habits.map((habit) => ({
          id: habit.id,
          color: getCategoryColor(habit.category),
          size: Math.max(5, Math.min(20, (habit.streak || 1) / 2)),
          shape: getShapeFromFrequency(habit.frequency),
          category: habit.category,
          earnedAt: habit.createdAt,
          unlocked: true,
          habitName: habit.name,
          streak: habit.streak || 0,
        }))
        
        const dna: HabitDNA = {
          userId: 'user-1',
          segments,
          overallShape: calculateDNAShape(segments),
          complexity: calculateComplexity(habits),
          dominantColors: getDominantColors(segments),
          mutations: [],
          lastUpdated: new Date().toISOString(),
        }
        
        // Check for unlocked mutations
        const unlockedMutations: Mutation[] = []
        const maxStreak = Math.max(...habits.map(h => h.streak || 0), 0)
        const totalCompletions = habits.reduce((sum, h) => sum + (h.completed || 0), 0)
        const categoryCounts = habits.reduce((acc, h) => {
          acc[h.category] = (acc[h.category] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        const maxCategoryCount = Math.max(...Object.values(categoryCounts), 0)
        
        DEFAULT_MUTATIONS.forEach(mutation => {
          let unlocked = false
          
          if (mutation.id === 'week-warrior' && maxStreak >= 7) unlocked = true
          if (mutation.id === 'month-master' && maxStreak >= 30) unlocked = true
          if (mutation.id === 'category-king' && maxCategoryCount >= 5) unlocked = true
          if (mutation.id === 'century-club' && totalCompletions >= 100) unlocked = true
          if (mutation.id === 'consistent-champion' && habits.length >= 10) unlocked = true
          if (mutation.id === 'year-legend' && maxStreak >= 365) unlocked = true
          
          if (unlocked) {
            unlockedMutations.push({
              ...mutation,
              unlockedAt: mutation.unlockedAt || new Date().toISOString(),
            })
          }
        })
        
        dna.mutations = unlockedMutations
        set({ dna })
      },
      
      updateDNA: () => {
        // This would need access to habit store
        // For now, we'll just update the timestamp
        set((state) => {
          if (!state.dna) return state
          return {
            dna: {
              ...state.dna,
              lastUpdated: new Date().toISOString(),
            },
          }
        })
      },
      
      unlockMutation: (mutationId: string) => {
        set((state) => {
          const mutation = state.availableMutations.find(m => m.id === mutationId)
          if (!mutation || !state.dna) return state
          
          const alreadyUnlocked = state.dna.mutations.some(m => m.id === mutationId)
          if (alreadyUnlocked) return state
          
          return {
            dna: {
              ...state.dna,
              mutations: [
                ...state.dna.mutations,
                {
                  ...mutation,
                  unlockedAt: new Date().toISOString(),
                },
              ],
            },
          }
        })
      },
      
      shareDNA: async () => {
        // Placeholder for sharing functionality
        // Would use react-native-view-shot or similar
        return 'shared-dna-url'
      },
    }),
    {
      name: 'dna-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
