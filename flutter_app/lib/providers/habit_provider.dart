import 'package:flutter/foundation.dart';
import 'package:uuid/uuid.dart';
import '../models/habit.dart';
import '../services/storage_service.dart';

class HabitProvider with ChangeNotifier {
  final StorageService _storage = StorageService();
  final Uuid _uuid = const Uuid();

  List<Habit> _habits = [];
  List<String> _categories = ['Health', 'Work', 'Personal'];
  bool _isLoading = true;

  List<Habit> get habits => _habits;
  List<String> get categories => _categories;
  bool get isLoading => _isLoading;

  HabitProvider() {
    loadHabits();
  }

  Future<void> loadHabits() async {
    _isLoading = true;
    notifyListeners();

    _habits = await _storage.loadHabits();
    _categories = await _storage.loadCategories();
    
    _isLoading = false;
    notifyListeners();
  }

  Future<void> addHabit({
    required String name,
    String? time,
    required String frequency,
    required List<String> days,
    required String category,
    required bool reminder,
  }) async {
    final habit = Habit(
      id: _uuid.v4(),
      name: name,
      time: time,
      frequency: frequency,
      days: days,
      category: category,
      reminder: reminder,
      completed: 0,
      streak: 0,
      weeklyCompleted: 0,
      createdAt: DateTime.now().toIso8601String(),
    );

    _habits.add(habit);
    await _storage.saveHabits(_habits);
    notifyListeners();
  }

  Future<void> markHabitComplete(String id) async {
    final index = _habits.indexWhere((h) => h.id == id);
    if (index == -1) return;

    final habit = _habits[index];
    final todayStr = DateTime.now().toIso8601String().split('T')[0];

    // Already completed today
    if (habit.lastCompletedDate == todayStr) {
      return;
    }

    final today = DateTime.now();
    final dayOfWeek = _getDayOfWeek(today);
    
    int newStreak = habit.streak;

    if (habit.days.contains(dayOfWeek)) {
      if (habit.lastCompletedDate != null) {
        final previousScheduledDate = _findPreviousScheduledDay(today, habit.days);
        if (previousScheduledDate != null) {
          final prevDateStr = previousScheduledDate.toIso8601String().split('T')[0];
          newStreak = habit.lastCompletedDate == prevDateStr ? habit.streak + 1 : 1;
        } else {
          newStreak = habit.streak + 1;
        }
      } else {
        newStreak = 1;
      }
    }

    _habits[index] = habit.copyWith(
      lastCompletedDate: todayStr,
      completed: habit.completed + 1,
      weeklyCompleted: habit.weeklyCompleted + 1,
      streak: newStreak,
    );

    await _storage.saveHabits(_habits);
    notifyListeners();
  }

  Future<void> deleteHabit(String id) async {
    _habits.removeWhere((h) => h.id == id);
    await _storage.saveHabits(_habits);
    notifyListeners();
  }

  Future<void> addCategory(String category) async {
    if (_categories.contains(category)) return;
    
    _categories.add(category);
    await _storage.saveCategories(_categories, _habits);
    notifyListeners();
  }

  Future<void> deleteCategory(String category) async {
    final habitsWithCategory = _habits.where((h) => h.category == category);
    if (habitsWithCategory.isNotEmpty) {
      return; // Cannot delete category in use
    }
    
    _categories.remove(category);
    await _storage.saveCategories(_categories, _habits);
    notifyListeners();
  }

  Future<void> resetWeeklyStats() async {
    _habits = _habits.map((habit) => habit.copyWith(weeklyCompleted: 0)).toList();
    await _storage.saveHabits(_habits);
    notifyListeners();
  }

  String _getDayOfWeek(DateTime date) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[date.weekday - 1];
  }

  DateTime? _findPreviousScheduledDay(DateTime today, List<String> scheduledDays) {
    DateTime checkDate = today.subtract(const Duration(days: 1));
    int daysChecked = 0;

    while (daysChecked < 7) {
      final dayName = _getDayOfWeek(checkDate);
      if (scheduledDays.contains(dayName)) {
        return checkDate;
      }
      checkDate = checkDate.subtract(const Duration(days: 1));
      daysChecked++;
    }

    return null;
  }
}
