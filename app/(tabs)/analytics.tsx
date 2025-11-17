import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHabitStore } from '../../store/habit-store';
import { calculateCompletionRate, getLongestStreak, getHabitsByCategory } from '../../lib/habit-utils';
import HeatmapCalendar from '../../components/analytics/HeatmapCalendar';
import CategoryInsights from '../../components/analytics/CategoryInsights';

export default function AnalyticsPage() {
  const { habits } = useHabitStore();
  const [analytics, setAnalytics] = useState({
    overallCompletion: 0,
    currentStreak: 0,
    totalHabits: 0,
    completedToday: 0,
    bestCategory: { name: 'None', count: 0 },
    avgCompletionRate: 0,
  });

  useEffect(() => {
    if (habits.length === 0) {
      setAnalytics({
        overallCompletion: 0,
        currentStreak: 0,
        totalHabits: 0,
        completedToday: 0,
        bestCategory: { name: 'None', count: 0 },
        avgCompletionRate: 0,
      });
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const completedToday = habits.filter(h => h.lastCompletedDate === today).length;
    const overallCompletion = calculateCompletionRate(habits, 'month');
    const longestStreak = getLongestStreak(habits);
    const categoryCounts = getHabitsByCategory(habits, [...new Set(habits.map(h => h.category))]);
    
    const bestCategory = Object.entries(categoryCounts).reduce(
      (best, [name, count]) => (count > best.count ? { name, count } : best),
      { name: 'None', count: 0 }
    );

    setAnalytics({
      overallCompletion,
      currentStreak: longestStreak.days,
      totalHabits: habits.length,
      completedToday,
      bestCategory,
      avgCompletionRate: calculateCompletionRate(habits, 'week'),
    });
  }, [habits]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <Text style={styles.subtitle}>Track your progress and insights</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Ionicons name="trending-up" size={24} color="#4caf50" />
          </View>
          <Text style={styles.statValue}>{analytics.overallCompletion}%</Text>
          <Text style={styles.statLabel}>Monthly Completion</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Ionicons name="flame" size={24} color="#ff9800" />
          </View>
          <Text style={styles.statValue}>{analytics.currentStreak}</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Ionicons name="calendar" size={24} color="#2196f3" />
          </View>
          <Text style={styles.statValue}>{analytics.totalHabits}</Text>
          <Text style={styles.statLabel}>Total Habits</Text>
        </View>
      </View>

      <View style={styles.additionalStatsContainer}>
        <View style={styles.additionalStatCard}>
          <View style={styles.additionalStatContent}>
            <Ionicons name="checkmark-circle" size={24} color="#8a2be2" />
            <View style={styles.additionalStatText}>
              <Text style={styles.additionalStatLabel}>Completed Today</Text>
              <Text style={styles.additionalStatValue}>{analytics.completedToday}</Text>
            </View>
          </View>
        </View>

        <View style={styles.additionalStatCard}>
          <View style={styles.additionalStatContent}>
            <Ionicons name="star" size={24} color="#ffc107" />
            <View style={styles.additionalStatText}>
              <Text style={styles.additionalStatLabel}>Best Category</Text>
              <Text style={styles.additionalStatValue}>{analytics.bestCategory.name}</Text>
            </View>
          </View>
        </View>

        <View style={styles.additionalStatCard}>
          <View style={styles.additionalStatContent}>
            <Ionicons name="stats-chart" size={24} color="#4caf50" />
            <View style={styles.additionalStatText}>
              <Text style={styles.additionalStatLabel}>Weekly Avg</Text>
              <Text style={styles.additionalStatValue}>{analytics.avgCompletionRate}%</Text>
            </View>
          </View>
        </View>
      </View>

      {habits.length > 0 && <HeatmapCalendar habits={habits} />}

      {habits.length > 0 && (
        <CategoryInsights 
          habits={habits} 
          categories={[...new Set(habits.map(h => h.category))]} 
        />
      )}

      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Category Distribution</Text>
        <View style={styles.categoryListContainer}>
          {habits.length === 0 ? (
            <View style={styles.emptyChartState}>
              <Ionicons name="pie-chart" size={48} color="#666" />
              <Text style={styles.placeholderText}>No habits yet</Text>
              <Text style={styles.placeholderSubtext}>Add habits to see category distribution</Text>
            </View>
          ) : (
            Object.entries(getHabitsByCategory(habits, [...new Set(habits.map(h => h.category))])).map(([category, count]) => (
              <View key={category} style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.categoryDot, { backgroundColor: ['#8a2be2', '#f44336', '#4caf50', '#2196f3', '#ff9800'][Object.keys(getHabitsByCategory(habits, [...new Set(habits.map(h => h.category))])).indexOf(category) % 5] }]} />
                  <Text style={styles.categoryName}>{category}</Text>
                </View>
                <Text style={styles.categoryCount}>{count} habit{count !== 1 ? 's' : ''}</Text>
              </View>
            ))
          )}
        </View>
      </View>

      <View style={styles.insightsContainer}>
        <Text style={styles.sectionTitle}>Insights & Recommendations</Text>
        {habits.length === 0 ? (
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <Ionicons name="bulb" size={20} color="#ffc107" />
              <Text style={styles.insightTitle}>Get Started</Text>
            </View>
            <Text style={styles.insightText}>
              Create your first habit to start tracking and get personalized insights on your progress.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <Ionicons name="trending-up" size={20} color="#4caf50" />
                <Text style={styles.insightTitle}>Overall Progress</Text>
              </View>
              <Text style={styles.insightText}>
                You've completed {analytics.overallCompletion}% of your habits this month. {analytics.overallCompletion >= 80 ? 'Keep up the excellent work!' : 'Try to increase your completion rate to 80% or higher!'}
              </Text>
            </View>

            {analytics.currentStreak > 0 && (
              <View style={styles.insightCard}>
                <View style={styles.insightHeader}>
                  <Ionicons name="flame" size={20} color="#ff9800" />
                  <Text style={styles.insightTitle}>Current Streak</Text>
                </View>
                <Text style={styles.insightText}>
                  You have a {analytics.currentStreak}-day streak! {analytics.currentStreak >= 7 ? 'Excellent consistency!' : 'Keep pushing to reach a week!'}
                </Text>
              </View>
            )}

            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <Ionicons name="target" size={20} color="#8a2be2" />
                <Text style={styles.insightTitle}>Recommendation</Text>
              </View>
              <Text style={styles.insightText}>
                {analytics.completedToday === 0 
                  ? 'Start your day by completing at least one habit!'
                  : 'Great start today! You\'ve completed ' + analytics.completedToday + ' habit(s) already.'}
              </Text>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#b3b3b3',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#252525',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
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
  additionalStatsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  additionalStatCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  additionalStatContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  additionalStatText: {
    flex: 1,
  },
  additionalStatLabel: {
    fontSize: 12,
    color: '#b3b3b3',
    marginBottom: 4,
  },
  additionalStatValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  chartContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  categoryListContainer: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#252525',
    borderRadius: 8,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  categoryCount: {
    fontSize: 13,
    color: '#b3b3b3',
    fontWeight: '500',
  },
  emptyChartState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  placeholderChart: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
  },
  placeholderSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  insightsContainer: {
    marginBottom: 24,
  },
  insightCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  insightText: {
    fontSize: 14,
    color: '#b3b3b3',
    lineHeight: 20,
  },
});