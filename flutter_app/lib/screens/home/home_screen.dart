import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/habit_provider.dart';
import '../../providers/reminder_provider.dart';
import '../../widgets/common/loading_spinner.dart';
import '../../widgets/common/custom_card.dart';
import '../../utils/theme.dart';
import 'package:intl/intl.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer2<HabitProvider, ReminderProvider>(
      builder: (context, habitProvider, reminderProvider, child) {
        if (habitProvider.isLoading || reminderProvider.isLoading) {
          return const LoadingSpinner(
            message: 'Loading your habits and reminders...',
          );
        }

        return SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(),
              const SizedBox(height: 24),
              _buildStatCards(habitProvider, reminderProvider),
              const SizedBox(height: 32),
              _buildSectionHeader('This Week'),
              const SizedBox(height: 16),
              _buildWeeklyView(habitProvider),
              const SizedBox(height: 32),
              _buildSectionHeader('Upcoming Today'),
              const SizedBox(height: 16),
              _buildUpcomingList(habitProvider, reminderProvider),
            ],
          ),
        );
      },
    );
  }

  Widget _buildHeader() {
    final now = DateTime.now();
    final greeting = _getGreeting(now.hour);
    final dateStr = DateFormat('EEEE, MMMM d, yyyy').format(now);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          greeting,
          style: const TextStyle(
            fontSize: 32,
            fontWeight: FontWeight.bold,
            color: AppTheme.textPrimary,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          dateStr,
          style: const TextStyle(
            fontSize: 16,
            color: AppTheme.textSecondary,
          ),
        ),
      ],
    );
  }

  String _getGreeting(int hour) {
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  Widget _buildSectionHeader(String title) {
    return Text(
      title,
      style: const TextStyle(
        fontSize: 20,
        fontWeight: FontWeight.w600,
        color: AppTheme.textPrimary,
      ),
    );
  }

  Widget _buildStatCards(HabitProvider habitProvider, ReminderProvider reminderProvider) {
    final habits = habitProvider.habits;
    final today = DateTime.now().toIso8601String().split('T')[0];
    final completedToday = habits.where((h) => h.lastCompletedDate == today).length;
    final totalHabits = habits.length;
    final activeToday = habits.where((h) {
      final dayOfWeek = DateFormat('EEEE').format(DateTime.now());
      return h.days.contains(dayOfWeek);
    }).length;

    final reminders = reminderProvider.reminders;
    final todayReminders = reminderProvider.getFilteredReminders('today').length;
    final upcomingReminders = reminderProvider.getFilteredReminders('upcoming').length;

    return Row(
      children: [
        Expanded(
          child: _buildStatCard(
            'Habits Today',
            '$completedToday/$activeToday',
            'completed',
            Icons.check_circle,
            AppTheme.success,
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _buildStatCard(
            'Total Habits',
            '$totalHabits',
            'tracked',
            Icons.task_outlined,
            AppTheme.purplePrimary,
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _buildStatCard(
            'Reminders',
            '$todayReminders',
            'today',
            Icons.notifications_active,
            AppTheme.info,
          ),
        ),
      ],
    );
  }

  Widget _buildStatCard(String title, String value, String subtitle, IconData icon, Color color) {
    return CustomCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Icon(icon, color: color, size: 28),
              Text(
                value,
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: color,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            title,
            style: const TextStyle(
              fontSize: 14,
              color: AppTheme.textSecondary,
              fontWeight: FontWeight.w500,
            ),
          ),
          Text(
            subtitle,
            style: const TextStyle(
              fontSize: 12,
              color: AppTheme.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildWeeklyView(HabitProvider habitProvider) {
    final today = DateTime.now();
    final startOfWeek = today.subtract(Duration(days: today.weekday - 1));

    return CustomCard(
      child: Column(
        children: [
          const Text(
            'Weekly Progress',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: AppTheme.textPrimary,
            ),
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: List.generate(7, (index) {
              final date = startOfWeek.add(Duration(days: index));
              final dateStr = date.toIso8601String().split('T')[0];
              final dayName = DateFormat('E').format(date);
              final isToday = dateStr == DateTime.now().toIso8601String().split('T')[0];
              
              final completedCount = habitProvider.habits
                  .where((h) => h.lastCompletedDate == dateStr)
                  .length;

              return _buildDayColumn(dayName, date.day.toString(), completedCount > 0, isToday);
            }),
          ),
        ],
      ),
    );
  }

  Widget _buildDayColumn(String day, String date, bool hasActivity, bool isToday) {
    return Column(
      children: [
        Text(
          day,
          style: TextStyle(
            fontSize: 12,
            color: isToday ? AppTheme.purplePrimary : AppTheme.textSecondary,
            fontWeight: isToday ? FontWeight.w600 : FontWeight.normal,
          ),
        ),
        const SizedBox(height: 8),
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: hasActivity
                ? AppTheme.success.withOpacity(0.2)
                : AppTheme.bgTertiary,
            borderRadius: BorderRadius.circular(20),
            border: isToday
                ? Border.all(color: AppTheme.purplePrimary, width: 2)
                : null,
          ),
          child: Center(
            child: Text(
              date,
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: hasActivity ? AppTheme.success : AppTheme.textSecondary,
              ),
            ),
          ),
        ),
        if (hasActivity)
          Padding(
            padding: const EdgeInsets.only(top: 8),
            child: Icon(
              Icons.check_circle,
              size: 16,
              color: AppTheme.success,
            ),
          ),
      ],
    );
  }

  Widget _buildUpcomingList(HabitProvider habitProvider, ReminderProvider reminderProvider) {
    final today = DateTime.now();
    final dayOfWeek = DateFormat('EEEE').format(today);
    final todayStr = today.toIso8601String().split('T')[0];
    
    final todayHabits = habitProvider.habits.where((h) {
      return h.days.contains(dayOfWeek) && h.lastCompletedDate != todayStr;
    }).toList();

    final todayReminders = reminderProvider.getFilteredReminders('today');

    if (todayHabits.isEmpty && todayReminders.isEmpty) {
      return CustomCard(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(32.0),
            child: Column(
              children: const [
                Icon(
                  Icons.check_circle_outline,
                  size: 48,
                  color: AppTheme.textSecondary,
                ),
                SizedBox(height: 16),
                Text(
                  'All caught up!',
                  style: TextStyle(
                    fontSize: 16,
                    color: AppTheme.textSecondary,
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return Column(
      children: [
        ...todayHabits.take(3).map((habit) => Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: CustomCard(
                child: ListTile(
                  leading: const Icon(
                    Icons.circle_outlined,
                    color: AppTheme.purplePrimary,
                  ),
                  title: Text(
                    habit.name,
                    style: const TextStyle(color: AppTheme.textPrimary),
                  ),
                  subtitle: Text(
                    habit.time ?? 'No time set',
                    style: const TextStyle(color: AppTheme.textSecondary),
                  ),
                  trailing: Chip(
                    label: Text(habit.category),
                    backgroundColor: AppTheme.purplePrimary.withOpacity(0.2),
                  ),
                ),
              ),
            )),
        ...todayReminders.take(3).map((reminder) => Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: CustomCard(
                child: ListTile(
                  leading: const Icon(
                    Icons.notifications_outlined,
                    color: AppTheme.info,
                  ),
                  title: Text(
                    reminder.title,
                    style: const TextStyle(color: AppTheme.textPrimary),
                  ),
                  subtitle: Text(
                    DateFormat('h:mm a').format(DateTime.parse(reminder.datetime)),
                    style: const TextStyle(color: AppTheme.textSecondary),
                  ),
                  trailing: reminder.priority != null
                      ? Chip(
                          label: Text(reminder.priority!.toUpperCase()),
                          backgroundColor: _getPriorityColor(reminder.priority!),
                        )
                      : null,
                ),
              ),
            )),
      ],
    );
  }

  Color _getPriorityColor(String priority) {
    switch (priority.toLowerCase()) {
      case 'high':
        return AppTheme.danger.withOpacity(0.2);
      case 'medium':
        return AppTheme.warning.withOpacity(0.2);
      case 'low':
        return AppTheme.info.withOpacity(0.2);
      default:
        return AppTheme.textSecondary.withOpacity(0.2);
    }
  }
}
