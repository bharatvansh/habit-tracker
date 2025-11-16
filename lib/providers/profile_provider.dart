import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/profile.dart';

const String _storageKey = 'userProfile';

class ProfileProvider with ChangeNotifier {
  late Profile _profile;

  Profile get profile => _profile;

  ProfileProvider() {
    _initializeDefaultProfile();
  }

  void _initializeDefaultProfile() {
    _profile = Profile(
      name: '',
      email: '',
      bio: '',
      timezone: 'UTC',
      avatarColor: '#8a2be2',
      notifications: NotificationSettings(
        emailReminders: true,
        pushReminders: false,
      ),
    );
  }

  Future<void> loadProfile() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final data = prefs.getString(_storageKey);

      if (data != null) {
        try {
          final decoded = jsonDecode(data) as Map<String, dynamic>;
          _profile = Profile.fromJson(decoded);
        } catch (e) {
          _initializeDefaultProfile();
        }
      } else {
        _initializeDefaultProfile();
      }
    } catch (e) {
      _initializeDefaultProfile();
    }

    notifyListeners();
  }

  Future<void> updateProfile(Profile newProfile) async {
    _profile = newProfile;
    await _saveProfile();
    notifyListeners();
  }

  Future<void> updateProfilePartial(Map<String, dynamic> updates) async {
    String name = _profile.name;
    String email = _profile.email;
    String bio = _profile.bio;
    String timezone = _profile.timezone;
    String avatarColor = _profile.avatarColor;
    NotificationSettings notifications = _profile.notifications;

    if (updates.containsKey('name')) {
      name = updates['name'] as String;
    }
    if (updates.containsKey('email')) {
      email = updates['email'] as String;
    }
    if (updates.containsKey('bio')) {
      bio = updates['bio'] as String;
    }
    if (updates.containsKey('timezone')) {
      timezone = updates['timezone'] as String;
    }
    if (updates.containsKey('avatarColor')) {
      avatarColor = updates['avatarColor'] as String;
    }
    if (updates.containsKey('notifications')) {
      notifications = updates['notifications'] as NotificationSettings;
    }

    _profile = Profile(
      name: name,
      email: email,
      bio: bio,
      timezone: timezone,
      avatarColor: avatarColor,
      notifications: notifications,
    );

    await _saveProfile();
    notifyListeners();
  }

  Future<void> resetProfile() async {
    _initializeDefaultProfile();
    await _saveProfile();
    notifyListeners();
  }

  Future<void> _saveProfile() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_storageKey, jsonEncode(_profile.toJson()));
    } catch (e) {
      debugPrint('Error saving profile: $e');
    }
  }
}
