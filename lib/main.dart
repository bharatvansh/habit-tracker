import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'constants/colors.dart';
import 'providers/habit_provider.dart';
import 'providers/profile_provider.dart';
import 'providers/reminder_provider.dart';
import 'screens/home/home_screen.dart';
import 'screens/habits/habits_screen.dart';
import 'screens/reminders/reminders_screen.dart';
import 'screens/analytics/analytics_screen.dart';
import 'screens/profile/profile_screen.dart';
import 'widgets/common/app_drawer.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => HabitProvider()),
        ChangeNotifierProvider(create: (_) => ReminderProvider()),
        ChangeNotifierProvider(create: (_) => ProfileProvider()),
      ],
      child: MaterialApp(
        title: 'Habit Tracker',
        theme: AppTheme.darkTheme,
        home: const HomePage(),
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  String _currentPage = 'home';

  @override
  void initState() {
    super.initState();
    _initializeApp();
  }

  Future<void> _initializeApp() async {
    // Load all data
    await Provider.of<HabitProvider>(context, listen: false).loadHabits();
    await Provider.of<ReminderProvider>(context, listen: false).loadReminders();
    await Provider.of<ProfileProvider>(context, listen: false).loadProfile();

    // Check for weekly reset
    _checkWeeklyReset();
  }

  Future<void> _checkWeeklyReset() async {
    final today = DateTime.now();
    if (today.weekday == DateTime.monday) {
      final prefs = await SharedPreferences.getInstance();
      final lastResetKey = 'lastWeeklyReset';
      final lastReset = prefs.getString(lastResetKey);
      final thisMonday = today.toString().split(' ')[0];

      if (lastReset != thisMonday) {
        if (mounted) {
          Provider.of<HabitProvider>(context, listen: false).resetWeeklyStats();
          await prefs.setString(lastResetKey, thisMonday);
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgPrimary,
      drawer: AppDrawer(
        currentPage: _currentPage,
        onPageSelected: (page) {
          setState(() => _currentPage = page);
          Navigator.pop(context);
        },
      ),
      appBar: AppBar(
        backgroundColor: AppColors.bgSecondary,
        elevation: 0,
        title: Row(
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                border: Border.all(color: AppColors.purplePrimary, width: 2),
                borderRadius: BorderRadius.circular(50),
              ),
              child: Center(
                child: Icon(
                  Icons.track_changes,
                  color: AppColors.purplePrimary,
                  size: 18,
                ),
              ),
            ),
            SizedBox(width: 12),
            Text(
              'Habit Tracker',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
          ],
        ),
      ),
      body: _buildCurrentPage(),
    );
  }

  Widget _buildCurrentPage() {
    switch (_currentPage) {
      case 'habits':
        return HabitsScreen();
      case 'reminders':
        return RemindersScreen();
      case 'analytics':
        return AnalyticsScreen();
      case 'profile':
        return ProfileScreen();
      default:
        return HomeScreen();
    }
  }
}
