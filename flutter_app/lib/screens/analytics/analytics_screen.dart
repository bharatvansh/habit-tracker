import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:intl/intl.dart';
import '../../providers/habit_provider.dart';
import '../../widgets/common/loading_spinner.dart';
import '../../widgets/common/custom_card.dart';
import '../../utils/theme.dart';

class AnalyticsScreen extends StatelessWidget {
  const AnalyticsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer<HabitProvider>(
      builder: (context, habitProvider, child) {
        if (habitProvider.isLoading) {
          return const LoadingSpinner(message: 'Loading analytics data...');
        }

        return SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(),
              const SizedBox(height: 24),
              _buildStatistics(habitProvider),
              const SizedBox(height: 24),
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(child: _buildWeeklyActivity(habitProvider)),
                  const SizedBox(width: 16),
                  Expanded(child: _buildCategoryBreakdown(habitProvider)),
                ],
              ),
              const SizedBox(height: 24),
              _buildHabitHistory(habitProvider),
            ],
          ),
        );
      },
    );
  }

  Widget _buildHeader() {
    return const Text(
      'Analytics',
      style: TextStyle(
        fontSize: 32,
        fontWeight: FontWeight.bold,
        color: AppTheme.textPrimary,
      ),
    );
  }

  Widget _buildStatistics(HabitProvider habitProvider) {
    final habits = habitProvider.habits;
    final totalHabits = habits.length;
    final totalCompleted = habits.fold<int>(0, (sum, h) => sum + h.completed);
    final averageStreak = habits.isEmpty ? 0 : (habits.fold<int>(0, (sum, h) => sum + h.streak) / habits.length).round();
    final longestStreak = habits.isEmpty ? 0 : habits.map((h) => h.streak).reduce((a, b) => a > b ? a : b);

    return Row(
      children: [
        Expanded(child: _buildStatCard('Total Habits', '$totalHabits', Icons.task_alt, AppTheme.purplePrimary)),
        const SizedBox(width: 16),
        Expanded(child: _buildStatCard('Total Completed', '$totalCompleted', Icons.check_circle, AppTheme.success)),
        const SizedBox(width: 16),
        Expanded(child: _buildStatCard('Average Streak', '$averageStreak days', Icons.trending_up, AppTheme.info)),
        const SizedBox(width: 16),
        Expanded(child: _buildStatCard('Longest Streak', '$longestStreak days', Icons.local_fire_department, AppTheme.warning)),
      ],
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon, Color color) {
    return CustomCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 32),
          const SizedBox(height: 16),
          Text(
            value,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: const TextStyle(
              fontSize: 14,
              color: AppTheme.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildWeeklyActivity(HabitProvider habitProvider) {
    return CustomCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Weekly Activity',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: AppTheme.textPrimary,
            ),
          ),
          const SizedBox(height: 24),
          SizedBox(
            height: 200,
            child: _buildWeeklyChart(habitProvider),
          ),
        ],
      ),
    );
  }

  Widget _buildWeeklyChart(HabitProvider habitProvider) {
    final today = DateTime.now();
    final startOfWeek = today.subtract(Duration(days: today.weekday - 1));
    final data = List.generate(7, (index) {
      final date = startOfWeek.add(Duration(days: index));
      final dateStr = date.toIso8601String().split('T')[0];
      final completedCount = habitProvider.habits
          .where((h) => h.lastCompletedDate == dateStr)
          .length;
      return completedCount.toDouble();
    });

    return BarChart(
      BarChartData(
        alignment: BarChartAlignment.spaceAround,
        maxY: (data.reduce((a, b) => a > b ? a : b) + 2).toDouble(),
        barGroups: data.asMap().entries.map((entry) {
          return BarChartGroupData(
            x: entry.key,
            barRods: [
              BarChartRodData(
                toY: entry.value,
                color: AppTheme.purplePrimary,
                width: 20,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(4)),
              ),
            ],
          );
        }).toList(),
        titlesData: FlTitlesData(
          show: true,
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              getTitlesWidget: (value, meta) {
                const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
                return Text(
                  days[value.toInt()],
                  style: const TextStyle(color: AppTheme.textSecondary, fontSize: 12),
                );
              },
            ),
          ),
          leftTitles: AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
          topTitles: AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
          rightTitles: AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
        ),
        gridData: FlGridData(show: false),
        borderData: FlBorderData(show: false),
      ),
    );
  }

  Widget _buildCategoryBreakdown(HabitProvider habitProvider) {
    final categories = <String, int>{};
    for (var habit in habitProvider.habits) {
      categories[habit.category] = (categories[habit.category] ?? 0) + 1;
    }

    final colors = [
      AppTheme.purplePrimary,
      AppTheme.success,
      AppTheme.info,
      AppTheme.warning,
      AppTheme.danger,
    ];

    return CustomCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Category Breakdown',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: AppTheme.textPrimary,
            ),
          ),
          const SizedBox(height: 24),
          if (categories.isEmpty)
            const Center(
              child: Padding(
                padding: EdgeInsets.all(32.0),
                child: Text(
                  'No habits to display',
                  style: TextStyle(color: AppTheme.textSecondary),
                ),
              ),
            )
          else
            ...categories.entries.map((entry) {
              final index = categories.keys.toList().indexOf(entry.key);
              final color = colors[index % colors.length];
              final percentage = ((entry.value / habitProvider.habits.length) * 100).round();
              return Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Row(
                  children: [
                    Container(
                      width: 12,
                      height: 12,
                      decoration: BoxDecoration(
                        color: color,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        entry.key,
                        style: const TextStyle(color: AppTheme.textPrimary),
                      ),
                    ),
                    Text(
                      '${entry.value} ($percentage%)',
                      style: const TextStyle(
                        color: AppTheme.textSecondary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              );
            }).toList(),
        ],
      ),
    );
  }

  Widget _buildHabitHistory(HabitProvider habitProvider) {
    final sortedHabits = List.from(habitProvider.habits)
      ..sort((a, b) => b.completed.compareTo(a.completed));

    return CustomCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Habit History',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: AppTheme.textPrimary,
            ),
          ),
          const SizedBox(height: 16),
          if (sortedHabits.isEmpty)
            const Center(
              child: Padding(
                padding: EdgeInsets.all(32.0),
                child: Text(
                  'No habits to display',
                  style: TextStyle(color: AppTheme.textSecondary),
                ),
              ),
            )
          else
            ...sortedHabits.take(10).map((habit) {
              return ListTile(
                leading: CircleAvatar(
                  backgroundColor: AppTheme.purplePrimary.withOpacity(0.2),
                  child: Text(
                    habit.name[0].toUpperCase(),
                    style: const TextStyle(color: AppTheme.purplePrimary, fontWeight: FontWeight.bold),
                  ),
                ),
                title: Text(
                  habit.name,
                  style: const TextStyle(color: AppTheme.textPrimary),
                ),
                subtitle: Text(
                  'Category: ${habit.category}',
                  style: const TextStyle(color: AppTheme.textSecondary),
                ),
                trailing: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      '${habit.completed} times',
                      style: const TextStyle(
                        color: AppTheme.success,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      '${habit.streak} day streak',
                      style: const TextStyle(
                        color: AppTheme.textSecondary,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              );
            }).toList(),
        ],
      ),
    );
  }
}
