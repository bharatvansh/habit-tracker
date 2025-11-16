import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../constants/colors.dart';
import '../../providers/habit_provider.dart';
import '../../providers/reminder_provider.dart';
import '../../widgets/common/stat_card.dart';
import '../../widgets/home/weekly_view.dart';
import '../../widgets/home/upcoming_list.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    await Provider.of<HabitProvider>(context, listen: false).loadHabits();
    await Provider.of<ReminderProvider>(context, listen: false).loadReminders();
  }

  @override
  Widget build(BuildContext context) {
    final habitProvider = Provider.of<HabitProvider>(context);
    final reminderProvider = Provider.of<ReminderProvider>(context);

    if (habitProvider.isLoading || reminderProvider.isLoading) {
      return Scaffold(
        backgroundColor: AppColors.bgPrimary,
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              SizedBox(
                width: 50,
                height: 50,
                child: CircularProgressIndicator(
                  valueColor: AlwaysStoppedAnimation<Color>(AppColors.purplePrimary),
                  strokeWidth: 4,
                ),
              ),
              SizedBox(height: 16),
              Text(
                'Loading your habits and reminders...',
                style: TextStyle(color: AppColors.textSecondary),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: AppColors.bgPrimary,
      body: SingleChildScrollView(
        padding: EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(height: 12),
            Text(
              'Welcome back!',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
            SizedBox(height: 4),
            Text(
              'Let\'s track your habits today',
              style: TextStyle(
                fontSize: 14,
                color: AppColors.textSecondary,
              ),
            ),
            SizedBox(height: 24),
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: NeverScrollableScrollPhysics(),
              mainAxisSpacing: 16,
              crossAxisSpacing: 16,
              children: [
                StatCard(
                  label: 'Total Habits',
                  value: habitProvider.getTotalHabits().toString(),
                  icon: Icons.track_changes,
                ),
                StatCard(
                  label: 'Completed Today',
                  value: habitProvider.getCompletedToday().toString(),
                  icon: Icons.check_circle,
                ),
                StatCard(
                  label: 'Current Streak',
                  value: habitProvider.getStreak().toString(),
                  icon: Icons.local_fire_department,
                ),
                StatCard(
                  label: 'Weekly Progress',
                  value: '${habitProvider.getWeeklyProgress()}%',
                  icon: Icons.trending_up,
                ),
              ],
            ),
            SizedBox(height: 32),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'This Week',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
              ],
            ),
            SizedBox(height: 12),
            WeeklyView(),
            SizedBox(height: 32),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Upcoming Today',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: AppColors.textPrimary,
                  ),
                ),
              ],
            ),
            SizedBox(height: 12),
            UpcomingList(),
          ],
        ),
      ),
    );
  }
}
