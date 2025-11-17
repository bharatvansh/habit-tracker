# Habitual - React Native Migration

A cross-platform habit and reminder tracker built with React Native and Expo.

## Features

- ✅ Habit tracking with categories and schedules
- ✅ Reminder management with priorities
- ✅ Analytics and progress tracking
- ✅ Cross-platform support (Android, iOS, Web, Windows)
- ✅ Native notifications
- ✅ Dark theme with Material Design
- ✅ Persistent storage with AsyncStorage

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (React Navigation)
- **State Management**: Zustand with AsyncStorage persistence
- **UI Components**: React Native Paper + Custom Components
- **Charts**: react-native-chart-kit (placeholder implementation)
- **Notifications**: expo-notifications
- **Styling**: StyleSheet + NativeWind (Tailwind CSS)
- **Storage**: AsyncStorage for cross-platform persistence

## Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- For native development: Xcode (iOS) / Android Studio

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on specific platforms
npm run android    # Android
npm run ios        # iOS  
npm run web        # Web
npm run windows    # Windows
```

## Project Structure

```
├── app/
│   ├── (tabs)/           # Tab navigation pages
│   │   ├── index.tsx     # Home page
│   │   ├── analytics.tsx # Analytics page
│   │   ├── habits.tsx    # Habits management
│   │   ├── reminders.tsx # Reminders management
│   │   └── profile.tsx   # User profile
│   └── _layout.tsx       # Root layout
├── components/
│   ├── home/             # Home page components
│   ├── habits/           # Habit-related components
│   ├── reminders/        # Reminder-related components
│   └── ui/              # Reusable UI components
├── store/               # Zustand stores
├── lib/                 # Utility functions
├── hooks/               # Custom React hooks
└── assets/              # Images, fonts, etc.
```

## Key Features

### Habit Tracking
- Create habits with custom schedules (daily, weekdays, weekends, custom)
- Track completion and streaks
- Categories for organization
- Time-based reminders
- Weekly progress visualization

### Reminders
- One-time and recurring reminders
- Priority levels (high, medium, low)
- Categories and metadata
- Alarm and notification options
- Completion tracking

### Analytics
- Completion rates and trends
- Streak tracking
- Category-based insights
- Visual charts and statistics

### Cross-Platform Features
- **Android**: Native notifications, Material Design
- **iOS**: Native notifications, iOS-style components
- **Web**: Responsive design, web notifications
- **Windows**: Desktop support with native Windows components

## Development Notes

### State Management
- Zustand stores for habits and reminders
- AsyncStorage for persistence
- Profile management with context

### Navigation
- Expo Router for file-based routing
- Tab navigation for main sections
- Modal navigation for forms

### Styling
- StyleSheet for performance
- NativeWind for Tailwind-like classes
- Dark theme throughout
- Consistent design system

### Notifications
- expo-notifications for cross-platform support
- Scheduled notifications for habits/reminders
- Permission handling

## Deployment

### Expo Build
```bash
# Build for all platforms
expo build

# Platform-specific builds
expo build:android
expo build:ios
expo build:web
```

### Web Deployment
- Optimized for PWA
- Responsive design
- Service worker support

## Migration Notes

This project was successfully migrated from Next.js to React Native while maintaining:

1. **Business Logic**: All Zustand stores and utility functions preserved
2. **UI Design**: Same visual appearance and user experience
3. **Features**: Complete feature parity with original web app
4. **Data**: Compatible data structures and storage format

### Key Changes Made
- Replaced web components with React Native equivalents
- Updated navigation from Next.js to Expo Router
- Migrated localStorage to AsyncStorage
- Added native notification support
- Implemented cross-platform styling
- Added platform-specific optimizations

## Contributing

1. Follow the existing code style
2. Test on all target platforms
3. Update documentation for new features
4. Use TypeScript for type safety

## License

MIT License - see LICENSE file for details