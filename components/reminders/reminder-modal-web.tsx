import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useReminderStore, type Reminder } from '../../store/reminder-store';

interface ReminderModalWebProps {
  isOpen: boolean;
  onClose: () => void;
  editId?: string;
  existingReminder?: Reminder;
}

export default function ReminderModalWeb({ isOpen, onClose, editId, existingReminder }: ReminderModalWebProps) {
  const { addReminder, editReminder } = useReminderStore();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState(existingReminder?.title || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [alarm, setAlarm] = useState(existingReminder?.alarm || false);
  const [notification, setNotification] = useState(existingReminder?.notification || true);
  const [priority, setPriority] = useState<"high" | "medium" | "low">(existingReminder?.priority || "medium");
  const [category, setCategory] = useState(existingReminder?.category || "General");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = ["General", "Work", "Personal", "Health", "Finance"];

  useEffect(() => {
    if (isOpen) {
      if (existingReminder?.datetime) {
        const dt = new Date(existingReminder.datetime);
        setDate(dt.toISOString().split('T')[0]);
        setTime(dt.toTimeString().slice(0, 5));
      } else {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);
        setDate(tomorrow.toISOString().split('T')[0]);
        setTime('09:00');
      }
    }
  }, [isOpen, existingReminder]);

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 1 && !title.trim()) {
      newErrors.title = 'Please enter a reminder title';
    }
    
    if (currentStep === 2) {
      if (!date) newErrors.date = 'Please select a date';
      if (!time) newErrors.time = 'Please select a time';
      if (date && time && new Date(`${date}T${time}`) < new Date()) {
        newErrors.datetime = 'Please select a future date and time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = () => {
    if (!validateStep(step)) return;

    const datetime = new Date(`${date}T${time}`).toISOString();
    const reminderData: Reminder = {
      title: title.trim(),
      datetime,
      alarm,
      notification,
      priority,
      category,
      completed: existingReminder?.completed || false,
      completedAt: existingReminder?.completedAt,
    };

    if (editId) {
      editReminder(editId, reminderData);
    } else {
      addReminder(reminderData);
    }

    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setTitle('');
    setDate('');
    setTime('');
    setAlarm(false);
    setNotification(true);
    setPriority('medium');
    setCategory('General');
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconCircle}>
              <Ionicons name="notifications" size={24} color="#60a5fa" />
            </View>
            <View>
              <Text style={styles.title}>{editId ? 'Edit Reminder' : 'Create New Reminder'}</Text>
              <Text style={styles.subtitle}>Step {step} of 3</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {step === 1 && (
            <View style={styles.stepContainer}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>What do you need to remember? <Text style={styles.required}>*</Text></Text>
                <TextInput
                  style={[styles.input, errors.title && styles.inputError]}
                  value={title}
                  onChangeText={(text) => {
                    setTitle(text);
                    setErrors(prev => ({ ...prev, title: '' }));
                  }}
                  placeholder="e.g., Team meeting, Doctor appointment"
                  placeholderTextColor="#6b7280"
                  autoFocus
                />
                {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Category</Text>
                <View style={styles.categoryGrid}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setCategory(cat)}
                      style={[styles.categoryButton, category === cat && styles.categoryButtonActive]}
                    >
                      <Text style={[styles.categoryButtonText, category === cat && styles.categoryButtonTextActive]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Priority</Text>
                <View style={styles.priorityGrid}>
                  {[
                    { value: 'high' as const, label: 'High', icon: '🔥', color: '#ef4444' },
                    { value: 'medium' as const, label: 'Medium', icon: '⚡', color: '#f59e0b' },
                    { value: 'low' as const, label: 'Low', icon: '🌱', color: '#10b981' },
                  ].map((pri) => (
                    <TouchableOpacity
                      key={pri.value}
                      onPress={() => setPriority(pri.value)}
                      style={[
                        styles.priorityButton,
                        priority === pri.value && { ...styles.priorityButtonActive, backgroundColor: pri.color }
                      ]}
                    >
                      <Text style={styles.priorityIcon}>{pri.icon}</Text>
                      <Text style={[styles.priorityLabel, priority === pri.value && styles.priorityLabelActive]}>
                        {pri.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepContainer}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Date</Text>
                <TextInput
                  style={[styles.input, errors.date && styles.inputError]}
                  value={date}
                  onChangeText={(text) => {
                    setDate(text);
                    setErrors(prev => ({ ...prev, date: '', datetime: '' }));
                  }}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#6b7280"
                />
                {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Time</Text>
                <TextInput
                  style={[styles.input, errors.time && styles.inputError]}
                  value={time}
                  onChangeText={(text) => {
                    setTime(text);
                    setErrors(prev => ({ ...prev, time: '', datetime: '' }));
                  }}
                  placeholder="HH:MM"
                  placeholderTextColor="#6b7280"
                />
                {errors.time && <Text style={styles.errorText}>{errors.time}</Text>}
              </View>

              {errors.datetime && (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle" size={20} color="#f87171" />
                  <Text style={styles.errorText}>{errors.datetime}</Text>
                </View>
              )}
            </View>
          )}

          {step === 3 && (
            <View style={styles.stepContainer}>
              <View style={styles.switchContainer}>
                <View>
                  <Text style={styles.switchLabel}>Push Notification</Text>
                  <Text style={styles.switchHelp}>Get a notification on your device</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setNotification(!notification)}
                  style={[styles.switch, notification && styles.switchActive]}
                >
                  <View style={[styles.switchThumb, notification && styles.switchThumbActive]} />
                </TouchableOpacity>
              </View>

              <View style={styles.switchContainer}>
                <View>
                  <Text style={styles.switchLabel}>Alarm Sound</Text>
                  <Text style={styles.switchHelp}>Play an alarm sound</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setAlarm(!alarm)}
                  style={[styles.switch, alarm && styles.switchActive]}
                >
                  <View style={[styles.switchThumb, alarm && styles.switchThumbActive]} />
                </TouchableOpacity>
              </View>

              <View style={styles.summary}>
                <Text style={styles.summaryTitle}>Summary</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Title:</Text>
                  <Text style={styles.summaryValue}>{title}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Category:</Text>
                  <Text style={styles.summaryValue}>{category}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Priority:</Text>
                  <Text style={styles.summaryValue}>{priority}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Date & Time:</Text>
                  <Text style={styles.summaryValue}>{date} {time}</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity onPress={step === 1 ? handleClose : handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>{step === 1 ? 'Cancel' : 'Back'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={step === 3 ? handleSubmit : handleNext} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>{step === 3 ? (editId ? 'Update' : 'Create') : 'Next'}</Text>
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
    backgroundColor: 'rgba(96, 165, 250, 0.15)',
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
    backgroundColor: '#3b82f6',
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
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 12,
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
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  categoryButtonText: {
    color: '#d1d5db',
    fontWeight: '500',
    fontSize: 14,
  },
  categoryButtonTextActive: {
    color: '#ffffff',
  },
  priorityGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  priorityButtonActive: {
    borderColor: 'transparent',
  },
  priorityIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  priorityLabel: {
    color: '#d1d5db',
    fontWeight: '600',
    fontSize: 13,
  },
  priorityLabelActive: {
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
    backgroundColor: '#3b82f6',
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
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
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
    backgroundColor: '#3b82f6',
  },
  nextButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
  },
});
