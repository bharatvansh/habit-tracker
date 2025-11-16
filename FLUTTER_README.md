# Habit Tracker - Flutter Version

A comprehensive habit and reminder tracking app built with Flutter, preserving all features from the original Next.js/React implementation.

## Features

### 1. **Home Dashboard**
- Welcome screen with key statistics
- Total habits, completed today, current streak, weekly progress
- Weekly view showing habit completion per day
- Upcoming reminders and habits for today
- Quick completion toggles

### 2. **Habit Management**
- Create, edit, and delete habits
- Support for multiple categories (Health, Work, Personal, custom)
- Set frequency (daily, weekly, monthly)
- Select specific days of the week
- Optional reminders for each habit
- Track completion history and streaks
- View habits by category

### 3. **Reminder Management**
- Create, edit, and delete reminders
- Date and time selection with date picker
- Priority levels (low, medium, high)
- Toggle alarm and notification settings
- Mark reminders as complete
- Sort by date and priority

### 4. **Analytics**
- Weekly habit completion chart
- Category distribution pie chart
- Statistics dashboard
- Historical data tracking

### 5. **Profile Management**
- User profile with avatar
- Personal information (name, email, bio, timezone)
- Notification settings (email and push)
- Profile picture customization
- Settings persistence

### 6. **Data Persistence**
- LocalStorage via SharedPreferences
- Automatic save on state changes
- Weekly reset functionality (resets weekly stats on Monday)
- Zustand-like persistence pattern

## Project Structure

```
lib/
├── main.dart                 # App entry point
├── constants/
│   └── colors.dart          # Color scheme and theme
├── models/
│   ├── habit.dart           # Habit model
│   ├── reminder.dart        # Reminder model
│   └── profile.dart         # Profile model
├── providers/
│   ├── habit_provider.dart  # Habit state management
│   ├── reminder_provider.dart # Reminder state management
│   └── profile_provider.dart  # Profile state management
├── screens/
│   ├── home/home_screen.dart
│   ├── habits/
│   │   ├── habits_screen.dart
│   │   └── add_habit_dialog.dart
│   ├── reminders/
│   │   ├── reminders_screen.dart
│   │   └── add_reminder_dialog.dart
│   ├── analytics/analytics_screen.dart
│   └── profile/profile_screen.dart
├── widgets/
│   ├── common/
│   │   ├── app_drawer.dart
│   │   └── stat_card.dart
│   ├── home/
│   │   ├── weekly_view.dart
│   │   └── upcoming_list.dart
│   ├── habits/
│   │   └── habit_list.dart
│   └── reminders/
│       └── reminder_list.dart
└── utils/
    ├── id_generator.dart
    └── date_utils.dart
```

## Key Technologies

- **State Management**: Provider package
- **Local Storage**: SharedPreferences
- **UI Framework**: Flutter Material Design 3
- **Charts**: fl_chart
- **Date Handling**: intl package
- **ID Generation**: uuid package

## Theme

The app uses a dark theme with purple accents matching the original design:
- Primary Background: #121212
- Secondary Background: #1e1e1e
- Tertiary Background: #252525
- Primary Color (Purple): #8a2be2
- Text Primary: #ffffff
- Text Secondary: #b3b3b3

## Getting Started

### Prerequisites
- Flutter SDK (^3.0.0)
- Dart SDK (included with Flutter)

### Installation

1. Clone the repository
2. Run `flutter pub get` to install dependencies
3. Run `flutter run` to start the app

### Building

```bash
# Android
flutter build apk

# iOS
flutter build ios

# Web
flutter build web
```

## State Management Architecture

The app uses Provider pattern for state management, similar to the original Zustand stores:

- **HabitProvider**: Manages habits list, categories, and weekly stats
- **ReminderProvider**: Manages reminders and completion status
- **ProfileProvider**: Manages user profile and settings

All state is persisted to SharedPreferences and automatically restored on app launch.

## Data Models

### Habit
- id: String (UUID)
- name: String
- time: String (optional, HH:MM format)
- frequency: String (daily, weekly, monthly)
- days: List<String> (Monday-Sunday)
- category: String
- reminder: bool
- completed: int (total count)
- streak: int (consecutive days)
- lastCompletedDate: String (ISO format)
- weeklyCompleted: int (resets every Monday)
- createdAt: String (ISO format)

### Reminder
- id: String (UUID)
- title: String
- datetime: String (ISO format)
- alarm: bool
- notification: bool
- priority: String (high, medium, low)
- category: String (optional)
- completed: bool
- completedAt: String (optional, ISO format)

### Profile
- name: String
- email: String
- bio: String
- timezone: String
- avatarColor: String (hex color)
- notifications: NotificationSettings

## UI Consistency

The Flutter implementation maintains visual parity with the original React version:
- Same color scheme and typography
- Identical component layouts
- Consistent navigation structure
- Same animation patterns
- Matching button and input styles

## Weekly Reset

The app automatically resets weekly statistics every Monday:
- Checks if it's Monday
- Verifies if reset has already occurred today
- Resets `weeklyCompleted` count for all habits
- Persists the reset timestamp

## Future Enhancements

- Cloud synchronization
- Habit suggestions based on time of day
- Advanced analytics and insights
- Social sharing features
- Integration with native notifications
- Widgets for home screen
- Dark/Light theme toggle

## Contributing

This is a direct port of the Next.js/React application to Flutter. All features have been preserved with equivalent functionality.

## Notes

- All data is stored locally on the device
- No backend/API integration required
- All features work offline
- Storage is persistent across app sessions
- Settings sync across all screens in real-time through Provider listeners
