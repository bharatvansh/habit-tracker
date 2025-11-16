import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../constants/colors.dart';
import '../../providers/profile_provider.dart';

class AppDrawer extends StatelessWidget {
  final String currentPage;
  final Function(String) onPageSelected;

  const AppDrawer({
    Key? key,
    required this.currentPage,
    required this.onPageSelected,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Drawer(
      backgroundColor: AppColors.bgSecondary,
      child: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: EdgeInsets.fromLTRB(24, 32, 24, 32),
                child: Row(
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        border: Border.all(color: AppColors.purplePrimary, width: 2),
                        borderRadius: BorderRadius.circular(50),
                      ),
                      child: Center(
                        child: Icon(
                          Icons.track_changes,
                          color: AppColors.purplePrimary,
                          size: 20,
                        ),
                      ),
                    ),
                    SizedBox(width: 12),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Habit Tracker',
                          style: TextStyle(
                            color: AppColors.textPrimary,
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              Divider(color: AppColors.bgTertiary, height: 1),
              _NavigationItem(
                icon: Icons.home,
                label: 'Home',
                isActive: currentPage == 'home',
                onTap: () {
                  onPageSelected('home');
                  Navigator.pop(context);
                },
              ),
              _NavigationItem(
                icon: Icons.checklist,
                label: 'Habits',
                isActive: currentPage == 'habits',
                onTap: () {
                  onPageSelected('habits');
                  Navigator.pop(context);
                },
              ),
              _NavigationItem(
                icon: Icons.notifications,
                label: 'Reminders',
                isActive: currentPage == 'reminders',
                onTap: () {
                  onPageSelected('reminders');
                  Navigator.pop(context);
                },
              ),
              _NavigationItem(
                icon: Icons.bar_chart,
                label: 'Analytics',
                isActive: currentPage == 'analytics',
                onTap: () {
                  onPageSelected('analytics');
                  Navigator.pop(context);
                },
              ),
              _NavigationItem(
                icon: Icons.person,
                label: 'Profile',
                isActive: currentPage == 'profile',
                onTap: () {
                  onPageSelected('profile');
                  Navigator.pop(context);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _NavigationItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final bool isActive;
  final VoidCallback onTap;

  const _NavigationItem({
    required this.icon,
    required this.label,
    required this.isActive,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: isActive ? Color.fromARGB(255, 138, 43, 226).withOpacity(0.1) : Colors.transparent,
      child: InkWell(
        onTap: onTap,
        child: Container(
          padding: EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          child: Row(
            children: [
              Icon(
                icon,
                color: isActive ? AppColors.textPrimary : AppColors.textSecondary,
                size: 20,
              ),
              SizedBox(width: 16),
              Text(
                label,
                style: TextStyle(
                  color: isActive ? AppColors.textPrimary : AppColors.textSecondary,
                  fontSize: 16,
                  fontWeight: isActive ? FontWeight.w500 : FontWeight.normal,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
