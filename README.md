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

## 🚀 Future Improvements & Roadmap

We've prepared comprehensive documentation for taking this app to the next level:

**📌 [START HERE - Complete Navigation Guide](./START_HERE.md)**

### 📚 Improvement Documentation
- **[IMPROVEMENTS_SUMMARY.md](./IMPROVEMENTS_SUMMARY.md)** - ⭐ Start here! Overview of all recommendations
- **[IMPROVEMENTS_RECOMMENDATIONS.md](./IMPROVEMENTS_RECOMMENDATIONS.md)** - 24 extraordinary features to make this app truly unique
- **[TECHNICAL_IMPLEMENTATION_ROADMAP.md](./TECHNICAL_IMPLEMENTATION_ROADMAP.md)** - Detailed technical specs for top features
- **[QUICK_WINS.md](./QUICK_WINS.md)** - 15 features you can implement today (1-4 hours each)
- **[COMPETITIVE_ANALYSIS.md](./COMPETITIVE_ANALYSIS.md)** - Market positioning and competitive advantages
- **[VISUAL_MOCKUP_GUIDE.md](./VISUAL_MOCKUP_GUIDE.md)** - UI/UX design specifications and mockups

### 🌟 Highlighted Features to Implement
1. **Habit DNA™** - Unique visual identity system representing your habit patterns
2. **Miss Intelligence System** - Learn from failures instead of punishing them
3. **Habit Impact Calculator** - Quantify real-world progress
4. **Streak Celebrations** - Milestone rewards and confetti animations
5. **Heatmap Calendar** - GitHub-style contribution view
6. **Achievement System** - Gamification with badges and unlockables

These features would transform Habitual from a simple tracker into the most unique and engaging habit formation platform available.

## License

MIT License - see LICENSE file for details