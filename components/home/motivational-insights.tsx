import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useHabitStore } from '../../store/habit-store';

interface Insight {
  emoji: string;
  message: string;
  submessage: string;
}

export default function MotivationalInsights() {
  const { habits } = useHabitStore();
  const [currentInsight, setCurrentInsight] = useState<Insight | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const generatedInsights = generateInsights();
    setInsights(generatedInsights);
    if (generatedInsights.length > 0) {
      setCurrentInsight(generatedInsights[0]);
    }
  }, [habits]);

  useEffect(() => {
    if (insights.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % insights.length;
        setCurrentInsight(insights[next]);
        return next;
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [insights]);

  const generateInsights = (): Insight[] => {
    const insights: Insight[] = [];
    const today = new Date().toISOString().split('T')[0];
    const todayDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    // Check for streaks
    const habitsWithStreaks = habits.filter((h) => (h.streak || 0) >= 3);
    if (habitsWithStreaks.length > 0) {
      const bestStreak = habitsWithStreaks.reduce((max, h) => 
        (h.streak || 0) > (max.streak || 0) ? h : max
      );
      insights.push({
        emoji: '🔥',
        message: `${bestStreak.streak}-day streak with ${bestStreak.name}!`,
        submessage: 'Keep the momentum going!',
      });
    }

    // Check for perfect day
    const todaysHabits = habits.filter((h) => h.days?.includes(todayDayName));
    const completedToday = todaysHabits.filter((h) => h.lastCompletedDate === today);
    if (todaysHabits.length > 0 && completedToday.length === todaysHabits.length) {
      insights.push({
        emoji: '🎉',
        message: 'Perfect day! All habits completed!',
        submessage: 'You\'re crushing it today!',
      });
    }

    // Check for near completion
    if (todaysHabits.length > 0 && completedToday.length > 0) {
      const percentage = (completedToday.length / todaysHabits.length) * 100;
      if (percentage >= 80 && percentage < 100) {
        const remaining = todaysHabits.length - completedToday.length;
        insights.push({
          emoji: '⚡',
          message: `${remaining} habit${remaining > 1 ? 's' : ''} left to complete today!`,
          submessage: 'You\'re almost there!',
        });
      }
    }

    // Check weekly performance
    const weeklyCompleted = habits.reduce((sum, h) => sum + (h.weeklyCompleted || 0), 0);
    const weeklyTotal = habits.reduce((sum, h) => sum + (h.days?.length || 7), 0);
    if (weeklyTotal > 0) {
      const weeklyPercentage = (weeklyCompleted / weeklyTotal) * 100;
      if (weeklyPercentage >= 70) {
        insights.push({
          emoji: '🎯',
          message: `${Math.round(weeklyPercentage)}% weekly completion rate!`,
          submessage: 'Excellent consistency this week!',
        });
      }
    }

    // Check for consistency (habits completed in last 5 days)
    const last5Days = Array.from({ length: 5 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });
    
    const consistentHabits = habits.filter((h) => {
      const completionDates = h.completionHistory?.map(c => c.date) || [];
      const recentCompletions = last5Days.filter(d => completionDates.includes(d));
      return recentCompletions.length >= 4;
    });

    if (consistentHabits.length > 0) {
      insights.push({
        emoji: '💪',
        message: `${consistentHabits.length} habit${consistentHabits.length > 1 ? 's' : ''} with amazing consistency!`,
        submessage: 'Your dedication is paying off!',
      });
    }

    // Default encouragement
    if (insights.length === 0) {
      if (habits.length === 0) {
        insights.push({
          emoji: '🌟',
          message: 'Ready to build great habits?',
          submessage: 'Start by adding your first habit!',
        });
      } else if (todaysHabits.length === 0) {
        insights.push({
          emoji: '😌',
          message: 'No habits scheduled for today',
          submessage: 'Enjoy your rest day!',
        });
      } else if (completedToday.length === 0) {
        insights.push({
          emoji: '🚀',
          message: `${todaysHabits.length} habit${todaysHabits.length > 1 ? 's' : ''} waiting for you today!`,
          submessage: 'Let\'s make today count!',
        });
      } else {
        insights.push({
          emoji: '✨',
          message: 'Great progress today!',
          submessage: 'Every small step counts!',
        });
      }
    }

    return insights;
  };

  if (!currentInsight) return null;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        if (insights.length > 1) {
          const next = (currentIndex + 1) % insights.length;
          setCurrentIndex(next);
          setCurrentInsight(insights[next]);
        }
      }}
    >
      <LinearGradient
        colors={['rgba(138, 43, 226, 0.15)', 'rgba(138, 43, 226, 0.05)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.emoji}>{currentInsight.emoji}</Text>
          <View style={styles.textContainer}>
            <Text style={styles.message}>{currentInsight.message}</Text>
            <Text style={styles.submessage}>{currentInsight.submessage}</Text>
          </View>
          {insights.length > 1 && (
            <View style={styles.indicator}>
              <Text style={styles.indicatorText}>
                {currentIndex + 1}/{insights.length}
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.3)',
    shadowColor: '#8a2be2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  emoji: {
    fontSize: 32,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  submessage: {
    fontSize: 13,
    color: '#b3b3b3',
    letterSpacing: 0.1,
  },
  indicator: {
    backgroundColor: 'rgba(138, 43, 226, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  indicatorText: {
    fontSize: 11,
    color: '#b3b3b3',
    fontWeight: '500',
  },
});
