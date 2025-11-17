import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHabitStore } from '../../store/habit-store';
import HabitModal from '../../components/habits/habit-modal-wrapper';
import WeeklyProgress from '../../components/habits/WeeklyProgress';
import { analyzeOptimalTime } from '../../lib/time-analyzer';
import { getCompletionTrend, getTrendIcon, getTrendColor } from '../../lib/trend-analyzer';

export default function HabitsPage() {
  const { habits, deleteHabit, markHabitComplete } = useHabitStore();
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleDeleteHabit = (habitId: string, habitName: string) => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habitName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteHabit(habitId),
        },
      ]
    );
  };

  const handleCompleteHabit = (habitId: string, habitName: string) => {
    markHabitComplete(habitId);
    Alert.alert('Success', `"${habitName}" marked complete for today.`);
  };

  const getTodayStatus = (habit: any) => {
    const today = new Date().toISOString().split('T')[0];
    return habit.lastCompletedDate === today;
  };

  const renderHabit = ({ item }: { item: any }) => {
    const isCompletedToday = getTodayStatus(item);
    const optimalTime = analyzeOptimalTime(item);
    const trend = getCompletionTrend(item);
    const trendIcon = getTrendIcon(trend);
    const trendColor = getTrendColor(trend);
    const habitColor = item.color || '#8a2be2';
    
    return (
      <View style={[styles.habitCard, { borderLeftWidth: 4, borderLeftColor: habitColor }]}>
        <View style={styles.habitInfo}>
          <View style={styles.habitHeader}>
            <Text style={styles.habitName}>{item.name}</Text>
            <View style={[styles.statusDot, { backgroundColor: isCompletedToday ? '#4caf50' : '#666' }]} />
          </View>
          
          <View style={styles.habitDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="pricetag" size={14} color="#b3b3b3" />
              <Text style={styles.detailText}>{item.category}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="time" size={14} color="#b3b3b3" />
              <Text style={styles.detailText}>{item.time || 'No time set'}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={14} color="#b3b3b3" />
              <Text style={styles.detailText}>{item.frequency}</Text>
            </View>
          </View>

          {optimalTime !== 'Not enough data yet' && (
            <View style={styles.suggestion}>
              <Text style={styles.suggestionText}>💡 {optimalTime}</Text>
            </View>
          )}

          <View style={styles.trendRow}>
            <Text style={[styles.trendText, { color: trendColor }]}>
              {trendIcon} Trend: {trend === 'up' ? 'Improving' : trend === 'down' ? 'Declining' : 'Stable'}
            </Text>
          </View>

          <WeeklyProgress habit={item} />
          
          <View style={styles.habitStats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{item.streak || 0}</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{item.completed || 0}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.habitActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.completeButton, isCompletedToday && styles.completedButton]}
            onPress={() => handleCompleteHabit(item.id, item.name)}
            disabled={isCompletedToday}
          >
            <Ionicons 
              name={isCompletedToday ? "checkmark-done" : "checkmark"} 
              size={20} 
              color="#ffffff" 
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteHabit(item.id, item.name)}
          >
            <Ionicons name="trash" size={20} color="#f44336" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Habits</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowModal(true)}
        >
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.addButtonText}>Add Habit</Text>
        </TouchableOpacity>
      </View>

      {habits.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="checkbox-outline" size={64} color="#666" />
          <Text style={styles.emptyTitle}>No habits yet</Text>
          <Text style={styles.emptySubtitle}>
            Create your first habit to start tracking your progress
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => setShowModal(true)}
          >
            <Text style={styles.emptyButtonText}>Create First Habit</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={habits}
          renderItem={renderHabit}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <HabitModal visible={showModal} onClose={() => setShowModal(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8a2be2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  listContainer: {
    gap: 12,
  },
  habitCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  habitInfo: {
    flex: 1,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  habitName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  habitDetails: {
    gap: 4,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#b3b3b3',
  },
  habitStats: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 12,
    color: '#b3b3b3',
  },
  habitActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: '#8a2be2',
  },
  completedButton: {
    backgroundColor: '#4caf50',
  },
  deleteButton: {
    backgroundColor: '#252525',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#b3b3b3',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyButton: {
    backgroundColor: '#8a2be2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  suggestion: {
    marginTop: 8,
    marginBottom: 4,
  },
  suggestionText: {
    fontSize: 12,
    color: '#ffc107',
    fontStyle: 'italic',
  },
  trendRow: {
    marginTop: 4,
    marginBottom: 8,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
});