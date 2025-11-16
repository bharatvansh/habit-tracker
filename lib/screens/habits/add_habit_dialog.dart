import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../constants/colors.dart';
import '../../models/habit.dart';
import '../../providers/habit_provider.dart';
import '../../utils/id_generator.dart';

class AddHabitDialog extends StatefulWidget {
  final Habit? habitToEdit;

  const AddHabitDialog({Key? key, this.habitToEdit}) : super(key: key);

  @override
  State<AddHabitDialog> createState() => _AddHabitDialogState();
}

class _AddHabitDialogState extends State<AddHabitDialog> {
  late TextEditingController nameController;
  late TextEditingController timeController;
  late String selectedCategory;
  late String selectedFrequency;
  late List<String> selectedDays;
  late bool enableReminder;

  @override
  void initState() {
    super.initState();
    final habit = widget.habitToEdit;
    nameController = TextEditingController(text: habit?.name ?? '');
    timeController = TextEditingController(text: habit?.time ?? '09:00');
    selectedCategory = habit?.category ?? 'Health';
    selectedFrequency = habit?.frequency ?? 'daily';
    selectedDays = habit?.days ?? [];
    enableReminder = habit?.reminder ?? true;
  }

  @override
  void dispose() {
    nameController.dispose();
    timeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final habitProvider = Provider.of<HabitProvider>(context, listen: false);
    final categories = habitProvider.categories;

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
              widget.habitToEdit != null ? 'Edit Habit' : 'Add New Habit',
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
            SizedBox(height: 20),
            TextField(
              controller: nameController,
              style: TextStyle(color: AppColors.textPrimary),
              decoration: InputDecoration(
                labelText: 'Habit Name',
                hintText: 'e.g., Morning Exercise',
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
            TextField(
              controller: timeController,
              style: TextStyle(color: AppColors.textPrimary),
              decoration: InputDecoration(
                labelText: 'Time',
                hintText: 'HH:MM',
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
              ),
            ),
            SizedBox(height: 16),
            DropdownButtonFormField<String>(
              value: selectedCategory,
              items: categories
                  .map((cat) => DropdownMenuItem(
                        value: cat,
                        child: Text(cat, style: TextStyle(color: AppColors.textPrimary)),
                      ))
                  .toList(),
              onChanged: (value) {
                if (value != null) {
                  setState(() => selectedCategory = value);
                }
              },
              decoration: InputDecoration(
                labelText: 'Category',
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
              ),
              dropdownColor: AppColors.bgSecondary,
              style: TextStyle(color: AppColors.textPrimary),
            ),
            SizedBox(height: 16),
            Text(
              'Frequency',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: AppColors.textPrimary,
              ),
            ),
            SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: ['daily', 'weekly', 'monthly'].map((freq) {
                return FilterChip(
                  label: Text(freq.capitalize()),
                  selected: selectedFrequency == freq,
                  onSelected: (selected) {
                    setState(() => selectedFrequency = freq);
                  },
                  backgroundColor: AppColors.bgTertiary,
                  selectedColor: AppColors.purplePrimary,
                  labelStyle: TextStyle(
                    color: selectedFrequency == freq ? Colors.white : AppColors.textSecondary,
                  ),
                );
              }).toList(),
            ),
            SizedBox(height: 16),
            Text(
              'Days',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w500,
                color: AppColors.textPrimary,
              ),
            ),
            SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].asMap().entries.map((entry) {
                const fullDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                final isSelected = selectedDays.contains(fullDays[entry.key]);

                return FilterChip(
                  label: Text(entry.value),
                  selected: isSelected,
                  onSelected: (selected) {
                    setState(() {
                      if (selected) {
                        selectedDays.add(fullDays[entry.key]);
                      } else {
                        selectedDays.remove(fullDays[entry.key]);
                      }
                    });
                  },
                  backgroundColor: AppColors.bgTertiary,
                  selectedColor: AppColors.purplePrimary,
                  labelStyle: TextStyle(
                    color: isSelected ? Colors.white : AppColors.textSecondary,
                  ),
                );
              }).toList(),
            ),
            SizedBox(height: 16),
            Row(
              children: [
                Text(
                  'Enable Reminder',
                  style: TextStyle(
                    fontSize: 14,
                    color: AppColors.textPrimary,
                  ),
                ),
                Spacer(),
                Switch(
                  value: enableReminder,
                  onChanged: (value) {
                    setState(() => enableReminder = value);
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
                    if (nameController.text.isEmpty) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Please enter a habit name')),
                      );
                      return;
                    }

                    if (selectedDays.isEmpty) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Please select at least one day')),
                      );
                      return;
                    }

                    final habit = Habit(
                      id: widget.habitToEdit?.id ?? generateId(),
                      name: nameController.text,
                      time: timeController.text,
                      frequency: selectedFrequency,
                      days: selectedDays,
                      category: selectedCategory,
                      reminder: enableReminder,
                      completed: widget.habitToEdit?.completed ?? 0,
                      streak: widget.habitToEdit?.streak ?? 0,
                      lastCompletedDate: widget.habitToEdit?.lastCompletedDate,
                      weeklyCompleted: widget.habitToEdit?.weeklyCompleted ?? 0,
                      createdAt: widget.habitToEdit?.createdAt,
                    );

                    if (widget.habitToEdit == null) {
                      habitProvider.addHabit(habit);
                    } else {
                      // Delete and re-add for now (could optimize later)
                      habitProvider.deleteHabit(widget.habitToEdit!.id);
                      habitProvider.addHabit(habit);
                    }

                    Navigator.pop(context);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.purplePrimary,
                  ),
                  child: Text(widget.habitToEdit != null ? 'Update' : 'Add Habit'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

extension StringExtension on String {
  String capitalize() {
    return "${this[0].toUpperCase()}${this.substring(1)}";
  }
}
