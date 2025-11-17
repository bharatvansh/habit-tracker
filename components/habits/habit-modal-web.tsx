import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHabitStore } from '../../store/habit-store';

interface HabitModalWebProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HabitModalWeb({ isOpen, onClose }: HabitModalWebProps) {
  const { addHabit, categories, addCategory } = useHabitStore();
  const [step, setStep] = useState(1);
  const [habitName, setHabitName] = useState('');
  const [habitTime, setHabitTime] = useState('09:00');
  const [habitFrequency, setHabitFrequency] = useState('daily');
  const [habitCategory, setHabitCategory] = useState(categories[0] || 'Health');
  const [newCategory, setNewCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [habitReminder, setHabitReminder] = useState(true);
  const [selectedDays, setSelectedDays] = useState<Record<string, boolean>>({
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: true,
    Sunday: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 1) {
      if (!habitName.trim()) {
        newErrors.habitName = 'Please enter a habit name';
      }
      if (!habitCategory) {
        newErrors.habitCategory = 'Please select a category';
      }
    }
    
    if (currentStep === 2) {
      if (habitFrequency === 'custom' && !Object.values(selectedDays).some(Boolean)) {
        newErrors.days = 'Please select at least one day';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = () => {
    if (!validateStep(step)) return;

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
    };

    addHabit(habit);
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setHabitName('');
    setHabitTime('09:00');
    setHabitFrequency('daily');
    setHabitCategory(categories[0] || 'Health');
    setNewCategory('');
    setIsAddingCategory(false);
    setHabitReminder(true);
    setSelectedDays({
      Monday: true,
      Tuesday: true,
      Wednesday: true,
      Thursday: true,
      Friday: true,
      Saturday: true,
      Sunday: true,
    });
    setErrors({});
    onClose();
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory(newCategory.trim());
      setHabitCategory(newCategory.trim());
      setNewCategory('');
      setIsAddingCategory(false);
    }
  };

  if (!isOpen) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconCircle}>
              <Ionicons name="sparkles" size={24} color="#a78bfa" />
            </View>
            <View>
              <Text style={styles.title}>Create New Habit</Text>
              <Text style={styles.subtitle}>Step {step} of 3</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]} />
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {step === 1 && (
            <View style={styles.stepContainer}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  What habit do you want to build? <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.habitName && styles.inputError]}
                  value={habitName}
                  onChangeText={(text) => {
                    setHabitName(text);
                    setErrors(prev => ({ ...prev, habitName: '' }));
                  }}
                  placeholder="e.g., Morning meditation, Drink water, Exercise"
                  placeholderTextColor="#6b7280"
                  autoFocus
                />
                {errors.habitName && (
                  <Text style={styles.errorText}>{errors.habitName}</Text>
                )}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  Category <Text style={styles.required}>*</Text>
                </Text>
                {!isAddingCategory ? (
                  <View>
                    <View style={styles.categoryGrid}>
                      {categories.map((cat) => (
                        <TouchableOpacity
                          key={cat}
                          onPress={() => {
                            setHabitCategory(cat);
                            setErrors(prev => ({ ...prev, habitCategory: '' }));
                          }}
                          style={[
                            styles.categoryButton,
                            habitCategory === cat && styles.categoryButtonActive
                          ]}
                        >
                          <Text style={[
                            styles.categoryButtonText,
                            habitCategory === cat && styles.categoryButtonTextActive
                          ]}>
                            {cat}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <TouchableOpacity
                      onPress={() => setIsAddingCategory(true)}
                      style={styles.addCategoryButton}
                    >
                      <Ionicons name="add" size={20} color="#a78bfa" />
                      <Text style={styles.addCategoryText}>Add Custom Category</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.newCategoryContainer}>
                    <TextInput
                      style={styles.input}
                      value={newCategory}
                      onChangeText={setNewCategory}
                      placeholder="Enter category name"
                      placeholderTextColor="#6b7280"
                    />
                    <View style={styles.categoryActions}>
                      <TouchableOpacity onPress={handleAddCategory} style={styles.addButton}>
                        <Text style={styles.addButtonText}>Add</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setIsAddingCategory(false);
                          setNewCategory('');
                        }}
                        style={styles.cancelButton}
                      >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                {errors.habitCategory && (
                  <Text style={styles.errorText}>{errors.habitCategory}</Text>
                )}
              </View>
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepContainer}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>How often?</Text>
                <View style={styles.frequencyGrid}>
                  {[
                    { value: 'daily', label: 'Every Day', icon: '🌟' },
                    { value: 'weekdays', label: 'Weekdays', icon: '💼' },
                    { value: 'weekends', label: 'Weekends', icon: '🎉' },
                    { value: 'custom', label: 'Custom', icon: '⚙️' },
                  ].map((freq) => (
                    <TouchableOpacity
                      key={freq.value}
                      onPress={() => setHabitFrequency(freq.value)}
                      style={[
                        styles.frequencyButton,
                        habitFrequency === freq.value && styles.frequencyButtonActive
                      ]}
                    >
                      <Text style={styles.frequencyIcon}>{freq.icon}</Text>
                      <Text style={[
                        styles.frequencyLabel,
                        habitFrequency === freq.value && styles.frequencyLabelActive
                      ]}>
                        {freq.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {habitFrequency === 'custom' && (
                <View style={styles.formGroup}>
                  <Text style={styles.label}>
                    Select days <Text style={styles.required}>*</Text>
                  </Text>
                  <View style={styles.daysGrid}>
                    {daysOfWeek.map((day) => (
                      <TouchableOpacity
                        key={day}
                        onPress={() => handleDayToggle(day)}
                        style={[
                          styles.dayButton,
                          selectedDays[day] && styles.dayButtonActive
                        ]}
                      >
                        <Text style={[
                          styles.dayButtonText,
                          selectedDays[day] && styles.dayButtonTextActive
                        ]}>
                          {day.slice(0, 3)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {errors.days && (
                    <Text style={styles.errorText}>{errors.days}</Text>
                  )}
                </View>
              )}
            </View>
          )}

          {step === 3 && (
            <View style={styles.stepContainer}>
              <View style={styles.formGroup}>
                <View style={styles.labelRow}>
                  <Ionicons name="time-outline" size={18} color="#d1d5db" />
                  <Text style={styles.label}>Preferred time</Text>
                </View>
                <TextInput
                  style={styles.input}
                  value={habitTime}
                  onChangeText={setHabitTime}
                  placeholder="09:00"
                  placeholderTextColor="#6b7280"
                />
                <Text style={styles.helpText}>We'll send you a gentle reminder at this time</Text>
              </View>

              <View style={styles.switchContainer}>
                <View>
                  <Text style={styles.switchLabel}>Enable Reminders</Text>
                  <Text style={styles.switchHelp}>Get notified to stay on track</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setHabitReminder(!habitReminder)}
                  style={[styles.switch, habitReminder && styles.switchActive]}
                >
                  <View style={[styles.switchThumb, habitReminder && styles.switchThumbActive]} />
                </TouchableOpacity>
              </View>

              <View style={styles.summary}>
                <Text style={styles.summaryTitle}>Summary</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Habit:</Text>
                  <Text style={styles.summaryValue}>{habitName}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Category:</Text>
                  <Text style={styles.summaryValue}>{habitCategory}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Frequency:</Text>
                  <Text style={styles.summaryValue}>{habitFrequency}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Time:</Text>
                  <Text style={styles.summaryValue}>{habitTime}</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={step === 1 ? handleClose : handleBack}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>{step === 1 ? 'Cancel' : 'Back'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={step === 3 ? handleSubmit : handleNext}
            style={styles.nextButton}
          >
            <Text style={styles.nextButtonText}>{step === 3 ? 'Create Habit' : 'Next'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute' as any,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 9999,
  },
  modal: {
    backgroundColor: '#1a1a1a',
    borderRadius: 24,
    width: '100%',
    maxWidth: 600,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(167, 139, 250, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 2,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#a78bfa',
  },
  content: {
    padding: 24,
    maxHeight: 500,
  },
  stepContainer: {
    gap: 24,
  },
  formGroup: {
    gap: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#d1d5db',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  required: {
    color: '#f87171',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#ffffff',
  },
  inputError: {
    borderColor: '#f87171',
  },
  errorText: {
    fontSize: 13,
    color: '#f87171',
    marginTop: 4,
  },
  helpText: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 4,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoryButtonActive: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  categoryButtonText: {
    color: '#d1d5db',
    fontWeight: '500',
    fontSize: 14,
  },
  categoryButtonTextActive: {
    color: '#ffffff',
  },
  addCategoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 10,
  },
  addCategoryText: {
    color: '#a78bfa',
    fontWeight: '500',
    fontSize: 14,
  },
  newCategoryContainer: {
    gap: 12,
  },
  categoryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#8b5cf6',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#d1d5db',
    fontWeight: '600',
    fontSize: 15,
  },
  frequencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  frequencyButton: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  frequencyButtonActive: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  frequencyIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  frequencyLabel: {
    color: '#d1d5db',
    fontWeight: '600',
    fontSize: 14,
  },
  frequencyLabelActive: {
    color: '#ffffff',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayButton: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonActive: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  dayButtonText: {
    color: '#9ca3af',
    fontWeight: '600',
    fontSize: 13,
  },
  dayButtonTextActive: {
    color: '#ffffff',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#ffffff',
  },
  switchHelp: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 2,
  },
  switch: {
    width: 56,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 2,
    justifyContent: 'center',
  },
  switchActive: {
    backgroundColor: '#8b5cf6',
  },
  switchThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffffff',
  },
  switchThumbActive: {
    transform: [{ translateX: 24 }],
  },
  summary: {
    padding: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    gap: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#9ca3af',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#d1d5db',
    fontWeight: '600',
    fontSize: 15,
  },
  nextButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#8b5cf6',
  },
  nextButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
});
