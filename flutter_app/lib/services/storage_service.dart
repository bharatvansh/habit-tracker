import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/habit.dart';
import '../models/reminder.dart';
import '../models/profile.dart';

class StorageService {
  static const String _habitsKey = 'habit-storage';
  static const String _remindersKey = 'reminder-storage';
  static const String _profileKey = 'profile-storage';
  static const String _categoriesKey = 'categories-storage';
  static const String _lastWeeklyResetKey = 'lastWeeklyReset';

  // Habits
  Future<List<Habit>> loadHabits() async {
    final prefs = await SharedPreferences.getInstance();
    final String? habitsJson = prefs.getString(_habitsKey);
    
    if (habitsJson == null) return [];
    
    final Map<String, dynamic> data = jsonDecode(habitsJson);
    final List<dynamic> habitsData = data['state']?['habits'] ?? [];
    
    return habitsData.map((json) => Habit.fromJson(json)).toList();
  }

  Future<void> saveHabits(List<Habit> habits) async {
    final prefs = await SharedPreferences.getInstance();
    final data = {
      'state': {
        'habits': habits.map((h) => h.toJson()).toList(),
      },
      'version': 0,
    };
    await prefs.setString(_habitsKey, jsonEncode(data));
  }

  // Categories
  Future<List<String>> loadCategories() async {
    final prefs = await SharedPreferences.getInstance();
    final String? habitsJson = prefs.getString(_habitsKey);
    
    if (habitsJson == null) return ['Health', 'Work', 'Personal'];
    
    final Map<String, dynamic> data = jsonDecode(habitsJson);
    final List<dynamic>? categoriesData = data['state']?['categories'];
    
    if (categoriesData == null) return ['Health', 'Work', 'Personal'];
    
    return List<String>.from(categoriesData);
  }

  Future<void> saveCategories(List<String> categories, List<Habit> habits) async {
    final prefs = await SharedPreferences.getInstance();
    final data = {
      'state': {
        'habits': habits.map((h) => h.toJson()).toList(),
        'categories': categories,
      },
      'version': 0,
    };
    await prefs.setString(_habitsKey, jsonEncode(data));
  }

  // Reminders
  Future<List<Reminder>> loadReminders() async {
    final prefs = await SharedPreferences.getInstance();
    final String? remindersJson = prefs.getString(_remindersKey);
    
    if (remindersJson == null) return [];
    
    final Map<String, dynamic> data = jsonDecode(remindersJson);
    final List<dynamic> remindersData = data['state']?['reminders'] ?? [];
    
    return remindersData.map((json) => Reminder.fromJson(json)).toList();
  }

  Future<void> saveReminders(List<Reminder> reminders) async {
    final prefs = await SharedPreferences.getInstance();
    final data = {
      'state': {
        'reminders': reminders.map((r) => r.toJson()).toList(),
      },
      'version': 0,
    };
    await prefs.setString(_remindersKey, jsonEncode(data));
  }

  // Profile
  Future<UserProfile> loadProfile() async {
    final prefs = await SharedPreferences.getInstance();
    final String? profileJson = prefs.getString(_profileKey);
    
    if (profileJson == null) return UserProfile();
    
    final Map<String, dynamic> data = jsonDecode(profileJson);
    return UserProfile.fromJson(data);
  }

  Future<void> saveProfile(UserProfile profile) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_profileKey, jsonEncode(profile.toJson()));
  }

  // Weekly Reset
  Future<String?> getLastWeeklyReset() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_lastWeeklyResetKey);
  }

  Future<void> setLastWeeklyReset(String date) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_lastWeeklyResetKey, date);
  }
}
