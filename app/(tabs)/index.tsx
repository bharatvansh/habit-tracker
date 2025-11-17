import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useHabitStore } from '../../store/habit-store';
import { useReminderStore } from '../../store/reminder-store';
import HomeHeader from '../../components/home/home-header';
import StatCards from '../../components/home/stat-cards';
import WeeklyView from '../../components/home/weekly-view';
import UpcomingList from '../../components/home/upcoming-list';
import DailyGoal from '../../components/home/DailyGoal';

export default function HomePage() {
  const { loadHabits, isLoading: habitsLoading } = useHabitStore();
  const { loadReminders, isLoading: remindersLoading } = useReminderStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    loadHabits();
    loadReminders();
  }, [loadHabits, loadReminders]);

  useEffect(() => {
    if (!habitsLoading && !remindersLoading && isMounted) {
      setIsLoading(false);
    }
  }, [habitsLoading, remindersLoading, isMounted]);

  if (!isMounted) {
    return null;
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#8a2be2" style={styles.spinner} />
          <Text style={styles.loadingText}>Loading your habits and reminders...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HomeHeader />
      <DailyGoal />
      <StatCards />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>This Week</Text>
      </View>
      <WeeklyView />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Upcoming Today</Text>
        <Text style={styles.sectionLink}>Habits & Reminders</Text>
      </View>
      <UpcomingList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingContent: {
    alignItems: 'center',
  },
  spinner: {
    marginBottom: 20,
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  sectionLink: {
    fontSize: 13,
    color: '#888888',
    fontWeight: '500',
  },
});