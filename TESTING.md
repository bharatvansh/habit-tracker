# Flutter Habit Tracker - Testing Guide

## Running the Application

### Prerequisites
- Flutter SDK installed and in PATH
- A device or emulator/simulator configured
- Android SDK (for Android development) or Xcode (for iOS development)

### Setup

1. **Install dependencies:**
```bash
flutter pub get
```

2. **Get Flutter packages:**
```bash
flutter pub upgrade
```

### Running the App

**On Android Emulator:**
```bash
flutter emulators --launch Pixel_5_API_30
flutter run
```

**On iOS Simulator:**
```bash
open -a Simulator
flutter run
```

**On Physical Device:**
```bash
# Connect device via USB with USB debugging enabled
flutter devices  # To verify connection
flutter run
```

**On Web:**
```bash
flutter run -d chrome
```

## Manual Testing Scenarios

### 1. Home Screen
- [ ] App launches to home screen
- [ ] Stats cards display correctly (Total Habits, Completed Today, Streak, Weekly Progress)
- [ ] Weekly view shows all 7 days with progress indicators
- [ ] Upcoming list shows today's habits and reminders
- [ ] Numbers update correctly after marking items complete

### 2. Habit Management
- [ ] Can create a new habit
  - [ ] Name field required
  - [ ] Days selection required (minimum 1)
  - [ ] Category dropdown works
  - [ ] Time picker works
  - [ ] Reminder toggle works
  - [ ] Frequency selector works
  
- [ ] Can view all habits grouped by category
- [ ] Can mark habit complete (check icon toggles, streak updates)
- [ ] Can edit habit (opens dialog with current values)
- [ ] Can delete habit (removes from list)
- [ ] Can manage categories (add/delete)

### 3. Reminder Management
- [ ] Can create a new reminder
  - [ ] Title field required
  - [ ] Date/time picker works
  - [ ] Priority selector shows high/medium/low
  - [ ] Alarm toggle works
  - [ ] Notification toggle works
  
- [ ] Reminders sorted by date and time
- [ ] Can mark reminder complete (checkbox toggles)
- [ ] Can edit reminder (opens dialog with current values)
- [ ] Can delete reminder (removes from list)
- [ ] Completed reminders shown with strikethrough

### 4. Analytics Screen
- [ ] Chart displays weekly completion data
- [ ] Pie chart shows category distribution
- [ ] Stats cards show accurate numbers
- [ ] Charts update when data changes

### 5. Profile Screen
- [ ] Avatar displays with first letter
- [ ] Can edit all profile fields (name, email, bio, timezone)
- [ ] Changes persist after navigation
- [ ] Notification toggles work
- [ ] Save button updates profile

### 6. Navigation
- [ ] Drawer opens/closes smoothly
- [ ] Navigation items highlight current page
- [ ] Switching pages preserves state
- [ ] App bar shows correct title

### 7. Data Persistence
- [ ] Hot restart preserves all data
- [ ] Cold start (force stop + restart) preserves all data
- [ ] SharedPreferences saves data immediately
- [ ] Multiple habits can be created and persisted

### 8. Weekly Reset (Monday Only)
- [ ] On Monday, weekly counts reset
- [ ] Reset happens automatically on app launch
- [ ] Reset only happens once per week
- [ ] Overall completion counts remain

## Automated Testing

### Unit Tests

Create `test/models_test.dart`:
```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:habit_tracker/models/habit.dart';

void main() {
  group('Habit Model', () {
    test('creates habit with required fields', () {
      final habit = Habit(
        id: 'test-1',
        name: 'Morning Run',
        frequency: 'daily',
        days: ['Monday', 'Wednesday', 'Friday'],
        category: 'Health',
        reminder: true,
      );
      
      expect(habit.name, 'Morning Run');
      expect(habit.days.length, 3);
      expect(habit.streak, 0);
    });

    test('copyWith creates new instance with updated fields', () {
      final habit1 = Habit(
        id: 'test-1',
        name: 'Run',
        frequency: 'daily',
        days: ['Monday'],
        category: 'Health',
        reminder: false,
      );
      
      final habit2 = habit1.copyWith(name: 'Walk', streak: 5);
      
      expect(habit2.name, 'Walk');
      expect(habit2.streak, 5);
      expect(habit1.name, 'Run'); // Original unchanged
    });

    test('toJson/fromJson preserves data', () {
      final habit = Habit(
        id: 'test-1',
        name: 'Study',
        frequency: 'daily',
        days: ['Tuesday', 'Thursday'],
        category: 'Work',
        reminder: true,
        completed: 10,
        streak: 3,
      );
      
      final json = habit.toJson();
      final restored = Habit.fromJson(json);
      
      expect(restored.name, habit.name);
      expect(restored.completed, habit.completed);
      expect(restored.streak, habit.streak);
    });
  });
}
```

### Widget Tests

Create `test/widgets_test.dart`:
```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:habit_tracker/constants/colors.dart';

void main() {
  group('StatCard Widget', () {
    testWidgets('displays label and value', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: StatCard(
              label: 'Total Habits',
              value: '5',
              icon: Icons.track_changes,
            ),
          ),
        ),
      );

      expect(find.text('Total Habits'), findsOneWidget);
      expect(find.text('5'), findsOneWidget);
      expect(find.byIcon(Icons.track_changes), findsOneWidget);
    });
  });
}
```

### Provider Tests

Create `test/providers_test.dart`:
```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:habit_tracker/models/habit.dart';
import 'package:habit_tracker/providers/habit_provider.dart';

void main() {
  group('HabitProvider', () {
    test('adds habit to list', () async {
      final provider = HabitProvider();
      final habit = Habit(
        id: 'test-1',
        name: 'Test Habit',
        frequency: 'daily',
        days: ['Monday'],
        category: 'Health',
        reminder: false,
      );

      await provider.addHabit(habit);
      
      expect(provider.habits.length, 1);
      expect(provider.habits.first.name, 'Test Habit');
    });

    test('deletes habit from list', () async {
      final provider = HabitProvider();
      final habit = Habit(
        id: 'test-1',
        name: 'Test Habit',
        frequency: 'daily',
        days: ['Monday'],
        category: 'Health',
        reminder: false,
      );

      await provider.addHabit(habit);
      expect(provider.habits.length, 1);
      
      await provider.deleteHabit('test-1');
      expect(provider.habits.length, 0);
    });

    test('calculates total habits correctly', () async {
      final provider = HabitProvider();
      
      for (int i = 0; i < 3; i++) {
        await provider.addHabit(Habit(
          id: 'test-$i',
          name: 'Habit $i',
          frequency: 'daily',
          days: ['Monday'],
          category: 'Health',
          reminder: false,
        ));
      }
      
      expect(provider.getTotalHabits(), 3);
    });
  });
}
```

## Running Tests

```bash
# Run all tests
flutter test

# Run specific test file
flutter test test/models_test.dart

# Run tests with coverage
flutter test --coverage

# View coverage report
genhtml coverage/lcov.info -o coverage/html
open coverage/html/index.html
```

## Performance Testing

### Memory Usage
```bash
# Run app with memory profiling
flutter run --profile

# Open DevTools
flutter devices  # Get device ID
devtools --vm-service-port=51863
```

### Frame Rate
- Use Flutter DevTools Performance tab
- Look for 60 FPS (smooth) or 120 FPS (high refresh rate)
- Monitor for jank (dropped frames)

## UI Testing

### Visual Regression
```dart
// Use WidgetTester for golden file testing
testWidgets('home screen matches golden', (WidgetTester tester) async {
  await tester.pumpWidget(MyApp());
  await expectLater(
    find.byType(HomeScreen),
    matchesGoldenFile('goldens/home_screen.png'),
  );
});
```

## Debugging Tips

### Enable Debug Output
```bash
# Verbose logging
flutter run -v

# Profile mode (better performance than debug)
flutter run --profile

# Release mode (production)
flutter run --release
```

### Common Issues

**Issue: Widget not updating after state change**
- Ensure Provider.of includes `listen: true` (default)
- Check that notifyListeners() is called
- Verify Consumer/Provider widget wraps the widget

**Issue: SharedPreferences not persisting**
- Check that await is used with save operations
- Verify storage key names match
- Clear app data: `flutter clean && flutter pub get`

**Issue: Navigation not working**
- Verify screen names match in switch statement
- Check drawer item tap handlers
- Ensure context is correct for Navigator.pop()

## Testing Checklist

### Functionality
- [ ] All CRUD operations work
- [ ] Data persists correctly
- [ ] Weekly reset triggers on Monday
- [ ] Streak calculation is accurate
- [ ] Notifications toggle works
- [ ] Date picking works
- [ ] State updates propagate correctly

### UI/UX
- [ ] All screens render correctly
- [ ] Colors match design
- [ ] Text is readable
- [ ] Buttons are clickable
- [ ] Forms validate input
- [ ] Dialogs open/close smoothly
- [ ] Navigation works seamlessly

### Performance
- [ ] App launches within 2 seconds
- [ ] State updates are instant
- [ ] No memory leaks
- [ ] Smooth animations/transitions
- [ ] No UI jank

### Compatibility
- [ ] Works on Android 5.0+
- [ ] Works on iOS 11.0+
- [ ] Orientation changes handled
- [ ] Different screen sizes supported
- [ ] Dark theme applied consistently

## Regression Testing

Create a test data file to verify against:
```dart
final testHabits = [
  Habit(id: '1', name: 'Morning Run', frequency: 'daily', days: ['Mon', 'Wed', 'Fri'], category: 'Health', reminder: true),
  Habit(id: '2', name: 'Read', frequency: 'daily', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], category: 'Personal', reminder: false),
];

final testReminders = [
  Reminder(id: '1', title: 'Doctor Appointment', datetime: '2024-01-20T10:00:00Z', alarm: true, notification: true, priority: 'high'),
  Reminder(id: '2', title: 'Buy groceries', datetime: '2024-01-20T15:00:00Z', alarm: false, notification: true, priority: 'medium'),
];
```

Run tests against this data to ensure consistent behavior.
