import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useHabitStore } from '../../store/habit-store';
import ColorPicker from './ColorPicker';

interface HabitModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function HabitModal({ visible, onClose }: HabitModalProps) {
  const { addHabit, categories, addCategory } = useHabitStore();
  const [habitName, setHabitName] = useState('');
  const [habitTime, setHabitTime] = useState('');
  const [habitFrequency, setHabitFrequency] = useState('daily');
  const [habitCategory, setHabitCategory] = useState(categories[0] || '');
  const [newCategory, setNewCategory] = useState('');
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [habitReminder, setHabitReminder] = useState(false);
  const [habitColor, setHabitColor] = useState('#8a2be2');
  const [selectedDays, setSelectedDays] = useState<Record<string, boolean>>({
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false,
  });

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempTime, setTempTime] = useState(new Date());

  const daysOfWeek = Object.keys(selectedDays);

  const handleDayChange = (day: string) => {
    setSelectedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }));
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      setHabitTime(timeString);
    }
  };

  const handleSubmit = () => {
    if (!habitName.trim()) {
      Alert.alert('Error', 'Please enter a habit name');
      return;
    }

    if (habitFrequency === 'custom') {
      const selectedDayCount = Object.values(selectedDays).filter(Boolean).length;
      if (selectedDayCount === 0) {
        Alert.alert('Error', 'Please select at least one day');
        return;
      }
    }

    const selectedDaysArray = habitFrequency === 'daily' 
      ? daysOfWeek 
      : habitFrequency === 'weekdays'
      ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
      : habitFrequency === 'weekends'
      ? ['Saturday', 'Sunday']
      : Object.keys(selectedDays).filter(day => selectedDays[day]);

    const habit = {
      name: habitName.trim(),
      time: habitTime,
      frequency: habitFrequency,
      days: selectedDaysArray,
      category: habitCategory,
      reminder: habitReminder,
      completed: 0,
      streak: 0,
      lastCompletedDate: null,
      weeklyCompleted: 0,
      createdAt: new Date().toISOString(),
      color: habitColor,
    };

    addHabit(habit);
    Alert.alert('Success', 'Habit added successfully!');
    handleClose();
  };

  const handleClose = () => {
    setHabitName('');
    setHabitTime('');
    setHabitFrequency('daily');
    setHabitCategory(categories[0] || '');
    setNewCategory('');
    setIsAddingNewCategory(false);
    setHabitReminder(false);
    setHabitColor('#8a2be2');
    setSelectedDays({
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
      Sunday: false,
    });
    onClose();
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }
    addCategory(newCategory.trim());
    setHabitCategory(newCategory.trim());
    setNewCategory('');
    setIsAddingNewCategory(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.title}>Add New Habit</Text>
          <TouchableOpacity onPress={handleSubmit} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Habit Name</Text>
            <TextInput
              style={styles.input}
              value={habitName}
              onChangeText={setHabitName}
              placeholder="Enter habit name"
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Category</Text>
            {!isAddingNewCategory ? (
              <View style={styles.categoryContainer}>
                <TouchableOpacity
                  style={styles.categorySelector}
                  onPress={() => setIsAddingNewCategory(true)}
                >
                  <Text style={styles.categoryText}>{habitCategory || 'Select category'}</Text>
                  <Ionicons name="chevron-down" size={16} color="#b3b3b3" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.newCategoryContainer}>
                <TextInput
                  style={styles.input}
                  value={newCategory}
                  onChangeText={setNewCategory}
                  placeholder="New category name"
                  placeholderTextColor="#666"
                />
                <View style={styles.categoryButtons}>
                  <TouchableOpacity onPress={handleAddCategory} style={styles.addButton}>
                    <Text style={styles.addButtonText}>Add</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setIsAddingNewCategory(false)} style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Frequency</Text>
            <View style={styles.frequencyContainer}>
              {['daily', 'weekdays', 'weekends', 'custom'].map((freq) => (
                <TouchableOpacity
                  key={freq}
                  style={[
                    styles.frequencyButton,
                    habitFrequency === freq && styles.frequencyButtonActive,
                  ]}
                  onPress={() => setHabitFrequency(freq)}
                >
                  <Text
                    style={[
                      styles.frequencyButtonText,
                      habitFrequency === freq && styles.frequencyButtonTextActive,
                    ]}
                  >
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {habitFrequency === 'custom' && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>Select Days</Text>
              <View style={styles.daysContainer}>
                {daysOfWeek.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayButton,
                      selectedDays[day] && styles.dayButtonActive,
                    ]}
                    onPress={() => handleDayChange(day)}
                  >
                    <Text
                      style={[
                        styles.dayButtonText,
                        selectedDays[day] && styles.dayButtonTextActive,
                      ]}
                    >
                      {day.slice(0, 3)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.formGroup}>
            <Text style={styles.label}>Time</Text>
            <TouchableOpacity
              style={styles.timeSelector}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.timeText}>{habitTime || 'Select time'}</Text>
              <Ionicons name="time" size={16} color="#b3b3b3" />
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <ColorPicker selectedColor={habitColor} onColorSelect={setHabitColor} />
          </View>

          <View style={styles.formGroup}>
            <View style={styles.reminderContainer}>
              <Text style={styles.label}>Enable Reminder</Text>
              <Switch
                value={habitReminder}
                onValueChange={setHabitReminder}
                trackColor={{ false: '#333', true: '#8a2be2' }}
                thumbColor={habitReminder ? '#ffffff' : '#b3b3b3'}
              />
            </View>
          </View>
        </ScrollView>

        {showTimePicker && (
          <DateTimePicker
            value={tempTime}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  closeButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#8a2be2',
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#333',
  },
  categoryContainer: {
    position: 'relative',
  },
  categorySelector: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  categoryText: {
    fontSize: 16,
    color: '#ffffff',
  },
  newCategoryContainer: {
    gap: 12,
  },
  categoryButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#8a2be2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#333',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  frequencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  frequencyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#333',
  },
  frequencyButtonActive: {
    backgroundColor: '#8a2be2',
    borderColor: '#8a2be2',
  },
  frequencyButtonText: {
    color: '#b3b3b3',
    fontWeight: '500',
  },
  frequencyButtonTextActive: {
    color: '#ffffff',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayButton: {
    width: 60,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#1e1e1e',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  dayButtonActive: {
    backgroundColor: '#8a2be2',
    borderColor: '#8a2be2',
  },
  dayButtonText: {
    color: '#b3b3b3',
    fontWeight: '500',
    fontSize: 12,
  },
  dayButtonTextActive: {
    color: '#ffffff',
  },
  timeSelector: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  timeText: {
    fontSize: 16,
    color: '#ffffff',
  },
  reminderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});