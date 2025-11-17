import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AnalyticsPage() {
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
          <Text style={styles.statValue}>85%</Text>
          <Text style={styles.statLabel}>Overall Completion</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Ionicons name="flame" size={24} color="#ff9800" />
          </View>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statIcon}>
            <Ionicons name="calendar" size={24} color="#2196f3" />
          </View>
          <Text style={styles.statValue}>28</Text>
          <Text style={styles.statLabel}>Days Tracked</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Weekly Progress</Text>
        <View style={styles.placeholderChart}>
          <Ionicons name="bar-chart" size={48} color="#666" />
          <Text style={styles.placeholderText}>Chart implementation would go here</Text>
          <Text style={styles.placeholderSubtext}>Using react-native-chart-kit or Victory Native</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Habit Categories</Text>
        <View style={styles.placeholderChart}>
          <Ionicons name="pie-chart" size={48} color="#666" />
          <Text style={styles.placeholderText}>Category distribution chart</Text>
          <Text style={styles.placeholderSubtext}>Showing habits by category</Text>
        </View>
      </View>

      <View style={styles.insightsContainer}>
        <Text style={styles.sectionTitle}>Insights</Text>
        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Ionicons name="bulb" size={20} color="#ffc107" />
            <Text style={styles.insightTitle}>Best Performance</Text>
          </View>
          <Text style={styles.insightText}>
            You're most consistent with morning habits, with a 92% completion rate.
          </Text>
        </View>

        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Ionicons name="target" size={20} color="#8a2be2" />
            <Text style={styles.insightTitle}>Focus Area</Text>
          </View>
          <Text style={styles.insightText}>
            Consider adjusting your evening habits - they have a 65% completion rate.
          </Text>
        </View>
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
  chartContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
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