import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useHabitStore } from '../../store/habit-store';
import { calculateCompletionRate, getTodayProgress } from '../../lib/habit-utils';
import CircularProgress from './circular-progress';

export default function StatCards() {
  const { habits } = useHabitStore();
  const [todayProgress, setTodayProgress] = useState({ percentage: 0, completed: 0, total: 0 });
  const [weeklyProgress, setWeeklyProgress] = useState({ percentage: 0, completed: 0, total: 0 });
  const [streakProgress, setStreakProgress] = useState({ percentage: 0, avgStreak: 0 });

  useEffect(() => {
    // Calculate today's progress using the utility function
    const todayProgressData = getTodayProgress(habits);
    const todayPercentage = calculateCompletionRate(habits, "today");
    setTodayProgress({
      percentage: todayPercentage,
      completed: todayProgressData.completed,
      total: todayProgressData.total,
    });

    // Calculate weekly progress
    const weeklyPercentage = calculateCompletionRate(habits, "week");
    const weeklyTotal = habits.reduce((sum, habit) => sum + (habit.days?.length || 7), 0);
    const weeklyCompleted = habits.reduce((sum, habit) => sum + (habit.weeklyCompleted || 0), 0);
    setWeeklyProgress({
      percentage: weeklyPercentage,
      completed: weeklyCompleted,
      total: weeklyTotal,
    });

    // Calculate streak progress
    const calculateStreakProgress = () => {
      if (!habits || habits.length === 0) return { percentage: 0, avgStreak: 0 };

      const totalStreak = habits.reduce((sum, habit) => sum + (habit.streak || 0), 0);
      const avgStreak = Math.round(totalStreak / habits.length);
      const percentage = Math.min(100, Math.round((avgStreak / 30) * 100));

      return { percentage, avgStreak };
    };

    setStreakProgress(calculateStreakProgress());
  }, [habits]);

  return (
    <View style={styles.gridContainer}>
      {/* Today's Habits Stat Card */}
      <View style={styles.statCard}>
        <CircularProgress 
          percentage={todayProgress.percentage} 
          color="#8a2be2"
          text={`${todayProgress.percentage}%`}
        />
        <Text style={styles.statValue}>
          {todayProgress.completed}/{todayProgress.total}
        </Text>
        <Text style={styles.statLabel}>Today's Habits</Text>
      </View>

      {/* Weekly Completion Stat Card */}
      <View style={styles.statCard}>
        <CircularProgress 
          percentage={weeklyProgress.percentage} 
          color="#4caf50"
          text={`${weeklyProgress.percentage}%`}
        />
        <Text style={styles.statValue}>
          {weeklyProgress.completed}/{weeklyProgress.total}
        </Text>
        <Text style={styles.statLabel}>Weekly Completion</Text>
      </View>

      {/* Current Streak Stat Card */}
      <View style={styles.statCard}>
        <CircularProgress 
          percentage={streakProgress.percentage} 
          color="#2196f3"
          text={`${streakProgress.percentage}%`}
        />
        <Text style={styles.statValue}>{streakProgress.avgStreak}</Text>
        <Text style={styles.statLabel}>Current Streak (Days)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 12,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 13,
    color: '#888888',
    textAlign: 'center',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});