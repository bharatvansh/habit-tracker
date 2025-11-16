# Habit Tracker Flutter App

A beautiful and feature-rich habit tracking application built with Flutter, migrated from the original Next.js/React implementation.

## Features

✅ **Habit Tracking**
- Create and manage daily, weekly, or custom habits
- Track completion with streak counters
- Organize habits by categories (Health, Work, Personal, etc.)
- Set reminders for habits
- Search and filter habits
- Visual progress indicators

✅ **Reminders**
- Create reminders with custom date and time
- Set priority levels (High, Medium, Low)
- Enable alarms and notifications
- Filter by today, upcoming, or completed
- Mark reminders as complete

✅ **Analytics Dashboard**
- View habit statistics and completion rates
- Weekly activity charts
- Category breakdown
- Habit history and trends
- Longest streak tracking

✅ **Profile Management**
- Customize user profile
- Set timezone preferences
- Configure notification settings
- Personalize avatar color

✅ **Data Persistence**
- All data stored locally using SharedPreferences
- Automatic weekly stats reset
- Secure data storage

## UI Design

The Flutter app preserves the original Next.js app's design:
- **Dark theme** with purple accent colors
- **Card-based layout** for better organization
- **Responsive design** that works on mobile and tablet
- **Smooth animations** for transitions
- **Material Design** components

## Getting Started

### Prerequisites

- Flutter SDK (3.0.0 or higher)
- Dart SDK (3.0.0 or higher)
- Android Studio / VS Code with Flutter extensions
- iOS development tools (for iOS builds)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/bharatvansh/habit-tracker.git
cd habit-tracker/flutter_app
```

2. Install dependencies:
```bash
flutter pub get
```

3. Run the app:
```bash
flutter run
```

### Building for Production

**Android:**
```bash
flutter build apk --release
```

**iOS:**
```bash
flutter build ios --release
```

**Web:**
```bash
flutter build web --release
```

## Project Structure

```
lib/
├── main.dart                 # App entry point
├── models/                   # Data models
│   ├── habit.dart
│   ├── reminder.dart
│   └── profile.dart
├── providers/                # State management
│   ├── habit_provider.dart
│   ├── reminder_provider.dart
│   └── profile_provider.dart
├── screens/                  # App screens
│   ├── home/
│   ├── habits/
│   ├── reminders/
│   ├── analytics/
│   └── profile/
├── widgets/                  # Reusable widgets
│   ├── common/
│   └── charts/
├── services/                 # Services
│   └── storage_service.dart
└── utils/                    # Utilities
    ├── theme.dart
    └── constants.dart
```

## Dependencies

- **provider**: State management
- **shared_preferences**: Local data storage
- **fl_chart**: Charts and graphs for analytics
- **google_fonts**: Custom typography
- **intl**: Date formatting
- **uuid**: Unique ID generation

## Color Scheme

- **Primary Purple**: `#8A2BE2`
- **Success Green**: `#4CAF50`
- **Warning Yellow**: `#FFC107`
- **Danger Red**: `#F44336`
- **Info Blue**: `#2196F3`
- **Background**: `#121212` (Dark)
- **Secondary Background**: `#1E1E1E`

## Features Comparison

| Feature | Next.js/React | Flutter |
|---------|--------------|---------|
| Habit Tracking | ✅ | ✅ |
| Reminders | ✅ | ✅ |
| Analytics | ✅ | ✅ |
| Profile Management | ✅ | ✅ |
| Dark Theme | ✅ | ✅ |
| Local Storage | ✅ (localStorage) | ✅ (SharedPreferences) |
| Responsive UI | ✅ | ✅ |
| Cross-platform | Web only | Android, iOS, Web, Desktop |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is part of the habit-tracker repository.

## Acknowledgments

- Original Next.js implementation
- Flutter team for the amazing framework
- All contributors to the project
