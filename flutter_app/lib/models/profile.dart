class UserProfile {
  final String name;
  final String email;
  final String bio;
  final String timezone;
  final ProfileNotifications notifications;
  final String avatarColor;

  UserProfile({
    this.name = 'You',
    this.email = '',
    this.bio = '',
    this.timezone = 'UTC',
    ProfileNotifications? notifications,
    this.avatarColor = '#8a2be2',
  }) : notifications = notifications ?? ProfileNotifications();

  UserProfile copyWith({
    String? name,
    String? email,
    String? bio,
    String? timezone,
    ProfileNotifications? notifications,
    String? avatarColor,
  }) {
    return UserProfile(
      name: name ?? this.name,
      email: email ?? this.email,
      bio: bio ?? this.bio,
      timezone: timezone ?? this.timezone,
      notifications: notifications ?? this.notifications,
      avatarColor: avatarColor ?? this.avatarColor,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'email': email,
      'bio': bio,
      'timezone': timezone,
      'notifications': notifications.toJson(),
      'avatarColor': avatarColor,
    };
  }

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      name: json['name'] ?? 'You',
      email: json['email'] ?? '',
      bio: json['bio'] ?? '',
      timezone: json['timezone'] ?? 'UTC',
      notifications: json['notifications'] != null
          ? ProfileNotifications.fromJson(json['notifications'])
          : ProfileNotifications(),
      avatarColor: json['avatarColor'] ?? '#8a2be2',
    );
  }
}

class ProfileNotifications {
  final bool emailReminders;
  final bool pushReminders;

  ProfileNotifications({
    this.emailReminders = false,
    this.pushReminders = true,
  });

  ProfileNotifications copyWith({
    bool? emailReminders,
    bool? pushReminders,
  }) {
    return ProfileNotifications(
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

  factory ProfileNotifications.fromJson(Map<String, dynamic> json) {
    return ProfileNotifications(
      emailReminders: json['emailReminders'] ?? false,
      pushReminders: json['pushReminders'] ?? true,
    );
  }
}
