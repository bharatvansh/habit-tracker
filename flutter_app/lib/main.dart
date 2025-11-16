import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/habit_provider.dart';
import 'providers/reminder_provider.dart';
import 'providers/profile_provider.dart';
import 'screens/home/home_screen.dart';
import 'screens/habits/habits_screen.dart';
import 'screens/reminders/reminders_screen.dart';
import 'screens/analytics/analytics_screen.dart';
import 'screens/profile/profile_screen.dart';
import 'widgets/common/app_sidebar.dart';
import 'utils/theme.dart';
import 'utils/constants.dart';
import 'services/storage_service.dart';

void main() {
  runApp(const HabitTrackerApp());
}

class HabitTrackerApp extends StatelessWidget {
  const HabitTrackerApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => HabitProvider()),
        ChangeNotifierProvider(create: (_) => ReminderProvider()),
        ChangeNotifierProvider(create: (_) => ProfileProvider()),
      ],
      child: MaterialApp(
        title: AppConstants.appName,
        theme: AppTheme.darkTheme,
        debugShowCheckedModeBanner: false,
        home: const MainScreen(),
      ),
    );
  }
}

class MainScreen extends StatefulWidget {
  const MainScreen({Key? key}) : super(key: key);

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0;
  final StorageService _storageService = StorageService();

  @override
  void initState() {
    super.initState();
    _checkWeeklyReset();
  }

  Future<void> _checkWeeklyReset() async {
    final today = DateTime.now();
    if (today.weekday == DateTime.monday) {
      final lastReset = await _storageService.getLastWeeklyReset();
      final thisMonday = today.toIso8601String().split('T')[0];
      
      if (lastReset != thisMonday) {
        final habitProvider = Provider.of<HabitProvider>(context, listen: false);
        await habitProvider.resetWeeklyStats();
        await _storageService.setLastWeeklyReset(thisMonday);
      }
    }
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  Widget _getSelectedScreen() {
    switch (_selectedIndex) {
      case 0:
        return const HomeScreen();
      case 1:
        return const AnalyticsScreen();
      case 2:
        return const RemindersScreen();
      case 3:
        return const HabitsScreen();
      case 4:
        return const ProfileScreen();
      default:
        return const HomeScreen();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          AppSidebar(
            selectedIndex: _selectedIndex,
            onItemTapped: _onItemTapped,
          ),
          Expanded(
            child: AnimatedSwitcher(
              duration: const Duration(milliseconds: 300),
              child: _getSelectedScreen(),
            ),
          ),
        ],
      ),
    );
  }
}
