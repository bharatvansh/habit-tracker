import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../constants/colors.dart';
import '../../providers/reminder_provider.dart';
import '../../screens/reminders/add_reminder_dialog.dart';

class ReminderList extends StatelessWidget {
  const ReminderList({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final reminderProvider = Provider.of<ReminderProvider>(context);
    final reminders = reminderProvider.reminders;

    reminders.sort((a, b) => DateTime.parse(a.datetime).compareTo(DateTime.parse(b.datetime)));

    return ListView.builder(
      padding: EdgeInsets.all(16),
      itemCount: reminders.length,
      itemBuilder: (context, index) {
        final reminder = reminders[index];
        final reminderDateTime = DateTime.parse(reminder.datetime);
        final dateStr = DateFormat('MMM dd').format(reminderDateTime);
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
            opacity: reminder.completed ? 0.6 : 1.0,
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Checkbox(
                value: reminder.completed,
                onChanged: (value) {
                  Provider.of<ReminderProvider>(context, listen: false).toggleComplete(reminder.id);
                },
                checkColor: Colors.white,
                fillColor: MaterialStateProperty.all(AppColors.purplePrimary),
              ),
              SizedBox(width: 8),
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
                        decoration: reminder.completed ? TextDecoration.lineThrough : null,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    SizedBox(height: 4),
                    Row(
                      children: [
                        Icon(Icons.access_time, size: 12, color: AppColors.textSecondary),
                        SizedBox(width: 4),
                        Text(
                          '$dateStr at $timeStr',
                          style: TextStyle(
                            fontSize: 12,
                            color: AppColors.textSecondary,
                          ),
                        ),
                        SizedBox(width: 8),
                        Container(
                          padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: _getPriorityColor(reminder.priority).withOpacity(0.2),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            reminder.priority.capitalize(),
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w600,
                              color: _getPriorityColor(reminder.priority),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              PopupMenuButton(
                color: AppColors.bgTertiary,
                itemBuilder: (context) => [
                  PopupMenuItem(
                    child: Text(
                      'Edit',
                      style: TextStyle(color: AppColors.textPrimary),
                    ),
                    onTap: () {
                      showDialog(
                        context: context,
                        builder: (context) => AddReminderDialog(reminderToEdit: reminder),
                      );
                    },
                  ),
                  PopupMenuItem(
                    child: Text(
                      'Delete',
                      style: TextStyle(color: AppColors.danger),
                    ),
                    onTap: () {
                      Provider.of<ReminderProvider>(context, listen: false).deleteReminder(reminder.id);
                    },
                  ),
                ],
              ),
            ],
          ),
        );
      },
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

extension StringExtension on String {
  String capitalize() {
    return "${this[0].toUpperCase()}${this.substring(1)}";
  }
}
