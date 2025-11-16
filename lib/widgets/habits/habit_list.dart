import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../constants/colors.dart';
import '../../providers/habit_provider.dart';
import '../../screens/habits/add_habit_dialog.dart';

class HabitList extends StatelessWidget {
  const HabitList({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final habitProvider = Provider.of<HabitProvider>(context);
    final habitsGrouped = habitProvider.getHabitsByCategory();

    return ListView.builder(
      padding: EdgeInsets.all(16),
      itemCount: habitsGrouped.keys.length,
      itemBuilder: (context, index) {
        final category = habitsGrouped.keys.toList()[index];
        final habits = habitsGrouped[category]!;

        if (habits.isEmpty) return SizedBox.shrink();

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: EdgeInsets.symmetric(vertical: 12, horizontal: 4),
              child: Text(
                category,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: AppColors.textSecondary,
                ),
              ),
            ),
            ...habits.map((habit) {
              final isCompletedToday = habit.lastCompletedDate == DateTime.now().toString().split(' ')[0];

              return Container(
                margin: EdgeInsets.only(bottom: 12),
                padding: EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.bgSecondary,
                  borderRadius: BorderRadius.circular(12),
                  border: isCompletedToday
                      ? Border.all(color: AppColors.success, width: 2)
                      : Border.all(color: AppColors.bgTertiary, width: 1),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                habit.name,
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w600,
                                  color: AppColors.textPrimary,
                                  decoration: isCompletedToday ? TextDecoration.lineThrough : null,
                                ),
                              ),
                              SizedBox(height: 4),
                              Row(
                                children: [
                                  Icon(Icons.local_fire_department,
                                      color: AppColors.warning, size: 16),
                                  SizedBox(width: 4),
                                  Text(
                                    'Streak: ${habit.streak}',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: AppColors.textSecondary,
                                    ),
                                  ),
                                  SizedBox(width: 16),
                                  Icon(Icons.check_circle,
                                      color: AppColors.success, size: 16),
                                  SizedBox(width: 4),
                                  Text(
                                    'Completed: ${habit.completed}',
                                    style: TextStyle(
                                      fontSize: 12,
                                      color: AppColors.textSecondary,
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
                                'Mark Complete',
                                style: TextStyle(color: AppColors.textPrimary),
                              ),
                              onTap: () {
                                habitProvider.markHabitComplete(habit.id);
                              },
                            ),
                            PopupMenuItem(
                              child: Text(
                                'Edit',
                                style: TextStyle(color: AppColors.textPrimary),
                              ),
                              onTap: () {
                                showDialog(
                                  context: context,
                                  builder: (context) =>
                                      AddHabitDialog(habitToEdit: habit),
                                );
                              },
                            ),
                            PopupMenuItem(
                              child: Text(
                                'Delete',
                                style: TextStyle(color: AppColors.danger),
                              ),
                              onTap: () {
                                habitProvider.deleteHabit(habit.id);
                              },
                            ),
                          ],
                        ),
                      ],
                    ),
                    SizedBox(height: 12),
                    Row(
                      children: [
                        ...habit.days.take(3).map((day) {
                          const dayMap = {
                            'Monday': 'M',
                            'Tuesday': 'T',
                            'Wednesday': 'W',
                            'Thursday': 'T',
                            'Friday': 'F',
                            'Saturday': 'S',
                            'Sunday': 'S',
                          };
                          return Container(
                            margin: EdgeInsets.only(right: 4),
                            padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppColors.purplePrimary.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              dayMap[day] ?? day,
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w600,
                                color: AppColors.purplePrimary,
                              ),
                            ),
                          );
                        }).toList(),
                        if (habit.days.length > 3)
                          Text(
                            '+${habit.days.length - 3}',
                            style: TextStyle(
                              fontSize: 10,
                              color: AppColors.textSecondary,
                            ),
                          ),
                      ],
                    ),
                  ],
                ),
              );
            }).toList(),
            SizedBox(height: 12),
          ],
        );
      },
    );
  }
}
