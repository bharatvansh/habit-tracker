import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../providers/reminder_provider.dart';
import '../../utils/theme.dart';
import '../../utils/constants.dart';

class ReminderAddDialog extends StatefulWidget {
  const ReminderAddDialog({Key? key}) : super(key: key);

  @override
  State<ReminderAddDialog> createState() => _ReminderAddDialogState();
}

class _ReminderAddDialogState extends State<ReminderAddDialog> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  
  DateTime _selectedDate = DateTime.now();
  TimeOfDay _selectedTime = TimeOfDay.now();
  String? _priority = 'medium';
  String? _category;
  bool _alarm = false;
  bool _notification = true;

  @override
  void dispose() {
    _titleController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: AppTheme.bgSecondary,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Container(
        width: 500,
        padding: const EdgeInsets.all(24),
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Add New Reminder',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.textPrimary,
                      ),
                    ),
                    IconButton(
                      onPressed: () => Navigator.pop(context),
                      icon: const Icon(Icons.close),
                      color: AppTheme.textSecondary,
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                
                // Title
                TextFormField(
                  controller: _titleController,
                  decoration: const InputDecoration(
                    labelText: 'Reminder Title',
                    hintText: 'Enter reminder title',
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter a title';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                
                // Date Selection
                InkWell(
                  onTap: () => _selectDate(context),
                  child: InputDecorator(
                    decoration: const InputDecoration(
                      labelText: 'Date',
                      suffixIcon: Icon(Icons.calendar_today, color: AppTheme.purplePrimary),
                    ),
                    child: Text(
                      DateFormat('MMMM d, yyyy').format(_selectedDate),
                      style: const TextStyle(color: AppTheme.textPrimary),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                
                // Time Selection
                InkWell(
                  onTap: () => _selectTime(context),
                  child: InputDecorator(
                    decoration: const InputDecoration(
                      labelText: 'Time',
                      suffixIcon: Icon(Icons.access_time, color: AppTheme.purplePrimary),
                    ),
                    child: Text(
                      _selectedTime.format(context),
                      style: const TextStyle(color: AppTheme.textPrimary),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                
                // Priority
                DropdownButtonFormField<String>(
                  value: _priority,
                  decoration: const InputDecoration(
                    labelText: 'Priority',
                  ),
                  items: AppConstants.priorities.map((priority) {
                    return DropdownMenuItem(
                      value: priority,
                      child: Text(priority.toUpperCase()),
                    );
                  }).toList(),
                  onChanged: (value) {
                    setState(() => _priority = value);
                  },
                ),
                const SizedBox(height: 16),
                
                // Category (Optional)
                TextFormField(
                  decoration: const InputDecoration(
                    labelText: 'Category (Optional)',
                    hintText: 'e.g., Work, Personal',
                  ),
                  onChanged: (value) {
                    _category = value.isEmpty ? null : value;
                  },
                ),
                const SizedBox(height: 16),
                
                // Alarm Toggle
                SwitchListTile(
                  title: const Text(
                    'Alarm',
                    style: TextStyle(color: AppTheme.textPrimary),
                  ),
                  subtitle: const Text(
                    'Play sound when reminder triggers',
                    style: TextStyle(color: AppTheme.textSecondary, fontSize: 12),
                  ),
                  value: _alarm,
                  onChanged: (value) {
                    setState(() => _alarm = value);
                  },
                  activeColor: AppTheme.purplePrimary,
                  contentPadding: EdgeInsets.zero,
                ),
                
                // Notification Toggle
                SwitchListTile(
                  title: const Text(
                    'Notification',
                    style: TextStyle(color: AppTheme.textPrimary),
                  ),
                  subtitle: const Text(
                    'Show notification when reminder triggers',
                    style: TextStyle(color: AppTheme.textSecondary, fontSize: 12),
                  ),
                  value: _notification,
                  onChanged: (value) {
                    setState(() => _notification = value);
                  },
                  activeColor: AppTheme.purplePrimary,
                  contentPadding: EdgeInsets.zero,
                ),
                const SizedBox(height: 24),
                
                // Action Buttons
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    OutlinedButton(
                      onPressed: () => Navigator.pop(context),
                      child: const Text('Cancel'),
                    ),
                    const SizedBox(width: 12),
                    ElevatedButton(
                      onPressed: _saveReminder,
                      child: const Text('Save Reminder'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
      builder: (context, child) {
        return Theme(
          data: ThemeData.dark().copyWith(
            colorScheme: const ColorScheme.dark(
              primary: AppTheme.purplePrimary,
              surface: AppTheme.bgSecondary,
            ),
          ),
          child: child!,
        );
      },
    );
    
    if (picked != null && picked != _selectedDate) {
      setState(() => _selectedDate = picked);
    }
  }

  Future<void> _selectTime(BuildContext context) async {
    final TimeOfDay? picked = await showTimePicker(
      context: context,
      initialTime: _selectedTime,
      builder: (context, child) {
        return Theme(
          data: ThemeData.dark().copyWith(
            colorScheme: const ColorScheme.dark(
              primary: AppTheme.purplePrimary,
              surface: AppTheme.bgSecondary,
            ),
          ),
          child: child!,
        );
      },
    );
    
    if (picked != null && picked != _selectedTime) {
      setState(() => _selectedTime = picked);
    }
  }

  void _saveReminder() {
    if (_formKey.currentState!.validate()) {
      final reminderProvider = Provider.of<ReminderProvider>(context, listen: false);
      
      // Combine date and time
      final datetime = DateTime(
        _selectedDate.year,
        _selectedDate.month,
        _selectedDate.day,
        _selectedTime.hour,
        _selectedTime.minute,
      );
      
      reminderProvider.addReminder(
        title: _titleController.text,
        datetime: datetime.toIso8601String(),
        alarm: _alarm,
        notification: _notification,
        priority: _priority,
        category: _category,
      );

      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Reminder "${_titleController.text}" created successfully!')),
      );
    }
  }
}
