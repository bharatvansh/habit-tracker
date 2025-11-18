import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useHabitStore } from '../../store/habit-store';
import { Ionicons } from '@expo/vector-icons';

interface DayHabit {
  name: string;
  completed: boolean;
  category: string;
}

interface WeekDay {
  name: string;
  date: number;
  isToday: boolean;
  habits: DayHabit[];
}

export default function WeeklyView() {
  const { habits } = useHabitStore();
  const [weekDays, setWeekDays] = useState<WeekDay[]>([]);

  useEffect(() => {
    // Calculate the week days and habits for each day
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today);
    monday.setDate(diff);

    const days: WeekDay[] = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(monday);
      currentDay.setDate(monday.getDate() + i);
      const dayName = currentDay.toLocaleDateString("en-US", { weekday: "short" });
      const dayDate = currentDay.getDate();
      const isToday = currentDay.toDateString() === today.toDateString();
      const weekdayFull = currentDay.toLocaleDateString("en-US", { weekday: "long" });

      // Filter habits that are scheduled for this day AND were created on or before this day
      const dayHabits = habits
        .filter((habit) => {
          // Get the habit creation date, default to today if not available
          const habitCreatedAt = habit.createdAt ? new Date(habit.createdAt) : new Date();

          // Reset time portion to compare just the dates
          habitCreatedAt.setHours(0, 0, 0, 0);
          const dayToCompare = new Date(currentDay);
          dayToCompare.setHours(0, 0, 0, 0);

          // Only show habits on days that are scheduled AND on or after the habit was created
          return habit.days && habit.days.includes(weekdayFull) && dayToCompare >= habitCreatedAt;
        })
        .map((habit) => ({
          name: habit.name,
          completed: habit.lastCompletedDate === currentDay.toISOString().split("T")[0],
          category: habit.category,
        }));

      days.push({
        name: dayName,
        date: dayDate,
        isToday,
        habits: dayHabits,
      });
    }

    setWeekDays(days);
  }, [habits]);

  // Check if there are any habits scheduled for the week
  const hasHabitsThisWeek = weekDays.some((day) => day.habits.length > 0);

  return (
    <View style={styles.container}>
      {/* Days header */}
      <View style={styles.daysRow}>
        {weekDays.map((day, index) => (
          <View key={index} style={[styles.dayColumn, index === 0 && styles.firstColumn, index === 6 && styles.lastColumn]}>
            <Text style={styles.dayName}>{day.name}</Text>
            <View style={[styles.dayDate, day.isToday && styles.today]}>
              <Text style={[styles.dayDateText, day.isToday && styles.todayText]}>
                {day.date}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Habits */}
      {hasHabitsThisWeek ? (
        <View style={styles.habitsRow}>
          {weekDays.map((day, index) => (
            <View key={`habits-${index}`} style={[styles.dayColumn, index === 0 && styles.firstColumn, index === 6 && styles.lastColumn]}>
              <View style={styles.dayHabits}>
                {day.habits.map((habit, habitIndex) => (
                  <View
                    key={habitIndex}
                    // @ts-ignore - className works on web
                    className="dayHabit"
                    style={[
                      styles.dayHabit,
                      habit.completed && styles.completedHabit
                    ]}
                  >
                    <Text
                      style={[
                        styles.habitText,
                        habit.completed && styles.completedHabitText
                      ]}
                      numberOfLines={2}
                    >
                      {habit.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.noHabitsContainer}>
          <Ionicons name="calendar-outline" size={48} color="#444444" style={styles.noHabitsIcon} />
          <Text style={styles.noHabitsText}>
            No habits scheduled for this week. Add habits to see your weekly view.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    paddingHorizontal: 4,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  habitsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 100,
    paddingHorizontal: 4,
  },
  dayColumn: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  firstColumn: {
    marginLeft: 0,
  },
  lastColumn: {
    marginRight: 0,
  },
  dayName: {
    fontSize: 11,
    color: '#999999',
    marginBottom: 10,
    fontWeight: '500',
  },
  dayDate: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#252525',
    justifyContent: 'center',
    alignItems: 'center',
  },
  today: {
    backgroundColor: '#8a2be2',
  },
  dayDateText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  todayText: {
    color: '#ffffff',
  },
  dayHabits: {
    flex: 1,
    width: '100%',
    gap: 8,
  },
  dayHabit: {
    backgroundColor: '#252525',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    minHeight: 44,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  completedHabit: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
  },
  habitText: {
    fontSize: 12,
    color: '#cccccc',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 16,
  },
  completedHabitText: {
    color: '#4caf50',
    textDecorationLine: 'line-through',
  },
  noHabitsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  noHabitsIcon: {
    marginBottom: 16,
    opacity: 0.2,
  },
  noHabitsText: {
    color: '#666666',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 22,
  },
});