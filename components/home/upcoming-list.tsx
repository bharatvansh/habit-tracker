import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useReminderStore } from '../../store/reminder-store';
import { useHabitStore } from '../../store/habit-store';
import { useDNAStore } from '../../store/habit-dna-store';

interface UpcomingItem {
  type: "reminder" | "habit";
  title: string;
  hour: number;
  minute: string;
  ampm: string;
  alarm?: boolean;
  notification?: boolean;
  tags?: string;
  id: string;
}

export default function UpcomingList({ showHeader = false }: { showHeader?: boolean }) {
  const { reminders } = useReminderStore();
  const { habits, markHabitComplete } = useHabitStore();
  const { generateDNA } = useDNAStore();
  const [upcomingItems, setUpcomingItems] = useState<UpcomingItem[]>([]);

  useEffect(() => {
    const now = new Date();
    const todayDayName = now.toLocaleDateString("en-US", { weekday: "long" });

    // Process reminders for today
    const todayReminders = reminders
      .filter((reminder) => {
        const reminderDate = new Date(reminder.datetime);
        return reminderDate.toDateString() === now.toDateString() && reminderDate.getTime() > now.getTime();
      })
      .map((reminder, index) => {
        const reminderDate = new Date(reminder.datetime);
        let hour = reminderDate.getHours();
        const minute = reminderDate.getMinutes();
        const ampm = hour >= 12 ? "PM" : "AM";
        hour = hour % 12;
        if (hour === 0) hour = 12;
        const minuteStr = minute < 10 ? "0" + minute : minute.toString();

        return {
          type: "reminder" as const,
          title: reminder.title,
          hour,
          minute: minuteStr,
          ampm,
          alarm: reminder.alarm,
          notification: reminder.notification,
          id: index.toString(),
        };
      });

    // Process habits for today
    const todayHabits = habits
      .filter((habit) => {
        const todayStr = now.toISOString().split("T")[0];
        const todayDayName = now.toLocaleDateString("en-US", { weekday: "long" });
        return habit.days?.includes(todayDayName) && habit.lastCompletedDate !== todayStr;
      })
      .map((habit) => {
        let hour24 = 8;
        let minute = 0;
        if (habit.time && /^\d{2}:\d{2}$/.test(habit.time)) {
          const [h, m] = habit.time.split(":");
          hour24 = Number.parseInt(h, 10);
          minute = Number.parseInt(m, 10);
        }
        const ampm = hour24 >= 12 ? "PM" : "AM";
        let hour12 = hour24 % 12;
        if (hour12 === 0) hour12 = 12;
        const minuteStr = minute < 10 ? "0" + minute : String(minute);
        return {
          type: "habit" as const,
          title: habit.name,
          hour: hour12,
          minute: minuteStr,
          ampm,
          tags: (habit as any).tags,
          id: habit.id,
        };
      });

    // Combine and sort by time
    const combinedItems = [...todayReminders, ...todayHabits].sort((a, b) => {
      // Sort by AM/PM first
      if (a.ampm !== b.ampm) return a.ampm === "AM" ? -1 : 1;
      // Then by hour
      if (a.hour !== b.hour) return a.hour - b.hour;
      // Then by minute
      return Number.parseInt(a.minute) - Number.parseInt(b.minute);
    });

    setUpcomingItems(combinedItems);
  }, [reminders, habits]);

  const handleCompleteHabit = (id: string, title: string) => {
    markHabitComplete(id);
    // Regenerate DNA after habit completion
    setTimeout(() => {
      generateDNA(habits);
    }, 100);
    Alert.alert("Habit completed", `"${title}" marked complete for today.`);
  };

  if (upcomingItems.length === 0) {
    return (
      <View style={styles.noItemsContainer}>
        <Ionicons name="calendar" size={48} color="#4a4a4a" style={styles.noItemsIcon} />
        <Text style={styles.noItemsText}>
          No upcoming habits or reminders for today. Add some to see them here.
        </Text>
      </View>
    );
  }

  return (
    <View>
      {upcomingItems.map((item, index) => (
        <View key={`${item.type}-${item.id}-${index}`} style={styles.upcomingItem}>
          <View style={styles.upcomingTime}>
            <Text style={styles.hour}>
              {item.hour}:{item.minute}
            </Text>
            <Text style={styles.ampm}>{item.ampm}</Text>
          </View>
          <View style={styles.upcomingInfo}>
            <View style={styles.upcomingTitle}>
              {item.type === "habit" && (
                <View style={[styles.tag, { backgroundColor: 'rgba(138, 43, 226, 0.2)' }]}>
                  <Text style={styles.tagText}>Habit</Text>
                </View>
              )}
              {item.type === "reminder" && (
                <View style={[styles.tag, { backgroundColor: 'rgba(33, 150, 243, 0.2)' }]}>
                  <Text style={[styles.tagText, { color: '#2196f3' }]}>Reminder</Text>
                </View>
              )}
              <Text style={styles.titleText}>{item.title}</Text>
            </View>
            <View style={styles.upcomingMeta}>
              {item.type === "reminder" && (item.alarm || item.notification) && (
                <Text style={styles.metaText}>
                  {item.alarm && (
                    <><Ionicons name="notifications" size={12} color="#b3b3b3" /> Alarm</>
                  )}
                  {item.alarm && item.notification && " | "}
                  {item.notification && "Notification"}
                </Text>
              )}
              {item.type === "habit" && item.tags && (
                <Text style={styles.metaText}>
                  <Ionicons name="pricetag" size={12} color="#b3b3b3" /> {item.tags.split(",")[0].trim()}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.upcomingActions}>
            {item.type === "habit" && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleCompleteHabit(item.id, item.title)}
              >
                <Ionicons name="checkmark" size={16} color="#4caf50" />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="ellipsis-horizontal" size={16} color="#b3b3b3" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  upcomingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  upcomingTime: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 60,
  },
  hour: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  ampm: {
    fontSize: 12,
    color: '#b3b3b3',
    marginTop: 2,
  },
  upcomingInfo: {
    flex: 1,
  },
  upcomingTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  tag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#ffffff',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    flex: 1,
  },
  upcomingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#b3b3b3',
    flexDirection: 'row',
    alignItems: 'center',
  },
  upcomingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#252525',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noItemsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    width: '100%',
  },
  noItemsIcon: {
    marginBottom: 20,
  },
  noItemsText: {
    color: '#7a7a7a',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
  },
});