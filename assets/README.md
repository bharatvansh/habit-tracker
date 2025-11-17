# Assets Directory

This directory contains app assets such as:
- Images (icons, logos, splash screens)
- Fonts
- Audio files (notification sounds)
- Other static assets

## Required Assets

For a complete Expo app, you'll need:

### App Icon
- `icon.png` (1024x1024) - Main app icon
- `adaptive-icon.png` (1024x1024) - Adaptive icon for Android

### Splash Screen
- `splash.png` (1242x2436) - Launch screen image
- `splash-dark.png` (1242x2436) - Dark mode splash (optional)

### Notification Sound
- `sounds/notification.wav` - Custom notification sound

### Fonts (Optional)
- Custom font files if using non-system fonts

## Placeholder Assets

For development, you can use placeholder files or Expo's default assets.

## Generating Assets

Use Expo's asset generation tools:
```bash
npx expo install @expo/vector-icons
npx expo install expo-font
```

Or use online tools like:
- AppIcon.co for app icons
- AppImageGenerator for splash screens