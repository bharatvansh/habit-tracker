import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../../constants/colors.dart';
import '../../models/reminder.dart';
import '../../providers/reminder_provider.dart';
import '../../utils/id_generator.dart';

class AddReminderDialog extends StatefulWidget {
  final Reminder? reminderToEdit;

  const AddReminderDialog({Key? key, this.reminderToEdit}) : super(key: key);

  @override
  State<AddReminderDialog> createState() => _AddReminderDialogState();
}

class _AddReminderDialogState extends State<AddReminderDialog> {
  late TextEditingController titleController;
  late DateTime selectedDateTime;
  late String selectedPriority;
  late bool enableAlarm;
  late bool enableNotification;

  @override
  void initState() {
    super.initState();
    final reminder = widget.reminderToEdit;
    titleController = TextEditingController(text: reminder?.title ?? '');
    selectedDateTime = reminder != null ? DateTime.parse(reminder.datetime) : DateTime.now().add(Duration(hours: 1));
    selectedPriority = reminder?.priority ?? 'medium';
    enableAlarm = reminder?.alarm ?? false;
    enableNotification = reminder?.notification ?? true;
  }

  @override
  void dispose() {
    titleController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: AppColors.bgSecondary,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: SingleChildScrollView(
        padding: EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.reminderToEdit != null ? 'Edit Reminder' : 'Add New Reminder',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
            SizedBox(height: 20),
            TextField(
              controller: titleController,
              style: TextStyle(color: AppColors.textPrimary),
              decoration: InputDecoration(
                labelText: 'Reminder Title',
                hintText: 'e.g., Take medication',
                filled: true,
                fillColor: AppColors.bgTertiary,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: BorderSide.none,
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: BorderSide(color: AppColors.purplePrimary, width: 2),
                ),
                labelStyle: TextStyle(color: AppColors.textSecondary),
                hintStyle: TextStyle(color: AppColors.textSecondary),
              ),
            ),
            SizedBox(height: 16),
            Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: () async {
                  final date = await showDatePicker(
                    context: context,
                    initialDate: selectedDateTime,
                    firstDate: DateTime.now(),
                    lastDate: DateTime.now().add(Duration(days: 365)),
                  );

                  if (date != null) {
                    final time = await showTimePicker(
                      context: context,
                      initialTime: TimeOfDay.fromDateTime(selectedDateTime),
                    );

                    if (time != null) {
                      setState(() {
                        selectedDateTime = DateTime(date.year, date.month, date.day, time.hour, time.minute);
                      });
                    }
                  }
                },
                child: Container(
                  padding: EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.bgTertiary,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: AppColors.bgTertiary),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        DateFormat('MMM dd, yyyy HH:mm').format(selectedDateTime),
                        style: TextStyle(color: AppColors.textPrimary),
                      ),
                      Icon(Icons.calendar_today, color: AppColors.purplePrimary),
                    ],
                  ),
                ),
              ),
            ),
            SizedBox(height: 16),
            Text(
              'Priority',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: AppColors.textPrimary,
              ),
            ),
            SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: ['low', 'medium', 'high'].map((priority) {
                return FilterChip(
                  label: Text(priority.capitalize()),
                  selected: selectedPriority == priority,
                  onSelected: (selected) {
                    setState(() => selectedPriority = priority);
                  },
                  backgroundColor: AppColors.bgTertiary,
                  selectedColor: _getPriorityColor(priority),
                  labelStyle: TextStyle(
                    color: selectedPriority == priority ? Colors.white : AppColors.textSecondary,
                  ),
                );
              }).toList(),
            ),
            SizedBox(height: 16),
            Row(
              children: [
                Text(
                  'Alarm',
                  style: TextStyle(
                    fontSize: 14,
                    color: AppColors.textPrimary,
                  ),
                ),
                Spacer(),
                Switch(
                  value: enableAlarm,
                  onChanged: (value) {
                    setState(() => enableAlarm = value);
                  },
                  activeColor: AppColors.purplePrimary,
                ),
              ],
            ),
            Row(
              children: [
                Text(
                  'Notification',
                  style: TextStyle(
                    fontSize: 14,
                    color: AppColors.textPrimary,
                  ),
                ),
                Spacer(),
                Switch(
                  value: enableNotification,
                  onChanged: (value) {
                    setState(() => enableNotification = value);
                  },
                  activeColor: AppColors.purplePrimary,
                ),
              ],
            ),
            SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: Text(
                    'Cancel',
                    style: TextStyle(color: AppColors.textSecondary),
                  ),
                ),
                SizedBox(width: 12),
                ElevatedButton(
                  onPressed: () {
                    if (titleController.text.isEmpty) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Please enter a reminder title')),
                      );
                      return;
                    }

                    final reminder = Reminder(
                      id: widget.reminderToEdit?.id ?? generateId(),
                      title: titleController.text,
                      datetime: selectedDateTime.toIso8601String(),
                      alarm: enableAlarm,
                      notification: enableNotification,
                      priority: selectedPriority,
                      completed: widget.reminderToEdit?.completed ?? false,
                      completedAt: widget.reminderToEdit?.completedAt,
                    );

                    if (widget.reminderToEdit == null) {
                      Provider.of<ReminderProvider>(context, listen: false).addReminder(reminder);
                    } else {
                      Provider.of<ReminderProvider>(context, listen: false)
                          .editReminder(widget.reminderToEdit!.id, reminder);
                    }

                    Navigator.pop(context);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.purplePrimary,
                  ),
                  child: Text(widget.reminderToEdit != null ? 'Update' : 'Add Reminder'),
                ),
              ],
            ),
          ],
        ),
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

extension StringExtension on String {
  String capitalize() {
    return "${this[0].toUpperCase()}${this.substring(1)}";
  }
}
