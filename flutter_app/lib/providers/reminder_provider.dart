import 'package:flutter/foundation.dart';
import 'package:uuid/uuid.dart';
import '../models/reminder.dart';
import '../services/storage_service.dart';

class ReminderProvider with ChangeNotifier {
  final StorageService _storage = StorageService();
  final Uuid _uuid = const Uuid();

  List<Reminder> _reminders = [];
  bool _isLoading = true;

  List<Reminder> get reminders => _reminders;
  bool get isLoading => _isLoading;

  ReminderProvider() {
    loadReminders();
  }

  Future<void> loadReminders() async {
    _isLoading = true;
    notifyListeners();

    _reminders = await _storage.loadReminders();
    
    _isLoading = false;
    notifyListeners();
  }

  Future<void> addReminder({
    required String title,
    required String datetime,
    bool alarm = false,
    bool notification = false,
    String? priority,
    String? category,
  }) async {
    final reminder = Reminder(
      id: _uuid.v4(),
      title: title,
      datetime: datetime,
      alarm: alarm,
      notification: notification,
      priority: priority,
      category: category,
      completed: false,
    );

    _reminders.add(reminder);
    await _storage.saveReminders(_reminders);
    notifyListeners();
  }

  Future<void> editReminder({
    required String id,
    required String title,
    required String datetime,
    bool alarm = false,
    bool notification = false,
    String? priority,
    String? category,
  }) async {
    final index = _reminders.indexWhere((r) => r.id == id);
    if (index == -1) return;

    final existingReminder = _reminders[index];
    _reminders[index] = existingReminder.copyWith(
      title: title,
      datetime: datetime,
      alarm: alarm,
      notification: notification,
      priority: priority,
      category: category,
    );

    await _storage.saveReminders(_reminders);
    notifyListeners();
  }

  Future<void> deleteReminder(String id) async {
    _reminders.removeWhere((r) => r.id == id);
    await _storage.saveReminders(_reminders);
    notifyListeners();
  }

  Future<void> toggleComplete(String id) async {
    final index = _reminders.indexWhere((r) => r.id == id);
    if (index == -1) return;

    final reminder = _reminders[index];
    _reminders[index] = reminder.copyWith(
      completed: !reminder.completed,
      completedAt: !reminder.completed ? DateTime.now().toIso8601String() : null,
    );

    await _storage.saveReminders(_reminders);
    notifyListeners();
  }

  List<Reminder> getFilteredReminders(String filter) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final tomorrow = today.add(const Duration(days: 1));

    switch (filter) {
      case 'today':
        return _reminders.where((r) {
          final reminderDate = DateTime.parse(r.datetime);
          return reminderDate.isAfter(today) &&
              reminderDate.isBefore(tomorrow) &&
              !r.completed;
        }).toList();
      case 'upcoming':
        return _reminders.where((r) {
          final reminderDate = DateTime.parse(r.datetime);
          return reminderDate.isAfter(now) && !r.completed;
        }).toList();
      case 'completed':
        return _reminders.where((r) => r.completed).toList();
      default:
        return _reminders;
    }
  }
}
