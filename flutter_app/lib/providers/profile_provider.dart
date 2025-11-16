import 'package:flutter/foundation.dart';
import '../models/profile.dart';
import '../services/storage_service.dart';

class ProfileProvider with ChangeNotifier {
  final StorageService _storage = StorageService();
  UserProfile _profile = UserProfile();

  UserProfile get profile => _profile;

  ProfileProvider() {
    loadProfile();
  }

  Future<void> loadProfile() async {
    _profile = await _storage.loadProfile();
    notifyListeners();
  }

  Future<void> updateProfile(UserProfile profile) async {
    _profile = profile;
    await _storage.saveProfile(_profile);
    notifyListeners();
  }

  Future<void> resetProfile() async {
    _profile = UserProfile();
    await _storage.saveProfile(_profile);
    notifyListeners();
  }
}
