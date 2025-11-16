import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/habit_provider.dart';
import '../../utils/theme.dart';
import '../../utils/constants.dart';

class HabitAddDialog extends StatefulWidget {
  const HabitAddDialog({Key? key}) : super(key: key);

  @override
  State<HabitAddDialog> createState() => _HabitAddDialogState();
}

class _HabitAddDialogState extends State<HabitAddDialog> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _timeController = TextEditingController();
  
  String _frequency = 'daily';
  List<String> _selectedDays = [];
  String _category = 'Health';
  bool _reminder = false;

  @override
  void dispose() {
    _nameController.dispose();
    _timeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final habitProvider = Provider.of<HabitProvider>(context, listen: false);
    final categories = habitProvider.categories;

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
                      'Add New Habit',
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
                
                // Habit Name
                TextFormField(
                  controller: _nameController,
                  decoration: const InputDecoration(
                    labelText: 'Habit Name',
                    hintText: 'Enter habit name',
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter a habit name';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                
                // Time (Optional)
                TextFormField(
                  controller: _timeController,
                  decoration: const InputDecoration(
                    labelText: 'Time (Optional)',
                    hintText: 'e.g., 8:00 AM',
                  ),
                ),
                const SizedBox(height: 16),
                
                // Frequency
                DropdownButtonFormField<String>(
                  value: _frequency,
                  decoration: const InputDecoration(
                    labelText: 'Frequency',
                  ),
                  items: AppConstants.frequencies.map((freq) {
                    return DropdownMenuItem(
                      value: freq,
                      child: Text(freq.toUpperCase()),
                    );
                  }).toList(),
                  onChanged: (value) {
                    setState(() {
                      _frequency = value!;
                      if (_frequency == 'daily') {
                        _selectedDays = List.from(AppConstants.daysOfWeek);
                      }
                    });
                  },
                ),
                const SizedBox(height: 16),
                
                // Days Selection
                const Text(
                  'Select Days',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: AppTheme.textPrimary,
                  ),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  children: AppConstants.daysOfWeek.map((day) {
                    final isSelected = _selectedDays.contains(day);
                    return FilterChip(
                      label: Text(day.substring(0, 3)),
                      selected: isSelected,
                      onSelected: (selected) {
                        setState(() {
                          if (selected) {
                            _selectedDays.add(day);
                          } else {
                            _selectedDays.remove(day);
                          }
                        });
                      },
                      backgroundColor: AppTheme.bgTertiary,
                      selectedColor: AppTheme.purplePrimary,
                      labelStyle: TextStyle(
                        color: isSelected ? AppTheme.textPrimary : AppTheme.textSecondary,
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 16),
                
                // Category
                DropdownButtonFormField<String>(
                  value: _category,
                  decoration: const InputDecoration(
                    labelText: 'Category',
                  ),
                  items: categories.map((cat) {
                    return DropdownMenuItem(
                      value: cat,
                      child: Text(cat),
                    );
                  }).toList(),
                  onChanged: (value) {
                    setState(() => _category = value!);
                  },
                ),
                const SizedBox(height: 16),
                
                // Reminder Toggle
                SwitchListTile(
                  title: const Text(
                    'Enable Reminder',
                    style: TextStyle(color: AppTheme.textPrimary),
                  ),
                  value: _reminder,
                  onChanged: (value) {
                    setState(() => _reminder = value);
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
                      onPressed: _saveHabit,
                      child: const Text('Save Habit'),
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

  void _saveHabit() {
    if (_formKey.currentState!.validate()) {
      if (_selectedDays.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Please select at least one day')),
        );
        return;
      }

      final habitProvider = Provider.of<HabitProvider>(context, listen: false);
      habitProvider.addHabit(
        name: _nameController.text,
        time: _timeController.text.isNotEmpty ? _timeController.text : null,
        frequency: _frequency,
        days: _selectedDays,
        category: _category,
        reminder: _reminder,
      );

      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Habit "${_nameController.text}" created successfully!')),
      );
    }
  }
}
