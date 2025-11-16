import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/habit.dart';

const String _storageKey = 'habit-storage';
const List<String> _defaultCategories = ['Health', 'Work', 'Personal'];

class HabitProvider with ChangeNotifier {
  List<Habit> _habits = [];
  List<String> _categories = List.from(_defaultCategories);
  bool _isLoading = true;

  List<Habit> get habits => _habits;
  List<String> get categories => _categories;
  bool get isLoading => _isLoading;

  HabitProvider() {
    _initializeCategoriesIfNeeded();
  }

  Future<void> _initializeCategoriesIfNeeded() async {
    final prefs = await SharedPreferences.getInstance();
    final existingData = prefs.getString(_storageKey);
    if (existingData != null) {
      try {
        final data = jsonDecode(existingData) as Map<String, dynamic>;
        if (data['state']?['categories'] != null) {
          _categories = List<String>.from(data['state']['categories']);
        }
      } catch (e) {
        // Use default categories
      }
    }
  }

  Future<void> loadHabits() async {
    _isLoading = true;
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      final data = prefs.getString(_storageKey);

      if (data != null) {
        try {
          final decoded = jsonDecode(data) as Map<String, dynamic>;
          final state = decoded['state'] as Map<String, dynamic>?;

          if (state != null) {
            if (state['habits'] != null) {
              _habits = (state['habits'] as List)
                  .map((h) => Habit.fromJson(h as Map<String, dynamic>))
                  .toList();
            }

            if (state['categories'] != null) {
              _categories = List<String>.from(state['categories'] as List);
            }
          }
        } catch (e) {
          // Failed to parse, use empty
          _habits = [];
          _categories = List.from(_defaultCategories);
        }
      } else {
        _habits = [];
        _categories = List.from(_defaultCategories);
      }
    } catch (e) {
      _habits = [];
      _categories = List.from(_defaultCategories);
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> addHabit(Habit habit) async {
    _habits.add(habit);
    await _saveHabits();
    notifyListeners();
  }

  Future<void> deleteHabit(String id) async {
    _habits.removeWhere((h) => h.id == id);
    await _saveHabits();
    notifyListeners();
  }

  Future<void> markHabitComplete(String id) async {
    final index = _habits.indexWhere((h) => h.id == id);
    if (index == -1) return;

    final habit = _habits[index];
    final todayStr = DateTime.now().toString().split(' ')[0];

    // Already completed today
    if (habit.lastCompletedDate == todayStr) {
      return;
    }

    final today = DateTime.now();
    final dayOfWeek = _getDayOfWeek(today.weekday);

    if (habit.days.contains(dayOfWeek)) {
      if (habit.lastCompletedDate != null) {
        DateTime previousScheduledDate = today;
        int daysChecked = 0;
        bool foundPreviousDay = false;

        while (daysChecked < 7 && !foundPreviousDay) {
          previousScheduledDate = previousScheduledDate.subtract(Duration(days: 1));
          final prevDayOfWeek = _getDayOfWeek(previousScheduledDate.weekday);

          if (habit.days.contains(prevDayOfWeek)) {
            foundPreviousDay = true;
            final prevDateStr = previousScheduledDate.toString().split(' ')[0];
            habit.streak = habit.lastCompletedDate == prevDateStr ? (habit.streak) + 1 : 1;
          }
          daysChecked++;
        }

        if (!foundPreviousDay) {
          habit.streak = habit.streak + 1;
        }
      } else {
        habit.streak = 1;
      }
    }

    _habits[index] = habit.copyWith(
      completed: habit.completed + 1,
      weeklyCompleted: habit.weeklyCompleted + 1,
      lastCompletedDate: todayStr,
    );

    await _saveHabits();
    notifyListeners();
  }

  Future<void> addCategory(String category) async {
    if (!_categories.contains(category)) {
      _categories.add(category);
      await _saveHabits();
      notifyListeners();
    }
  }

  Future<void> deleteCategory(String category) async {
    final habitsWithCategory = _habits.where((h) => h.category == category).toList();
    if (habitsWithCategory.isNotEmpty) {
      throw Exception(
        'Cannot delete category "$category" because it is being used by ${habitsWithCategory.length} habit(s).',
      );
    }

    _categories.remove(category);
    await _saveHabits();
    notifyListeners();
  }

  Future<void> resetWeeklyStats() async {
    for (int i = 0; i < _habits.length; i++) {
      _habits[i] = _habits[i].copyWith(weeklyCompleted: 0);
    }
    await _saveHabits();
    notifyListeners();
  }

  Future<void> _saveHabits() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final data = {
        'state': {
          'habits': _habits.map((h) => h.toJson()).toList(),
          'categories': _categories,
        },
        'version': 0,
      };
      await prefs.setString(_storageKey, jsonEncode(data));
    } catch (e) {
      debugPrint('Error saving habits: $e');
    }
  }

  String _getDayOfWeek(int weekday) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[weekday - 1];
  }

  int getTotalHabits() => _habits.length;

  int getCompletedToday() {
    final todayStr = DateTime.now().toString().split(' ')[0];
    return _habits.where((h) => h.lastCompletedDate == todayStr).length;
  }

  int getStreak() {
    if (_habits.isEmpty) return 0;
    return _habits.fold(0, (max, h) => h.streak > max ? h.streak : max);
  }

  int getWeeklyProgress() {
    if (_habits.isEmpty) return 0;
    final totalPossible = _habits.length * 7;
    final totalCompleted = _habits.fold(0, (sum, h) => sum + h.weeklyCompleted);
    return totalPossible == 0 ? 0 : ((totalCompleted / totalPossible) * 100).round();
  }

  List<Habit> getHabitsForToday() {
    final today = DateTime.now();
    final dayOfWeek = _getDayOfWeek(today.weekday);
    return _habits.where((h) => h.days.contains(dayOfWeek)).toList();
  }

  Map<String, List<Habit>> getHabitsByCategory() {
    final grouped = <String, List<Habit>>{};
    for (final category in _categories) {
      grouped[category] = _habits.where((h) => h.category == category).toList();
    }
    return grouped;
  }
}
