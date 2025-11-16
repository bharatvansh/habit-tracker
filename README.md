# Habit Tracker - Flutter App

A comprehensive cross-platform habit and reminder tracking application built with Flutter. Track your daily habits, manage reminders, monitor progress through analytics, and maintain streaks.

## 📱 Features

### Dashboard
- **Home Screen** - Welcome dashboard with key statistics and today's overview
- **Statistics Cards** - Total habits, completed today, current streak, weekly progress
- **Weekly View** - Visual representation of habit completion per day
- **Today's Tasks** - Quick access to habits and reminders due today

### Habit Management
- ✅ Create habits with name, time, frequency, and day selection
- 📅 Support for daily, weekly, and monthly habits
- 🔔 Optional reminders for each habit
- 🏷️ Organize by categories (customizable)
- 🔥 Automatic streak tracking
- 📊 Weekly completion counter (resets every Monday)
- ✏️ Edit and delete existing habits

### Reminder Management
- 📝 Create reminders with title and date/time
- 🎯 Priority levels (High, Medium, Low)
- 🔔 Notification and alarm settings
- ✅ Mark reminders as complete
- 📅 View upcoming reminders
- ✏️ Edit and delete reminders

### Analytics
- 📊 Weekly habit completion chart
- 🥧 Category distribution pie chart
- 📈 Progress statistics
- 🎯 Success rate tracking

### Profile
- 👤 User profile management
- 🎨 Custom avatar color
- 📧 Email and timezone settings
- 🔔 Notification preferences
- 📝 Personal bio

### Data & Storage
- 💾 Automatic local storage via SharedPreferences
- 🔄 Real-time state synchronization
- 📱 Offline-first architecture
- 🔐 Secure local data encryption (device-level)
- ⏰ Weekly automatic reset on Monday

## 🏗️ Architecture

### State Management
- **Provider Pattern** - Reactive state management using `provider` package
- **Change Notification** - Automatic UI updates on data changes
- **Async Operations** - Future-based operations with proper error handling

### Data Persistence
- **SharedPreferences** - Local storage for all data
- **JSON Serialization** - Models with toJson/fromJson methods
- **Atomic Writes** - All changes immediately persisted

### Components
```
App Root
├── MultiProvider (HabitProvider, ReminderProvider, ProfileProvider)
├── MaterialApp (Theme, Navigation)
└── HomePage
    ├── AppDrawer (Navigation)
    └── Dynamic Screens
        ├── HomeScreen
        ├── HabitsScreen
        ├── RemindersScreen
        ├── AnalyticsScreen
        └── ProfileScreen
```

## 🎨 Design System

### Color Scheme (Dark Theme)
- **Primary Background**: #121212
- **Secondary Background**: #1e1e1e
- **Tertiary Background**: #252525
- **Primary Accent**: #8a2be2 (Purple)
- **Text Primary**: #ffffff
- **Text Secondary**: #b3b3b3
- **Success**: #4caf50 (Green)
- **Warning**: #ffc107 (Orange)
- **Danger**: #f44336 (Red)
- **Info**: #2196f3 (Blue)

### Typography
- **Font Family**: Segoe UI (fallback: system default)
- **Display Large**: 32px, Bold
- **Title Large**: 18px, Semi-Bold
- **Body Large**: 16px, Regular
- **Caption**: 12px, Regular

## 📁 Project Structure

```
habit_tracker/
├── lib/
│   ├── main.dart                          # App entry point
│   ├── constants/
│   │   └── colors.dart                    # Theme and colors
│   ├── models/
│   │   ├── habit.dart                     # Habit model
│   │   ├── reminder.dart                  # Reminder model
│   │   └── profile.dart                   # Profile model
│   ├── providers/
│   │   ├── habit_provider.dart            # Habit state
│   │   ├── reminder_provider.dart         # Reminder state
│   │   └── profile_provider.dart          # Profile state
│   ├── screens/
│   │   ├── home/
│   │   │   └── home_screen.dart
│   │   ├── habits/
│   │   │   ├── habits_screen.dart
│   │   │   └── add_habit_dialog.dart
│   │   ├── reminders/
│   │   │   ├── reminders_screen.dart
│   │   │   └── add_reminder_dialog.dart
│   │   ├── analytics/
│   │   │   └── analytics_screen.dart
│   │   └── profile/
│   │       └── profile_screen.dart
│   ├── widgets/
│   │   ├── common/
│   │   │   ├── app_drawer.dart            # Navigation drawer
│   │   │   └── stat_card.dart             # Stat card widget
│   │   ├── home/
│   │   │   ├── weekly_view.dart
│   │   │   └── upcoming_list.dart
│   │   ├── habits/
│   │   │   └── habit_list.dart
│   │   └── reminders/
│   │       └── reminder_list.dart
│   └── utils/
│       ├── id_generator.dart              # UUID generation
│       └── date_utils.dart                # Date utilities
├── android/                               # Android configuration
├── ios/                                   # iOS configuration
├── web/                                   # Web configuration
├── test/                                  # Unit and widget tests
├── pubspec.yaml                           # Dependencies
├── analysis_options.yaml                  # Linting rules
├── README.md                              # This file
├── FLUTTER_README.md                      # Flutter-specific docs
├── MIGRATION_GUIDE.md                     # React to Flutter migration
└── TESTING.md                             # Testing guide
```

## 🚀 Getting Started

### Prerequisites
- Flutter SDK (^3.0.0)
- Dart SDK (included with Flutter)
- Android SDK 21+ or iOS 11+

### Installation

1. **Clone repository**
   ```bash
   git clone <repository>
   cd habit_tracker
   ```

2. **Install dependencies**
   ```bash
   flutter pub get
   ```

3. **Run the app**
   ```bash
   flutter run
   ```

### Building for Production

**Android:**
```bash
flutter build apk --release
flutter build appbundle --release
```

**iOS:**
```bash
flutter build ios --release
```

**Web:**
```bash
flutter build web --release
```

## 📊 Data Models

### Habit
```dart
class Habit {
  String id;
  String name;
  String? time;              // HH:MM format
  String frequency;          // daily, weekly, monthly
  List<String> days;         // Monday-Sunday
  String category;           // Health, Work, Personal, etc.
  bool reminder;             // Enable reminder
  int completed;             // Total completions
  int streak;                // Current streak
  String? lastCompletedDate; // YYYY-MM-DD format
  int weeklyCompleted;       // Resets every Monday
  String createdAt;          // ISO 8601 format
}
```

### Reminder
```dart
class Reminder {
  String id;
  String title;
  String datetime;           // ISO 8601 format
  bool alarm;                // Enable alarm
  bool notification;         // Enable notification
  String priority;           // high, medium, low
  String? category;          // Optional category
  bool completed;            // Completion status
  String? completedAt;       // ISO 8601 format when completed
}
```

### Profile
```dart
class Profile {
  String name;
  String email;
  String bio;
  String timezone;
  String avatarColor;        // Hex color code
  NotificationSettings notifications;
}
```

## 🔄 Key Workflows

### Creating a Habit
1. User taps "Add" button on Habits screen
2. AddHabitDialog opens with form
3. Fill in habit details (name required, days required)
4. Select category and frequency
5. Tap "Add Habit" to save
6. Habit appears in list and saved to storage

### Completing a Habit
1. User taps checkbox on habit or reminder
2. System checks if already completed today
3. If scheduled today, increment streak (if consecutive days)
4. Increment weekly counter
5. Update lastCompletedDate
6. Persist to storage
7. UI updates instantly

### Weekly Reset
1. App launches on Monday
2. System checks if reset already occurred today
3. If not, reset weeklyCompleted counter for all habits
4. Save timestamp to prevent duplicate resets
5. User sees counters at zero

## 🧪 Testing

See [TESTING.md](TESTING.md) for comprehensive testing guide.

```bash
# Run all tests
flutter test

# Run with coverage
flutter test --coverage

# Run specific file
flutter test test/models_test.dart
```

## 🛠️ Development

### Environment Setup
```bash
# Check Flutter installation
flutter doctor

# Update Flutter
flutter upgrade

# Get all packages
flutter pub get

# Analyze code
flutter analyze

# Format code
dart format lib/
```

### Running in Different Modes

**Debug (default, slowest, most debuggable)**
```bash
flutter run
```

**Profile (faster, some debugging)**
```bash
flutter run --profile
```

**Release (fastest, production)**
```bash
flutter run --release
```

## 📚 Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| provider | ^6.1.0 | State management |
| shared_preferences | ^2.2.2 | Local storage |
| intl | ^0.19.0 | Date/time formatting |
| uuid | ^4.0.0 | ID generation |
| fl_chart | ^0.65.0 | Charts and graphs |
| flutter_local_notifications | ^16.3.0 | Local notifications |

## 🐛 Troubleshooting

### App won't start
```bash
# Clean and rebuild
flutter clean
flutter pub get
flutter run
```

### Data not persisting
- Check that `await` is used with save operations
- Verify storage permissions (Android 6+, iOS)
- Clear app data if corrupted: Settings → Apps → Habit Tracker → Clear Data

### UI not updating
- Ensure `Provider.of(context, listen: true)` is used
- Check that `notifyListeners()` is called after changes
- Verify `Consumer` or `ChangeNotifierProvider` wraps widget

### Performance issues
- Use `Profile` mode: `flutter run --profile`
- Check DevTools Performance tab
- Monitor memory usage in emulator

## 📝 Contributing

1. Follow Dart style guide
2. Use meaningful commit messages
3. Add tests for new features
4. Update documentation
5. Ensure `flutter analyze` passes

## 📄 License

This project is part of the Flutter migration from Next.js/React.

## 🔗 Related Documentation

- [FLUTTER_README.md](FLUTTER_README.md) - Flutter-specific features
- [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - React to Flutter migration details
- [TESTING.md](TESTING.md) - Comprehensive testing guide
- [Flutter Documentation](https://flutter.dev/docs)
- [Provider Package](https://pub.dev/packages/provider)

## ✨ Features Roadmap

### Completed ✅
- Home dashboard with statistics
- Habit CRUD and tracking
- Reminder CRUD and completion
- Analytics with charts
- Profile management
- Local data persistence
- Weekly reset functionality

### Planned 🔜
- Cloud synchronization
- Push notifications
- Habit templates
- Advanced analytics
- Social sharing
- Widget support
- Dark/light theme toggle
- Offline sync

## 📞 Support

For issues or questions:
1. Check [TESTING.md](TESTING.md) troubleshooting section
2. Review [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) for architecture details
3. Check Flutter documentation

---

**Last Updated**: January 2024
**Flutter Version**: 3.0+
**Dart Version**: 3.0+
