# Quick Start Guide - Flutter Habit Tracker

## 🚀 Get Started in 5 Minutes

### Step 1: Prerequisites
```bash
# Check if Flutter is installed
flutter --version

# If not installed, download from: https://docs.flutter.dev/get-started/install
```

### Step 2: Install Dependencies
```bash
cd flutter_app
flutter pub get
```

### Step 3: Run the App
```bash
# On connected device or emulator
flutter run

# Or specify platform
flutter run -d chrome        # Web
flutter run -d android       # Android
flutter run -d ios           # iOS
flutter run -d windows       # Windows
flutter run -d macos         # macOS
flutter run -d linux         # Linux
```

That's it! The app should now be running.

## 📱 Platform-Specific Instructions

### Android
1. Enable USB debugging on your device
2. Connect via USB or use emulator
3. Run: `flutter run -d android`

### iOS (Requires macOS)
1. Open Xcode and install command line tools
2. Run iOS Simulator or connect device
3. Run: `flutter run -d ios`

### Web
```bash
flutter run -d chrome
# Or build for deployment:
flutter build web --release
```

### Desktop

**Windows:**
```bash
flutter config --enable-windows-desktop
flutter run -d windows
```

**macOS:**
```bash
flutter config --enable-macos-desktop
flutter run -d macos
```

**Linux:**
```bash
flutter config --enable-linux-desktop
flutter run -d linux
```

## 🏗️ Building for Production

### Android APK
```bash
flutter build apk --release
# Output: build/app/outputs/flutter-apk/app-release.apk
```

### Android App Bundle (for Play Store)
```bash
flutter build appbundle --release
# Output: build/app/outputs/bundle/release/app-release.aab
```

### iOS (Requires macOS and Xcode)
```bash
flutter build ios --release
# Then use Xcode to archive and upload to App Store
```

### Web
```bash
flutter build web --release
# Output: build/web/
# Deploy contents to any web server
```

### Windows
```bash
flutter build windows --release
# Output: build/windows/runner/Release/
```

### macOS
```bash
flutter build macos --release
# Output: build/macos/Build/Products/Release/
```

### Linux
```bash
flutter build linux --release
# Output: build/linux/x64/release/bundle/
```

## 🔧 Development Tips

### Hot Reload
While app is running, press:
- `r` - Hot reload (fast)
- `R` - Hot restart (slower, full restart)
- `q` - Quit

### Debug Mode
```bash
flutter run --debug
```

### Release Mode
```bash
flutter run --release
```

### Profile Mode (for performance testing)
```bash
flutter run --profile
```

### View Logs
```bash
flutter logs
```

### Clear Cache
```bash
flutter clean
flutter pub get
```

## 📋 Troubleshooting

### "Flutter SDK not found"
1. Install Flutter: https://docs.flutter.dev/get-started/install
2. Add to PATH
3. Run: `flutter doctor`

### "No devices found"
- **Android**: Start emulator or connect device with USB debugging
- **iOS**: Start simulator or connect device
- **Web**: Chrome should be available by default
- **Desktop**: Enable with `flutter config --enable-[platform]-desktop`

### "Gradle build failed" (Android)
```bash
cd android
./gradlew clean
cd ..
flutter clean
flutter pub get
flutter run
```

### "Pod install failed" (iOS)
```bash
cd ios
pod deintegrate
pod install
cd ..
flutter run
```

### Dependencies Issues
```bash
flutter clean
rm -rf pubspec.lock
flutter pub get
```

## 🎯 Quick Feature Tour

### Home Screen
- View daily greeting and date
- See stats (habits today, total habits, reminders)
- Check weekly progress calendar
- View upcoming habits and reminders

### Habits Screen
- Tap "Add Habit" to create new habit
- View summary cards (completion rate, streaks)
- Filter by category or search
- Tap checkmark to complete habit
- Tap trash to delete habit

### Reminders Screen
- Tap "Add Reminder" to create reminder
- Set date, time, priority
- Filter by All, Today, Upcoming, Completed
- Check off to mark complete
- Tap menu for edit/delete

### Analytics Screen
- View statistics (total, completed, streaks)
- See weekly activity bar chart
- Check category breakdown
- Review habit history

### Profile Screen
- Update name, email, bio
- Set timezone
- Toggle notifications
- Change avatar color
- Reset to defaults

## 📚 Documentation

- **README.md** - Full documentation
- **FLUTTER_MIGRATION.md** - Migration details
- **MIGRATION_COMPLETE.md** - Complete summary

## 🆘 Support

Having issues? Check:
1. `flutter doctor` - Checks your setup
2. `flutter pub get` - Installs dependencies
3. `flutter clean` - Clears cache
4. Documentation in README.md

## 🎉 You're Ready!

The app should now be running. Start tracking your habits!

### First Steps
1. Click "Add Habit" to create your first habit
2. Set name, frequency, and days
3. Mark it complete when done
4. Watch your streak grow!

---

**Need Help?** See README.md for detailed documentation.
