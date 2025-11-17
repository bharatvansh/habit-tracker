import React, { useState, useEffect } from 'react';
import {
   View,
   Text,
   TextInput,
   TouchableOpacity,
   StyleSheet,
   ScrollView,
   Switch,
   Alert,
   Image,
 } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useProfile } from '../../hooks/use-profile';
import { useHabitStore } from '../../store/habit-store';
import { useReminderStore } from '../../store/reminder-store';
import { calculateCompletionRate, getLongestStreak } from '../../lib/habit-utils';

export default function ProfilePage() {
   const { profile, updateProfile } = useProfile();
   const { habits } = useHabitStore();
   const { reminders } = useReminderStore();
   const [stats, setStats] = useState({
     totalHabits: 0,
     totalReminders: 0,
     longestStreak: 0,
     completionRate: 0,
   });

   useEffect(() => {
     const longestStreak = getLongestStreak(habits);
     const completionRate = calculateCompletionRate(habits, 'month');
     setStats({
       totalHabits: habits.length,
       totalReminders: reminders.length,
       longestStreak: longestStreak.days,
       completionRate,
     });
   }, [habits, reminders]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name || '',
    email: profile.email || '',
    bio: profile.bio || '',
    avatarColor: profile.avatarColor || '#8a2be2',
    notifications: profile.notifications?.pushReminders || true,
    darkMode: true, // Always dark mode in RN version
  });

  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const avatarColors = [
    '#8a2be2', '#f44336', '#4caf50', '#2196f3', 
    '#ff9800', '#9c27b0', '#00bcd4', '#ffc107'
  ];

  const handleSave = () => {
    updateProfile({
      ...formData,
      notifications: {
        emailReminders: profile.notifications?.emailReminders || true,
        pushReminders: formData.notifications,
      },
    });
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleCancel = () => {
    setFormData({
      name: profile.name || '',
      email: profile.email || '',
      bio: profile.bio || '',
      avatarColor: profile.avatarColor || '#8a2be2',
      notifications: profile.notifications?.pushReminders || true,
      darkMode: true,
    });
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(s => s[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Ionicons 
            name={isEditing ? "close" : "create"} 
            size={20} 
            color="#ffffff" 
          />
          <Text style={styles.editButtonText}>
            {isEditing ? 'Cancel' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity
            style={[styles.avatar, { backgroundColor: formData.avatarColor }]}
            onPress={() => isEditing && setShowAvatarPicker(true)}
            disabled={!isEditing}
          >
            <Text style={styles.avatarText}>
              {getInitials(formData.name) || 'U'}
            </Text>
            {isEditing && (
              <View style={styles.editOverlay}>
                <Ionicons name="camera" size={20} color="#ffffff" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {formData.name || 'Your Profile'}
          </Text>
          <Text style={styles.profileEmail}>
            {formData.email || 'Set up your details'}
          </Text>
        </View>
      </View>

      {showAvatarPicker && (
        <View style={styles.avatarPicker}>
          <Text style={styles.avatarPickerTitle}>Choose Avatar Color</Text>
          <View style={styles.colorGrid}>
            {avatarColors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  formData.avatarColor === color && styles.colorOptionSelected,
                ]}
                onPress={() => {
                  setFormData({ ...formData, avatarColor: color });
                  setShowAvatarPicker(false);
                }}
              >
                {formData.avatarColor === color && (
                  <Ionicons name="checkmark" size={16} color="#ffffff" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Enter your name"
            placeholderTextColor="#666"
            editable={isEditing}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, !isEditing && styles.inputDisabled]}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            placeholder="Enter your email"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={isEditing}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea, !isEditing && styles.inputDisabled]}
            value={formData.bio}
            onChangeText={(text) => setFormData({ ...formData, bio: text })}
            placeholder="Tell us about yourself"
            placeholderTextColor="#666"
            multiline
            numberOfLines={4}
            editable={isEditing}
          />
        </View>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Text style={styles.settingDescription}>
              Receive notifications for reminders and habit updates
            </Text>
          </View>
          <Switch
            value={formData.notifications}
            onValueChange={(value) => setFormData({ ...formData, notifications: value })}
            disabled={!isEditing}
            trackColor={{ false: '#333', true: '#8a2be2' }}
            thumbColor={formData.notifications ? '#ffffff' : '#b3b3b3'}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Text style={styles.settingDescription}>
              Use dark theme throughout the app
            </Text>
          </View>
          <Switch
            value={formData.darkMode}
            onValueChange={(value) => setFormData({ ...formData, darkMode: value })}
            disabled={true} // Always dark mode in RN version
            trackColor={{ false: '#333', true: '#8a2be2' }}
            thumbColor={formData.darkMode ? '#ffffff' : '#b3b3b3'}
          />
        </View>
      </View>

      {isEditing && (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="checkbox" size={24} color="#8a2be2" />
            <Text style={styles.statValue}>{stats.totalHabits}</Text>
            <Text style={styles.statLabel}>Total Habits</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="notifications" size={24} color="#4caf50" />
            <Text style={styles.statValue}>{stats.totalReminders}</Text>
            <Text style={styles.statLabel}>Reminders</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={24} color="#ff9800" />
            <Text style={styles.statValue}>{stats.longestStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trophy" size={24} color="#ffc107" />
            <Text style={styles.statValue}>{stats.completionRate}%</Text>
            <Text style={styles.statLabel}>Completion Rate</Text>
          </View>
        </View>
      </View>
    </ScrollView>
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
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#8a2be2',
    borderRadius: 8,
  },
  editButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
  },
  editOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#b3b3b3',
  },
  avatarPicker: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  avatarPickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  formSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 20,
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
  inputDisabled: {
    backgroundColor: '#252525',
    borderColor: '#444',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#b3b3b3',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#333',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#8a2be2',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  statsSection: {
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#b3b3b3',
    textAlign: 'center',
  },
});