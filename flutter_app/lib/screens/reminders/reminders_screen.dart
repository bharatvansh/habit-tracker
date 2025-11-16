import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../providers/reminder_provider.dart';
import '../../widgets/common/loading_spinner.dart';
import '../../widgets/common/custom_card.dart';
import '../../utils/theme.dart';
import 'reminder_add_dialog.dart';

class RemindersScreen extends StatefulWidget {
  const RemindersScreen({Key? key}) : super(key: key);

  @override
  State<RemindersScreen> createState() => _RemindersScreenState();
}

class _RemindersScreenState extends State<RemindersScreen> {
  String _activeFilter = 'all';

  @override
  Widget build(BuildContext context) {
    return Consumer<ReminderProvider>(
      builder: (context, reminderProvider, child) {
        if (reminderProvider.isLoading) {
          return const LoadingSpinner(message: 'Loading your reminders...');
        }

        final filteredReminders = reminderProvider.getFilteredReminders(_activeFilter);

        return SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(context),
              const SizedBox(height: 24),
              _buildSummary(reminderProvider),
              const SizedBox(height: 24),
              _buildFilters(),
              const SizedBox(height: 24),
              _buildRemindersList(context, filteredReminders, reminderProvider),
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
          'My Reminders',
          style: TextStyle(
            fontSize: 32,
            fontWeight: FontWeight.bold,
            color: AppTheme.textPrimary,
          ),
        ),
        ElevatedButton.icon(
          onPressed: () => _showAddReminderDialog(context),
          icon: const Icon(Icons.add),
          label: const Text('Add Reminder'),
        ),
      ],
    );
  }

  Widget _buildSummary(ReminderProvider reminderProvider) {
    final allReminders = reminderProvider.reminders;
    final todayReminders = reminderProvider.getFilteredReminders('today').length;
    final upcomingReminders = reminderProvider.getFilteredReminders('upcoming').length;
    final completedReminders = allReminders.where((r) => r.completed).length;

    return Row(
      children: [
        Expanded(
          child: _buildSummaryCard('Today', '$todayReminders', Icons.today, AppTheme.purplePrimary),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _buildSummaryCard('Upcoming', '$upcomingReminders', Icons.upcoming, AppTheme.info),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _buildSummaryCard('Completed', '$completedReminders', Icons.check_circle, AppTheme.success),
        ),
      ],
    );
  }

  Widget _buildSummaryCard(String label, String value, IconData icon, Color color) {
    return CustomCard(
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: color.withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 28),
          ),
          const SizedBox(width: 16),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                value,
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: color,
                ),
              ),
              Text(
                label,
                style: const TextStyle(
                  fontSize: 14,
                  color: AppTheme.textSecondary,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildFilters() {
    return Row(
      children: [
        const Text(
          'My Reminders',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: AppTheme.textPrimary,
          ),
        ),
        const SizedBox(width: 24),
        _buildFilterPill('All', 'all'),
        _buildFilterPill('Today', 'today'),
        _buildFilterPill('Upcoming', 'upcoming'),
        _buildFilterPill('Completed', 'completed'),
      ],
    );
  }

  Widget _buildFilterPill(String label, String value) {
    final isActive = _activeFilter == value;
    return Padding(
      padding: const EdgeInsets.only(right: 12),
      child: InkWell(
        onTap: () => setState(() => _activeFilter = value),
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

  Widget _buildRemindersList(BuildContext context, List reminders, ReminderProvider provider) {
    if (reminders.isEmpty) {
      return CustomCard(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(48.0),
            child: Column(
              children: const [
                Icon(Icons.notifications_none, size: 64, color: AppTheme.textSecondary),
                SizedBox(height: 16),
                Text(
                  'No reminders found.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 16, color: AppTheme.textSecondary),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return Column(
      children: reminders.map((reminder) {
        return Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: _buildReminderCard(context, reminder, provider),
        );
      }).toList(),
    );
  }

  Widget _buildReminderCard(BuildContext context, reminder, ReminderProvider provider) {
    final datetime = DateTime.parse(reminder.datetime);
    final dateStr = DateFormat('MMM d, yyyy').format(datetime);
    final timeStr = DateFormat('h:mm a').format(datetime);

    return CustomCard(
      child: ListTile(
        leading: Checkbox(
          value: reminder.completed,
          onChanged: (value) {
            provider.toggleComplete(reminder.id);
          },
          activeColor: AppTheme.purplePrimary,
        ),
        title: Text(
          reminder.title,
          style: TextStyle(
            color: AppTheme.textPrimary,
            decoration: reminder.completed ? TextDecoration.lineThrough : null,
          ),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Row(
              children: [
                Icon(Icons.calendar_today, size: 14, color: AppTheme.textSecondary),
                const SizedBox(width: 4),
                Text(dateStr, style: const TextStyle(color: AppTheme.textSecondary)),
                const SizedBox(width: 16),
                Icon(Icons.access_time, size: 14, color: AppTheme.textSecondary),
                const SizedBox(width: 4),
                Text(timeStr, style: const TextStyle(color: AppTheme.textSecondary)),
              ],
            ),
            if (reminder.priority != null || reminder.category != null)
              Padding(
                padding: const EdgeInsets.only(top: 8),
                child: Wrap(
                  spacing: 8,
                  children: [
                    if (reminder.priority != null)
                      Chip(
                        label: Text(reminder.priority!.toUpperCase()),
                        backgroundColor: _getPriorityColor(reminder.priority!),
                        labelStyle: const TextStyle(fontSize: 12),
                      ),
                    if (reminder.category != null)
                      Chip(
                        label: Text(reminder.category!),
                        backgroundColor: AppTheme.bgTertiary,
                        labelStyle: const TextStyle(fontSize: 12),
                      ),
                  ],
                ),
              ),
          ],
        ),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (reminder.alarm)
              const Icon(Icons.alarm, color: AppTheme.warning, size: 20),
            if (reminder.notification)
              const Padding(
                padding: EdgeInsets.only(left: 8),
                child: Icon(Icons.notifications, color: AppTheme.info, size: 20),
              ),
            PopupMenuButton(
              icon: const Icon(Icons.more_vert, color: AppTheme.textSecondary),
              color: AppTheme.bgSecondary,
              itemBuilder: (context) => [
                PopupMenuItem(
                  child: const Text('Edit', style: TextStyle(color: AppTheme.textPrimary)),
                  onTap: () {
                    // Edit functionality
                  },
                ),
                PopupMenuItem(
                  child: const Text('Delete', style: TextStyle(color: AppTheme.danger)),
                  onTap: () => _confirmDelete(context, reminder, provider),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Color _getPriorityColor(String priority) {
    switch (priority.toLowerCase()) {
      case 'high':
        return AppTheme.danger.withOpacity(0.2);
      case 'medium':
        return AppTheme.warning.withOpacity(0.2);
      case 'low':
        return AppTheme.info.withOpacity(0.2);
      default:
        return AppTheme.textSecondary.withOpacity(0.2);
    }
  }

  void _confirmDelete(BuildContext context, reminder, ReminderProvider provider) {
    // Delay to allow popup menu to close
    Future.delayed(const Duration(milliseconds: 100), () {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          backgroundColor: AppTheme.bgSecondary,
          title: const Text('Confirm Delete', style: TextStyle(color: AppTheme.textPrimary)),
          content: Text(
            'Are you sure you want to delete "${reminder.title}"?',
            style: const TextStyle(color: AppTheme.textSecondary),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                provider.deleteReminder(reminder.id);
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('"${reminder.title}" has been deleted.')),
                );
              },
              style: ElevatedButton.styleFrom(backgroundColor: AppTheme.danger),
              child: const Text('Delete'),
            ),
          ],
        ),
      );
    });
  }

  void _showAddReminderDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => const ReminderAddDialog(),
    );
  }
}
