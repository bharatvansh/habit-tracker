class Reminder {
  final String id;
  final String title;
  final String datetime;
  final bool alarm;
  final bool notification;
  final String? priority;
  final String? category;
  final bool completed;
  final String? completedAt;

  Reminder({
    required this.id,
    required this.title,
    required this.datetime,
    this.alarm = false,
    this.notification = false,
    this.priority,
    this.category,
    this.completed = false,
    this.completedAt,
  });

  Reminder copyWith({
    String? id,
    String? title,
    String? datetime,
    bool? alarm,
    bool? notification,
    String? priority,
    String? category,
    bool? completed,
    String? completedAt,
  }) {
    return Reminder(
      id: id ?? this.id,
      title: title ?? this.title,
      datetime: datetime ?? this.datetime,
      alarm: alarm ?? this.alarm,
      notification: notification ?? this.notification,
      priority: priority ?? this.priority,
      category: category ?? this.category,
      completed: completed ?? this.completed,
      completedAt: completedAt ?? this.completedAt,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'datetime': datetime,
      'alarm': alarm,
      'notification': notification,
      'priority': priority,
      'category': category,
      'completed': completed,
      'completedAt': completedAt,
    };
  }

  factory Reminder.fromJson(Map<String, dynamic> json) {
    return Reminder(
      id: json['id'],
      title: json['title'],
      datetime: json['datetime'],
      alarm: json['alarm'] ?? false,
      notification: json['notification'] ?? false,
      priority: json['priority'],
      category: json['category'],
      completed: json['completed'] ?? false,
      completedAt: json['completedAt'],
    );
  }
}
