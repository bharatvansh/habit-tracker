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
import { useReminderStore, type Reminder } from '../../store/reminder-store';

interface ReminderModalProps {
  visible: boolean;
  onClose: () => void;
  editId?: string;
  existingReminder?: Reminder;
}

export default function ReminderModal({ visible, onClose, editId, existingReminder }: ReminderModalProps) {
  const { addReminder, editReminder } = useReminderStore();
  const [title, setTitle] = useState(existingReminder?.title || '');
  const [datetime, setDatetime] = useState(existingReminder?.datetime || '');
  const [alarm, setAlarm] = useState(existingReminder?.alarm || false);
  const [notification, setNotification] = useState(existingReminder?.notification || false);
  const [priority, setPriority] = useState<"high" | "medium" | "low">(existingReminder?.priority || "medium");
  const [category, setCategory] = useState(existingReminder?.category || "General");

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const dateString = selectedDate.toISOString();
      setDatetime(dateString);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title.');
      return;
    }
    if (!datetime) {
      Alert.alert('Error', 'Please enter a valid date & time.');
      return;
    }

    const reminderData: Reminder = {
      title,
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
      Alert.alert('Success', `"${title}" has been updated.`);
    } else {
      addReminder(reminderData);
      Alert.alert('Success', `"${title}" has been saved.`);
    }

    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setDatetime('');
    setAlarm(false);
    setNotification(false);
    setPriority('medium');
    setCategory('General');
    onClose();
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'Select date and time';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const priorities: Array<"high" | "medium" | "low"> = ["high", "medium", "low"];
  const categories = ["General", "Work", "Personal", "Health", "Finance"];

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
          <Text style={styles.title}>
            {editId ? 'Edit Reminder' : 'Add New Reminder'}
          </Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter reminder title"
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Date & Time</Text>
            <TouchableOpacity
              style={styles.dateSelector}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>{formatDateTime(datetime)}</Text>
              <Ionicons name="calendar" size={16} color="#b3b3b3" />
            </TouchableOpacity>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    category === cat && styles.categoryButtonActive,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      category === cat && styles.categoryButtonTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityContainer}>
              {priorities.map((pri) => (
                <TouchableOpacity
                  key={pri}
                  style={[
                    styles.priorityButton,
                    priority === pri && styles.priorityButtonActive,
                    priority === pri && {
                      backgroundColor:
                        pri === 'high' ? '#f44336' : pri === 'medium' ? '#ffc107' : '#4caf50',
                    },
                  ]}
                  onPress={() => setPriority(pri)}
                >
                  <Text
                    style={[
                      styles.priorityButtonText,
                      priority === pri && styles.priorityButtonTextActive,
                    ]}
                  >
                    {pri.charAt(0).toUpperCase() + pri.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.formGroup}>
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Alarm</Text>
              <Switch
                value={alarm}
                onValueChange={setAlarm}
                trackColor={{ false: '#333', true: '#8a2be2' }}
                thumbColor={alarm ? '#ffffff' : '#b3b3b3'}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <View style={styles.switchContainer}>
              <Text style={styles.label}>Notification</Text>
              <Switch
                value={notification}
                onValueChange={setNotification}
                trackColor={{ false: '#333', true: '#8a2be2' }}
                thumbColor={notification ? '#ffffff' : '#b3b3b3'}
              />
            </View>
          </View>
        </ScrollView>

        {showDatePicker && (
          <DateTimePicker
            value={tempDate}
            mode="datetime"
            display="default"
            onChange={handleDateChange}
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
  dateSelector: {
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
  dateText: {
    fontSize: 16,
    color: '#ffffff',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#333',
  },
  categoryButtonActive: {
    backgroundColor: '#8a2be2',
    borderColor: '#8a2be2',
  },
  categoryButtonText: {
    color: '#b3b3b3',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#ffffff',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  priorityButtonActive: {
    borderColor: '#8a2be2',
  },
  priorityButtonText: {
    color: '#b3b3b3',
    fontWeight: '500',
  },
  priorityButtonTextActive: {
    color: '#ffffff',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});