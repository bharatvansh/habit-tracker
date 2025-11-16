import 'package:flutter/material.dart';

class AppColors {
  // Background colors
  static const Color bgPrimary = Color(0xFF121212);
  static const Color bgSecondary = Color(0xFF1e1e1e);
  static const Color bgTertiary = Color(0xFF252525);

  // Purple theme
  static const Color purplePrimary = Color(0xFF8a2be2);
  static const Color purpleLight = Color(0xFF9b4ee3);
  static const Color purpleDark = Color(0xFF6a1cb0);

  // Text colors
  static const Color textPrimary = Color(0xFFffffff);
  static const Color textSecondary = Color(0xFFb3b3b3);

  // Status colors
  static const Color success = Color(0xFF4caf50);
  static const Color warning = Color(0xFFffc107);
  static const Color danger = Color(0xFFf44336);
  static const Color info = Color(0xFF2196f3);

  // Chart colors
  static const List<Color> chartColors = [
    Color(0xFF8a2be2), // Purple
    Color(0xFF2196f3), // Blue
    Color(0xFF4caf50), // Green
    Color(0xFFffc107), // Orange
    Color(0xFFf44336), // Red
  ];
}

class AppTheme {
  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    scaffoldBackgroundColor: AppColors.bgPrimary,
    primaryColor: AppColors.purplePrimary,
    colorScheme: ColorScheme.dark(
      primary: AppColors.purplePrimary,
      secondary: AppColors.purpleLight,
      surface: AppColors.bgSecondary,
      background: AppColors.bgPrimary,
    ),
    appBarTheme: AppBarTheme(
      backgroundColor: AppColors.bgSecondary,
      elevation: 0,
      centerTitle: false,
      titleTextStyle: TextStyle(
        color: AppColors.textPrimary,
        fontSize: 18,
        fontWeight: FontWeight.w600,
      ),
    ),
    cardTheme: CardTheme(
      color: AppColors.bgSecondary,
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
    ),
    textTheme: TextTheme(
      displayLarge: TextStyle(
        color: AppColors.textPrimary,
        fontWeight: FontWeight.w700,
        fontSize: 32,
      ),
      displayMedium: TextStyle(
        color: AppColors.textPrimary,
        fontWeight: FontWeight.w600,
        fontSize: 24,
      ),
      titleLarge: TextStyle(
        color: AppColors.textPrimary,
        fontWeight: FontWeight.w600,
        fontSize: 18,
      ),
      titleMedium: TextStyle(
        color: AppColors.textPrimary,
        fontWeight: FontWeight.w500,
        fontSize: 16,
      ),
      bodyLarge: TextStyle(
        color: AppColors.textPrimary,
        fontSize: 16,
      ),
      bodyMedium: TextStyle(
        color: AppColors.textSecondary,
        fontSize: 14,
      ),
      bodySmall: TextStyle(
        color: AppColors.textSecondary,
        fontSize: 12,
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: AppColors.purplePrimary,
        foregroundColor: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: AppColors.purplePrimary,
        side: BorderSide(color: AppColors.purplePrimary),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: AppColors.bgTertiary,
      contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide.none,
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide.none,
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: BorderSide(color: AppColors.purplePrimary, width: 2),
      ),
      hintStyle: TextStyle(color: AppColors.textSecondary),
      labelStyle: TextStyle(color: AppColors.textPrimary),
    ),
  );
}
