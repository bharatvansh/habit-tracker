class Profile {
  final String name;
  final String email;
  final String bio;
  final String timezone;
  final String avatarColor;
  final NotificationSettings notifications;

  Profile({
    required this.name,
    required this.email,
    required this.bio,
    required this.timezone,
    required this.avatarColor,
    required this.notifications,
  });

  Profile copyWith({
    String? name,
    String? email,
    String? bio,
    String? timezone,
    String? avatarColor,
    NotificationSettings? notifications,
  }) {
    return Profile(
      name: name ?? this.name,
      email: email ?? this.email,
      bio: bio ?? this.bio,
      timezone: timezone ?? this.timezone,
      avatarColor: avatarColor ?? this.avatarColor,
      notifications: notifications ?? this.notifications,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'email': email,
      'bio': bio,
      'timezone': timezone,
      'avatarColor': avatarColor,
      'notifications': notifications.toJson(),
    };
  }

  factory Profile.fromJson(Map<String, dynamic> json) {
    return Profile(
      name: json['name'] as String? ?? '',
      email: json['email'] as String? ?? '',
      bio: json['bio'] as String? ?? '',
      timezone: json['timezone'] as String? ?? 'UTC',
      avatarColor: json['avatarColor'] as String? ?? '#8a2be2',
      notifications: NotificationSettings.fromJson(
        json['notifications'] as Map<String, dynamic>? ?? {},
      ),
    );
  }
}

class NotificationSettings {
  final bool emailReminders;
  final bool pushReminders;

  NotificationSettings({
    required this.emailReminders,
    required this.pushReminders,
  });

  NotificationSettings copyWith({
    bool? emailReminders,
    bool? pushReminders,
  }) {
    return NotificationSettings(
      emailReminders: emailReminders ?? this.emailReminders,
      pushReminders: pushReminders ?? this.pushReminders,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'emailReminders': emailReminders,
      'pushReminders': pushReminders,
    };
  }

  factory NotificationSettings.fromJson(Map<String, dynamic> json) {
    return NotificationSettings(
      emailReminders: json['emailReminders'] as bool? ?? true,
      pushReminders: json['pushReminders'] as bool? ?? false,
    );
  }
}
