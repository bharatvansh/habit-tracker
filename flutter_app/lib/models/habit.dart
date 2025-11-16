class Habit {
  final String id;
  final String name;
  final String? time;
  final String frequency;
  final List<String> days;
  final String category;
  final bool reminder;
  final int completed;
  final int streak;
  final String? lastCompletedDate;
  final int weeklyCompleted;
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
    required this.createdAt,
  });

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
      id: json['id'],
      name: json['name'],
      time: json['time'],
      frequency: json['frequency'],
      days: List<String>.from(json['days'] ?? []),
      category: json['category'],
      reminder: json['reminder'] ?? false,
      completed: json['completed'] ?? 0,
      streak: json['streak'] ?? 0,
      lastCompletedDate: json['lastCompletedDate'],
      weeklyCompleted: json['weeklyCompleted'] ?? 0,
      createdAt: json['createdAt'],
    );
  }
}
