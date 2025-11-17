import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useReminderStore, type Reminder } from '../../store/reminder-store';
import ReminderModal from '../../components/reminders/reminder-modal';

export default function RemindersPage() {
  const { reminders, deleteReminder, toggleComplete } = useReminderStore();
  const [showModal, setShowModal] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | undefined>();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredReminders = reminders.filter(reminder => {
    if (filter === 'completed') return reminder.completed;
    if (filter === 'pending') return !reminder.completed;
    return true;
  });

  const handleDeleteReminder = (reminderId: string, reminderTitle: string) => {
    Alert.alert(
      'Delete Reminder',
      `Are you sure you want to delete "${reminderTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteReminder(reminderId),
        },
      ]
    );
  };

  const handleEditReminder = (reminder: Reminder) => {
    setSelectedReminder(reminder);
    setShowModal(true);
  };

  const handleToggleComplete = (reminderId: string) => {
    toggleComplete(reminderId);
  };

  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleString();
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ffc107';
      case 'low': return '#4caf50';
      default: return '#666';
    }
  };

  const renderReminder = ({ item }: { item: Reminder }) => {
    const isOverdue = new Date(item.datetime) < new Date() && !item.completed;
    
    return (
      <View style={[styles.reminderCard, item.completed && styles.completedCard]}>
        <TouchableOpacity
          style={styles.reminderContent}
          onPress={() => handleToggleComplete(item.id)}
        >
          <View style={styles.reminderHeader}>
            <View style={styles.reminderTitleRow}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => handleToggleComplete(item.id)}
              >
                <Ionicons 
                  name={item.completed ? "checkmark-circle" : "ellipse-outline"} 
                  size={24} 
                  color={item.completed ? "#4caf50" : "#b3b3b3"} 
                />
              </TouchableOpacity>
              <Text style={[
                styles.reminderTitle,
                item.completed && styles.completedTitle
              ]}>
                {item.title}
              </Text>
            </View>
            
            <View style={styles.priorityBadge}>
              <Text style={[
                styles.priorityText,
                { color: getPriorityColor(item.priority) }
              ]}>
                {item.priority?.toUpperCase()}
              </Text>
            </View>
          </View>
          
          <View style={styles.reminderDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={14} color="#b3b3b3" />
              <Text style={[
                styles.detailText,
                isOverdue && styles.overdueText
              ]}>
                {formatDateTime(item.datetime)}
              </Text>
              {isOverdue && (
                <View style={styles.overdueBadge}>
                  <Text style={styles.overdueText}>Overdue</Text>
                </View>
              )}
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="pricetag" size={14} color="#b3b3b3" />
              <Text style={styles.detailText}>{item.category}</Text>
            </View>
            
            <View style={styles.reminderMeta}>
              {item.alarm && (
                <View style={styles.metaItem}>
                  <Ionicons name="notifications" size={14} color="#8a2be2" />
                  <Text style={styles.metaText}>Alarm</Text>
                </View>
              )}
              {item.notification && (
                <View style={styles.metaItem}>
                  <Ionicons name="mail" size={14} color="#8a2be2" />
                  <Text style={styles.metaText}>Notification</Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
        
        <View style={styles.reminderActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditReminder(item)}
          >
            <Ionicons name="create" size={20} color="#8a2be2" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteReminder(item.id, item.title)}
          >
            <Ionicons name="trash" size={20} color="#f44336" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reminders</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setSelectedReminder(undefined);
            setShowModal(true);
          }}
        >
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.addButtonText}>Add Reminder</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        {['all', 'pending', 'completed'].map((filterOption) => (
          <TouchableOpacity
            key={filterOption}
            style={[
              styles.filterButton,
              filter === filterOption && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(filterOption as any)}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === filterOption && styles.filterButtonTextActive,
              ]}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredReminders.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="notifications-off" size={64} color="#666" />
          <Text style={styles.emptyTitle}>No reminders</Text>
          <Text style={styles.emptySubtitle}>
            {filter === 'completed' 
              ? 'No completed reminders yet'
              : filter === 'pending'
              ? 'No pending reminders'
              : 'Create your first reminder to stay on track'
            }
          </Text>
          {filter === 'all' && (
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => {
                setSelectedReminder(undefined);
                setShowModal(true);
              }}
            >
              <Text style={styles.emptyButtonText}>Create First Reminder</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredReminders}
          renderItem={renderReminder}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <ReminderModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        editId={selectedReminder?.id}
        existingReminder={selectedReminder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8a2be2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#8a2be2',
  },
  filterButtonText: {
    color: '#b3b3b3',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  listContainer: {
    gap: 12,
  },
  reminderCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  completedCard: {
    opacity: 0.7,
  },
  reminderContent: {
    flex: 1,
  },
  reminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reminderTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 12,
  },
  checkbox: {
    marginTop: 2,
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#b3b3b3',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#252525',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  reminderDetails: {
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#b3b3b3',
    flex: 1,
  },
  overdueText: {
    color: '#f44336',
    fontWeight: '500',
  },
  overdueBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
  },
  reminderMeta: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#8a2be2',
  },
  reminderActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#252525',
    gap: 6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#b3b3b3',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyButton: {
    backgroundColor: '#8a2be2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});