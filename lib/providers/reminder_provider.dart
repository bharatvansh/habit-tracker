import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/reminder.dart';

const String _storageKey = 'reminder-storage';

class ReminderProvider with ChangeNotifier {
  List<Reminder> _reminders = [];
  bool _isLoading = true;

  List<Reminder> get reminders => _reminders;
  bool get isLoading => _isLoading;

  Future<void> loadReminders() async {
    _isLoading = true;
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      final data = prefs.getString(_storageKey);

      if (data != null) {
        try {
          final decoded = jsonDecode(data) as Map<String, dynamic>;
          final state = decoded['state'] as Map<String, dynamic>?;

          if (state != null && state['reminders'] != null) {
            _reminders = (state['reminders'] as List)
                .map((r) => Reminder.fromJson(r as Map<String, dynamic>))
                .toList();
          }
        } catch (e) {
          _reminders = [];
        }
      } else {
        _reminders = [];
      }
    } catch (e) {
      _reminders = [];
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> addReminder(Reminder reminder) async {
    _reminders.add(reminder);
    await _saveReminders();
    notifyListeners();
  }

  Future<void> editReminder(String id, Reminder reminder) async {
    final index = _reminders.indexWhere((r) => r.id == id);
    if (index != -1) {
      _reminders[index] = reminder;
      await _saveReminders();
      notifyListeners();
    }
  }

  Future<void> deleteReminder(String id) async {
    _reminders.removeWhere((r) => r.id == id);
    await _saveReminders();
    notifyListeners();
  }

  Future<void> toggleComplete(String id) async {
    final index = _reminders.indexWhere((r) => r.id == id);
    if (index != -1) {
      final reminder = _reminders[index];
      _reminders[index] = reminder.copyWith(
        completed: !reminder.completed,
        completedAt: !reminder.completed ? DateTime.now().toIso8601String() : null,
      );
      await _saveReminders();
      notifyListeners();
    }
  }

  Future<void> _saveReminders() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final data = {
        'state': {
          'reminders': _reminders.map((r) => r.toJson()).toList(),
        },
        'version': 0,
      };
      await prefs.setString(_storageKey, jsonEncode(data));
    } catch (e) {
      debugPrint('Error saving reminders: $e');
    }
  }

  List<Reminder> getUpcomingReminders() {
    final now = DateTime.now();
    final upcoming = _reminders
        .where((r) => !r.completed && DateTime.parse(r.datetime).isAfter(now))
        .toList();
    upcoming.sort((a, b) => DateTime.parse(a.datetime).compareTo(DateTime.parse(b.datetime)));
    return upcoming;
  }

  List<Reminder> getRemindersByPriority(String priority) {
    return _reminders.where((r) => r.priority == priority && !r.completed).toList();
  }

  int getCompletedCount() {
    return _reminders.where((r) => r.completed).length;
  }

  int getPendingCount() {
    return _reminders.where((r) => !r.completed).length;
  }

  List<Reminder> getRemindersForToday() {
    final today = DateTime.now();
    final startOfDay = DateTime(today.year, today.month, today.day);
    final endOfDay = startOfDay.add(Duration(days: 1));

    return _reminders
        .where((r) {
          final reminderDate = DateTime.parse(r.datetime);
          return reminderDate.isAfter(startOfDay) && reminderDate.isBefore(endOfDay);
        })
        .toList();
  }
}
