import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/habit_provider.dart';
import '../../widgets/common/loading_spinner.dart';
import '../../widgets/common/custom_card.dart';
import '../../utils/theme.dart';
import '../../utils/constants.dart';
import 'habit_add_dialog.dart';

class HabitsScreen extends StatefulWidget {
  const HabitsScreen({Key? key}) : super(key: key);

  @override
  State<HabitsScreen> createState() => _HabitsScreenState();
}

class _HabitsScreenState extends State<HabitsScreen> {
  String _activeCategory = 'All Habits';
  String _searchTerm = '';

  @override
  Widget build(BuildContext context) {
    return Consumer<HabitProvider>(
      builder: (context, habitProvider, child) {
        if (habitProvider.isLoading) {
          return const LoadingSpinner(message: 'Loading your habits...');
        }

        return SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(context),
              const SizedBox(height: 24),
              _buildSummary(habitProvider),
              const SizedBox(height: 24),
              _buildHabitsSection(habitProvider),
            ],
          ),
        );
      },
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const Text(
          'My Habits',
          style: TextStyle(
            fontSize: 32,
            fontWeight: FontWeight.bold,
            color: AppTheme.textPrimary,
          ),
        ),
        Row(
          children: [
            OutlinedButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.filter_list),
              label: const Text('Filter'),
            ),
            const SizedBox(width: 12),
            ElevatedButton.icon(
              onPressed: () => _showAddHabitDialog(context),
              icon: const Icon(Icons.add),
              label: const Text('Add Habit'),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildSummary(HabitProvider habitProvider) {
    final habits = habitProvider.habits;
    final today = DateTime.now().toIso8601String().split('T')[0];
    final completedToday = habits.where((h) => h.lastCompletedDate == today).length;
    
    final activeToday = habits.where((h) {
      final dayOfWeek = _getDayOfWeek(DateTime.now());
      return h.days.contains(dayOfWeek);
    }).length;

    final longestStreak = habits.isEmpty ? 0 : habits.map((h) => h.streak).reduce((a, b) => a > b ? a : b);
    final completionRate = activeToday > 0 ? (completedToday / activeToday * 100).toInt() : 0;

    return CustomCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: const [
              Text(
                'Habit Summary',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.textPrimary,
                ),
              ),
              Text(
                'Last 30 days',
                style: TextStyle(
                  fontSize: 14,
                  color: AppTheme.textSecondary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(child: _buildSummaryCard('COMPLETION RATE', '$completionRate%', 'No previous data')),
              const SizedBox(width: 16),
              Expanded(child: _buildSummaryCard('TOTAL HABITS', '${habits.length}', '$activeToday active today')),
              const SizedBox(width: 16),
              Expanded(child: _buildSummaryCard('LONGEST STREAK', '$longestStreak days', longestStreak > 0 ? habits.firstWhere((h) => h.streak == longestStreak).name : 'None')),
              const SizedBox(width: 16),
              Expanded(child: _buildSummaryCard('TODAY\'S PROGRESS', '$completedToday/$activeToday', 'Habits completed')),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryCard(String label, String value, String subtitle) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.bgTertiary,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 10,
              color: AppTheme.textSecondary,
              fontWeight: FontWeight.w600,
              letterSpacing: 1.0,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: AppTheme.purplePrimary,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            subtitle,
            style: const TextStyle(
              fontSize: 12,
              color: AppTheme.textSecondary,
            ),
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Widget _buildHabitsSection(HabitProvider habitProvider) {
    final habits = habitProvider.habits;
    final categories = habitProvider.categories;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Habits',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: AppTheme.textPrimary,
          ),
        ),
        const SizedBox(height: 16),
        
        // Categories
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: [
              _buildCategoryPill('All Habits', _activeCategory == 'All Habits'),
              ...categories.map((cat) => _buildCategoryPill(cat, _activeCategory == cat)),
            ],
          ),
        ),
        const SizedBox(height: 16),
        
        // Search
        TextField(
          onChanged: (value) => setState(() => _searchTerm = value),
          decoration: const InputDecoration(
            hintText: 'Search for habits...',
            prefixIcon: Icon(Icons.search, color: AppTheme.textSecondary),
          ),
        ),
        const SizedBox(height: 24),
        
        // Habits Grid
        _buildHabitsGrid(habitProvider),
      ],
    );
  }

  Widget _buildCategoryPill(String label, bool isActive) {
    return Padding(
      padding: const EdgeInsets.only(right: 12),
      child: InkWell(
        onTap: () => setState(() => _activeCategory = label),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
          decoration: BoxDecoration(
            color: isActive ? AppTheme.purplePrimary : AppTheme.bgTertiary,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(
            label,
            style: TextStyle(
              color: isActive ? AppTheme.textPrimary : AppTheme.textSecondary,
              fontWeight: isActive ? FontWeight.w600 : FontWeight.normal,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHabitsGrid(HabitProvider habitProvider) {
    final filteredHabits = habitProvider.habits.where((habit) {
      final matchesCategory = _activeCategory == 'All Habits' || habit.category == _activeCategory;
      final matchesSearch = habit.name.toLowerCase().contains(_searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    }).toList();

    if (filteredHabits.isEmpty) {
      return CustomCard(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(48.0),
            child: Column(
              children: const [
                Icon(Icons.task_outlined, size: 64, color: AppTheme.textSecondary),
                SizedBox(height: 16),
                Text(
                  'No habits added yet. Click the "Add Habit" button to get started!',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 16, color: AppTheme.textSecondary),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        childAspectRatio: 1.2,
      ),
      itemCount: filteredHabits.length,
      itemBuilder: (context, index) {
        return _buildHabitCard(context, filteredHabits[index], habitProvider);
      },
    );
  }

  Widget _buildHabitCard(BuildContext context, habit, HabitProvider habitProvider) {
    final today = DateTime.now().toIso8601String().split('T')[0];
    final isCompletedToday = habit.lastCompletedDate == today;
    final progress = ((habit.streak / 30) * 100).clamp(0, 100).toInt();

    return CustomCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Text(
                  habit.name,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.textPrimary,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              if (habit.time != null)
                Text(
                  habit.time!,
                  style: const TextStyle(
                    fontSize: 12,
                    color: AppTheme.textSecondary,
                  ),
                ),
            ],
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              _buildDetailChip(Icons.repeat, habit.frequency),
              _buildDetailChip(Icons.local_fire_department, '${habit.streak} day streak'),
              _buildDetailChip(Icons.label, habit.category),
            ],
          ),
          const Spacer(),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              LinearProgressIndicator(
                value: progress / 100,
                backgroundColor: AppTheme.bgTertiary,
                valueColor: AlwaysStoppedAnimation<Color>(
                  habit.streak > 7 ? AppTheme.success : AppTheme.purplePrimary,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                '$progress% to 30 day goal',
                style: const TextStyle(
                  fontSize: 12,
                  color: AppTheme.textSecondary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              IconButton(
                onPressed: () {
                  habitProvider.markHabitComplete(habit.id);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('"${habit.name}" marked complete for today.')),
                  );
                },
                icon: const Icon(Icons.check_circle),
                color: AppTheme.success,
                tooltip: 'Mark Complete',
              ),
              IconButton(
                onPressed: () {},
                icon: const Icon(Icons.edit),
                color: AppTheme.textSecondary,
                tooltip: 'Edit',
              ),
              IconButton(
                onPressed: () => _confirmDelete(context, habit, habitProvider),
                icon: const Icon(Icons.delete),
                color: AppTheme.danger,
                tooltip: 'Delete',
              ),
            ],
          ),
          if (isCompletedToday)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: AppTheme.success.withOpacity(0.2),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: const [
                  Icon(Icons.check_circle, size: 14, color: AppTheme.success),
                  SizedBox(width: 4),
                  Text(
                    'Completed today',
                    style: TextStyle(fontSize: 12, color: AppTheme.success),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildDetailChip(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: AppTheme.bgTertiary,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: AppTheme.textSecondary),
          const SizedBox(width: 4),
          Text(
            label,
            style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
          ),
        ],
      ),
    );
  }

  void _confirmDelete(BuildContext context, habit, HabitProvider habitProvider) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.bgSecondary,
        title: const Text('Confirm Delete', style: TextStyle(color: AppTheme.textPrimary)),
        content: Text(
          'Are you sure you want to delete the habit "${habit.name}"? This action cannot be undone.',
          style: const TextStyle(color: AppTheme.textSecondary),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              habitProvider.deleteHabit(habit.id);
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('"${habit.name}" has been removed.')),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppTheme.danger),
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  void _showAddHabitDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => const HabitAddDialog(),
    );
  }

  String _getDayOfWeek(DateTime date) {
    const days = AppConstants.daysOfWeek;
    return days[date.weekday - 1];
  }
}
