import 'dart:convert';

class Habit {
  final String id;
  final String name;
  final String? time;
  final String frequency;
  final List<String> days;
  final String category;
  final bool reminder;
  int completed;
  int streak;
  final String? lastCompletedDate;
  int weeklyCompleted;
  final String createdAt;

  Habit({
    required this.id,
    required this.name,
    this.time,
    required this.frequency,
    required this.days,
    required this.category,
    required this.reminder,
    this.completed = 0,
    this.streak = 0,
    this.lastCompletedDate,
    this.weeklyCompleted = 0,
    String? createdAt,
  }) : createdAt = createdAt ?? DateTime.now().toIso8601String();

  Habit copyWith({
    String? id,
    String? name,
    String? time,
    String? frequency,
    List<String>? days,
    String? category,
    bool? reminder,
    int? completed,
    int? streak,
    String? lastCompletedDate,
    int? weeklyCompleted,
    String? createdAt,
  }) {
    return Habit(
      id: id ?? this.id,
      name: name ?? this.name,
      time: time ?? this.time,
      frequency: frequency ?? this.frequency,
      days: days ?? this.days,
      category: category ?? this.category,
      reminder: reminder ?? this.reminder,
      completed: completed ?? this.completed,
      streak: streak ?? this.streak,
      lastCompletedDate: lastCompletedDate ?? this.lastCompletedDate,
      weeklyCompleted: weeklyCompleted ?? this.weeklyCompleted,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'time': time,
      'frequency': frequency,
      'days': days,
      'category': category,
      'reminder': reminder,
      'completed': completed,
      'streak': streak,
      'lastCompletedDate': lastCompletedDate,
      'weeklyCompleted': weeklyCompleted,
      'createdAt': createdAt,
    };
  }

  factory Habit.fromJson(Map<String, dynamic> json) {
    return Habit(
      id: json['id'] as String,
      name: json['name'] as String,
      time: json['time'] as String?,
      frequency: json['frequency'] as String,
      days: List<String>.from(json['days'] as List),
      category: json['category'] as String,
      reminder: json['reminder'] as bool,
      completed: json['completed'] as int? ?? 0,
      streak: json['streak'] as int? ?? 0,
      lastCompletedDate: json['lastCompletedDate'] as String?,
      weeklyCompleted: json['weeklyCompleted'] as int? ?? 0,
      createdAt: json['createdAt'] as String? ?? DateTime.now().toIso8601String(),
    );
  }
}
