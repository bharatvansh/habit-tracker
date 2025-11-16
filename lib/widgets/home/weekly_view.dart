import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../constants/colors.dart';
import '../../providers/habit_provider.dart';

class WeeklyView extends StatelessWidget {
  const WeeklyView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final habitProvider = Provider.of<HabitProvider>(context);
    final daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: List.generate(
          daysOfWeek.length,
          (index) {
            final dayLabel = daysOfWeek[index];
            final habitsForDay = habitProvider.habits
                .where((h) => _getDayLabel(index + 1) == h.days.join(', '))
                .length;
            final completedForDay = habitProvider.habits
                .where((h) {
                  final today = DateTime.now();
                  final targetDate = today.add(Duration(days: index - today.weekday + 1));
                  final targetDateStr = targetDate.toString().split(' ')[0];
                  return h.lastCompletedDate == targetDateStr && _getDayLabel(index + 1) == h.days.join(', ');
                })
                .length;

            return Padding(
              padding: EdgeInsets.only(right: 12),
              child: _DayCard(
                day: dayLabel,
                completed: completedForDay,
                total: habitsForDay > 0 ? habitsForDay : 0,
              ),
            );
          },
        ),
      ),
    );
  }

  String _getDayLabel(int weekday) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[weekday - 1];
  }
}

class _DayCard extends StatelessWidget {
  final String day;
  final int completed;
  final int total;

  const _DayCard({
    required this.day,
    required this.completed,
    required this.total,
  });

  @override
  Widget build(BuildContext context) {
    final isComplete = total > 0 && completed == total;

    return Container(
      width: 70,
      padding: EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: isComplete ? AppColors.purplePrimary.withOpacity(0.2) : AppColors.bgSecondary,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isComplete ? AppColors.purplePrimary : Colors.transparent,
          width: 2,
        ),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            day,
            style: TextStyle(
              fontSize: 12,
              color: AppColors.textSecondary,
              fontWeight: FontWeight.w500,
            ),
          ),
          SizedBox(height: 8),
          if (total > 0)
            Text(
              '$completed/$total',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            )
          else
            Text(
              'Rest',
              style: TextStyle(
                fontSize: 12,
                color: AppColors.textSecondary,
              ),
            ),
          SizedBox(height: 8),
          Container(
            height: 4,
            width: 40,
            decoration: BoxDecoration(
              color: AppColors.bgTertiary,
              borderRadius: BorderRadius.circular(2),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(2),
              child: LinearProgressIndicator(
                value: total > 0 ? completed / total : 0,
                valueColor: AlwaysStoppedAnimation<Color>(AppColors.success),
                backgroundColor: Colors.transparent,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
