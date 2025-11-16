import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../constants/colors.dart';
import '../../providers/habit_provider.dart';
import '../../providers/reminder_provider.dart';

class AnalyticsScreen extends StatefulWidget {
  const AnalyticsScreen({Key? key}) : super(key: key);

  @override
  State<AnalyticsScreen> createState() => _AnalyticsScreenState();
}

class _AnalyticsScreenState extends State<AnalyticsScreen> {
  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    await Provider.of<HabitProvider>(context, listen: false).loadHabits();
    await Provider.of<ReminderProvider>(context, listen: false).loadReminders();
  }

  @override
  Widget build(BuildContext context) {
    final habitProvider = Provider.of<HabitProvider>(context);
    final reminderProvider = Provider.of<ReminderProvider>(context);

    return Scaffold(
      backgroundColor: AppColors.bgPrimary,
      appBar: AppBar(
        backgroundColor: AppColors.bgSecondary,
        elevation: 0,
        title: Text(
          'Analytics',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: AppColors.textPrimary,
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Habit Progress',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
            SizedBox(height: 16),
            Container(
              padding: EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.bgSecondary,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                children: [
                  Text(
                    'Weekly Completion Rate',
                    style: TextStyle(
                      fontSize: 14,
                      color: AppColors.textSecondary,
                    ),
                  ),
                  SizedBox(height: 16),
                  _buildProgressChart(habitProvider),
                ],
              ),
            ),
            SizedBox(height: 24),
            Text(
              'Habit Categories',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
            SizedBox(height: 16),
            Container(
              padding: EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.bgSecondary,
                borderRadius: BorderRadius.circular(12),
              ),
              child: _buildCategoryChart(habitProvider),
            ),
            SizedBox(height: 24),
            Text(
              'Statistics',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: AppColors.textPrimary,
              ),
            ),
            SizedBox(height: 16),
            _StatCard(
              label: 'Total Habits',
              value: habitProvider.getTotalHabits().toString(),
              icon: Icons.track_changes,
            ),
            SizedBox(height: 12),
            _StatCard(
              label: 'Reminders Completed',
              value: reminderProvider.getCompletedCount().toString(),
              icon: Icons.check_circle,
            ),
            SizedBox(height: 12),
            _StatCard(
              label: 'Pending Reminders',
              value: reminderProvider.getPendingCount().toString(),
              icon: Icons.pending_actions,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProgressChart(HabitProvider habitProvider) {
    final habits = habitProvider.habits;
    if (habits.isEmpty) {
      return SizedBox(
        height: 200,
        child: Center(
          child: Text(
            'No data available',
            style: TextStyle(color: AppColors.textSecondary),
          ),
        ),
      );
    }

    final data = habits.map((h) => h.weeklyCompleted.toDouble()).toList();
    final maxY = data.isNotEmpty ? data.reduce((a, b) => a > b ? a : b) : 10;

    return SizedBox(
      height: 200,
      child: BarChart(
        BarChartData(
          barGroups: List.generate(
            data.length,
            (index) => BarChartGroupData(
              x: index,
              barRods: [
                BarChartRodData(
                  toY: data[index],
                  color: AppColors.purplePrimary,
                  width: 16,
                ),
              ],
            ),
          ),
          maxY: maxY + 1,
          titlesData: FlTitlesData(
            bottomTitles: AxisTitles(
              sideTitles: SideTitles(
                showTitles: true,
                getTitlesWidget: (value, meta) {
                  return Text(
                    'H${value.toInt()}',
                    style: TextStyle(color: AppColors.textSecondary, fontSize: 10),
                  );
                },
              ),
            ),
            leftTitles: AxisTitles(
              sideTitles: SideTitles(
                showTitles: true,
                getTitlesWidget: (value, meta) {
                  return Text(
                    value.toInt().toString(),
                    style: TextStyle(color: AppColors.textSecondary, fontSize: 10),
                  );
                },
                reservedSize: 28,
              ),
            ),
          ),
          borderData: FlBorderData(show: false),
          gridData: FlGridData(show: false),
          backgroundColor: Colors.transparent,
        ),
      ),
    );
  }

  Widget _buildCategoryChart(HabitProvider habitProvider) {
    final grouped = habitProvider.getHabitsByCategory();
    if (grouped.isEmpty) {
      return SizedBox(
        height: 200,
        child: Center(
          child: Text(
            'No data available',
            style: TextStyle(color: AppColors.textSecondary),
          ),
        ),
      );
    }

    final data = grouped.values.map((habits) => habits.length.toDouble()).toList();
    final colors = [
      AppColors.purplePrimary,
      AppColors.info,
      AppColors.success,
      AppColors.warning,
      AppColors.danger,
    ];

    return SizedBox(
      height: 250,
      child: PieChart(
        PieChartData(
          sections: List.generate(
            grouped.entries.length,
            (index) => PieChartSectionData(
              value: data[index],
              title: '${data[index].toInt()}',
              color: colors[index % colors.length],
              radius: 60,
              titleStyle: TextStyle(
                color: Colors.white,
                fontSize: 12,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;

  const _StatCard({
    required this.label,
    required this.value,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.bgSecondary,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Container(
            padding: EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.purplePrimary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(
              icon,
              color: AppColors.purplePrimary,
              size: 24,
            ),
          ),
          SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 12,
                    color: AppColors.textSecondary,
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  value,
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textPrimary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
