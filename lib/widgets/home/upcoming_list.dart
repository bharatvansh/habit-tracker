import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../constants/colors.dart';
import '../../providers/reminder_provider.dart';
import '../../providers/habit_provider.dart';

class UpcomingList extends StatelessWidget {
  const UpcomingList({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final reminderProvider = Provider.of<ReminderProvider>(context);
    final habitProvider = Provider.of<HabitProvider>(context);

    final upcomingReminders = reminderProvider.getRemindersForToday();
    final habitsForToday = habitProvider.getHabitsForToday();

    if (upcomingReminders.isEmpty && habitsForToday.isEmpty) {
      return Container(
        padding: EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: AppColors.bgSecondary,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Center(
          child: Text(
            'No reminders or habits for today',
            style: TextStyle(color: AppColors.textSecondary),
          ),
        ),
      );
    }

    return SingleChildScrollView(
      child: Column(
        children: [
          ...upcomingReminders.map((reminder) {
            final reminderDateTime = DateTime.parse(reminder.datetime);
            final timeStr = DateFormat('HH:mm').format(reminderDateTime);

            return Container(
              margin: EdgeInsets.only(bottom: 12),
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.bgSecondary,
                borderRadius: BorderRadius.circular(12),
                border: Border.left(
                  color: _getPriorityColor(reminder.priority),
                  width: 4,
                ),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(
                    Icons.notification_important,
                    color: _getPriorityColor(reminder.priority),
                    size: 20,
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          reminder.title,
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: AppColors.textPrimary,
                          ),
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        SizedBox(height: 4),
                        Text(
                          timeStr,
                          style: TextStyle(
                            fontSize: 12,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Checkbox(
                    value: reminder.completed,
                    onChanged: (value) {
                      Provider.of<ReminderProvider>(context, listen: false)
                          .toggleComplete(reminder.id);
                    },
                    checkColor: Colors.white,
                    fillColor: MaterialStateProperty.all(AppColors.purplePrimary),
                  ),
                ],
              ),
            );
          }).toList(),
          ...habitsForToday.map((habit) {
            final isCompletedToday = habit.lastCompletedDate == DateTime.now().toString().split(' ')[0];

            return Container(
              margin: EdgeInsets.only(bottom: 12),
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.bgSecondary,
                borderRadius: BorderRadius.circular(12),
                border: Border.left(
                  color: isCompletedToday ? AppColors.success : AppColors.info,
                  width: 4,
                ),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(
                    Icons.task_alt,
                    color: isCompletedToday ? AppColors.success : AppColors.info,
                    size: 20,
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          habit.name,
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: AppColors.textPrimary,
                            decoration: isCompletedToday ? TextDecoration.lineThrough : null,
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Streak: ${habit.streak}',
                          style: TextStyle(
                            fontSize: 12,
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Checkbox(
                    value: isCompletedToday,
                    onChanged: (value) {
                      Provider.of<HabitProvider>(context, listen: false)
                          .markHabitComplete(habit.id);
                    },
                    checkColor: Colors.white,
                    fillColor: MaterialStateProperty.all(AppColors.purplePrimary),
                  ),
                ],
              ),
            );
          }).toList(),
        ],
      ),
    );
  }

  Color _getPriorityColor(String priority) {
    switch (priority) {
      case 'high':
        return AppColors.danger;
      case 'medium':
        return AppColors.warning;
      case 'low':
        return AppColors.info;
      default:
        return AppColors.textSecondary;
    }
  }
}
