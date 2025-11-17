import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HabitModal from '../habits/habit-modal-wrapper';
import ReminderModal from '../reminders/reminder-modal-wrapper';

export default function HomeHeader() {
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Welcome back, User</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => setIsHabitModalOpen(true)}
          >
            <Ionicons name="add" size={16} color="#ffffff" />
            <Text style={styles.addButtonText}>Quick Add Habit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => setIsReminderModalOpen(true)}
          >
            <Ionicons name="add" size={16} color="#ffffff" />
            <Text style={styles.addButtonText}>Quick Add Reminder</Text>
          </TouchableOpacity>
        </View>
      </View>

      <HabitModal visible={isHabitModalOpen} onClose={() => setIsHabitModalOpen(false)} />
      <ReminderModal visible={isReminderModalOpen} onClose={() => setIsReminderModalOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8a2be2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
});