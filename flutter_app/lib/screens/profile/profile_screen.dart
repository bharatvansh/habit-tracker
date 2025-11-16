import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/profile_provider.dart';
import '../../widgets/common/custom_card.dart';
import '../../utils/theme.dart';
import '../../models/profile.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({Key? key}) : super(key: key);

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _nameController;
  late TextEditingController _emailController;
  late TextEditingController _bioController;
  late TextEditingController _timezoneController;
  
  bool _emailReminders = false;
  bool _pushReminders = true;
  String _avatarColor = '#8a2be2';
  bool _hasChanges = false;

  @override
  void initState() {
    super.initState();
    final profile = Provider.of<ProfileProvider>(context, listen: false).profile;
    _nameController = TextEditingController(text: profile.name);
    _emailController = TextEditingController(text: profile.email);
    _bioController = TextEditingController(text: profile.bio);
    _timezoneController = TextEditingController(text: profile.timezone);
    _emailReminders = profile.notifications.emailReminders;
    _pushReminders = profile.notifications.pushReminders;
    _avatarColor = profile.avatarColor;
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _bioController.dispose();
    _timezoneController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<ProfileProvider>(
      builder: (context, profileProvider, child) {
        final initials = (_nameController.text.isEmpty ? 'You' : _nameController.text)
            .split(' ')
            .map((s) => s.isNotEmpty ? s[0] : '')
            .take(2)
            .join('')
            .toUpperCase();

        return SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Form(
            key: _formKey,
            onChanged: () => setState(() => _hasChanges = true),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildHeader(context, profileProvider),
                const SizedBox(height: 24),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: _buildPersonalInfo(initials),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: _buildPreferences(),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildHeader(BuildContext context, ProfileProvider profileProvider) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const Text(
          'Profile',
          style: TextStyle(
            fontSize: 32,
            fontWeight: FontWeight.bold,
            color: AppTheme.textPrimary,
          ),
        ),
        Row(
          children: [
            OutlinedButton.icon(
              onPressed: () => _resetProfile(profileProvider),
              icon: const Icon(Icons.refresh),
              label: const Text('Reset'),
            ),
            const SizedBox(width: 12),
            ElevatedButton.icon(
              onPressed: _hasChanges ? () => _saveProfile(profileProvider) : null,
              icon: const Icon(Icons.save),
              label: const Text('Save Changes'),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildPersonalInfo(String initials) {
    return CustomCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Your Info',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w600,
              color: AppTheme.textPrimary,
            ),
          ),
          const SizedBox(height: 24),
          
          // Avatar
          Row(
            children: [
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: Color(int.parse(_avatarColor.replaceAll('#', '0xff'))),
                  borderRadius: BorderRadius.circular(30),
                ),
                child: Center(
                  child: Text(
                    initials,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: _hasChanges ? AppTheme.warning.withOpacity(0.2) : AppTheme.success.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          _hasChanges ? Icons.edit : Icons.check_circle,
                          size: 14,
                          color: _hasChanges ? AppTheme.warning : AppTheme.success,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          _hasChanges ? 'Unsaved changes' : 'Saved',
                          style: TextStyle(
                            fontSize: 12,
                            color: _hasChanges ? AppTheme.warning : AppTheme.success,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 24),
          
          // Name
          TextFormField(
            controller: _nameController,
            decoration: const InputDecoration(
              labelText: 'Name',
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter your name';
              }
              return null;
            },
          ),
          const SizedBox(height: 16),
          
          // Email
          TextFormField(
            controller: _emailController,
            decoration: const InputDecoration(
              labelText: 'Email',
            ),
            keyboardType: TextInputType.emailAddress,
          ),
          const SizedBox(height: 16),
          
          // Bio
          TextFormField(
            controller: _bioController,
            decoration: const InputDecoration(
              labelText: 'Bio',
            ),
            maxLines: 4,
          ),
        ],
      ),
    );
  }

  Widget _buildPreferences() {
    return CustomCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Preferences',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w600,
              color: AppTheme.textPrimary,
            ),
          ),
          const SizedBox(height: 24),
          
          // Timezone
          TextFormField(
            controller: _timezoneController,
            decoration: const InputDecoration(
              labelText: 'Time zone',
              hintText: 'e.g., America/Los_Angeles',
            ),
          ),
          const SizedBox(height: 24),
          
          // Notifications
          const Text(
            'Notifications',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w500,
              color: AppTheme.textPrimary,
            ),
          ),
          const SizedBox(height: 12),
          
          SwitchListTile(
            title: const Text(
              'Email reminders',
              style: TextStyle(color: AppTheme.textPrimary),
            ),
            value: _emailReminders,
            onChanged: (value) {
              setState(() {
                _emailReminders = value;
                _hasChanges = true;
              });
            },
            activeColor: AppTheme.purplePrimary,
            contentPadding: EdgeInsets.zero,
          ),
          
          SwitchListTile(
            title: const Text(
              'Push reminders',
              style: TextStyle(color: AppTheme.textPrimary),
            ),
            value: _pushReminders,
            onChanged: (value) {
              setState(() {
                _pushReminders = value;
                _hasChanges = true;
              });
            },
            activeColor: AppTheme.purplePrimary,
            contentPadding: EdgeInsets.zero,
          ),
          const SizedBox(height: 24),
          
          // Avatar Color
          const Text(
            'Avatar color',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w500,
              color: AppTheme.textPrimary,
            ),
          ),
          const SizedBox(height: 12),
          
          InkWell(
            onTap: () => _pickColor(context),
            child: Container(
              height: 50,
              decoration: BoxDecoration(
                color: Color(int.parse(_avatarColor.replaceAll('#', '0xff'))),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppTheme.textSecondary),
              ),
              child: Center(
                child: Text(
                  _avatarColor.toUpperCase(),
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _pickColor(BuildContext context) {
    final colors = [
      '#8a2be2', // Purple
      '#4caf50', // Green
      '#2196f3', // Blue
      '#f44336', // Red
      '#ffc107', // Yellow
      '#9c27b0', // Deep Purple
      '#00bcd4', // Cyan
      '#ff9800', // Orange
    ];

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.bgSecondary,
        title: const Text('Select Avatar Color', style: TextStyle(color: AppTheme.textPrimary)),
        content: Wrap(
          spacing: 12,
          runSpacing: 12,
          children: colors.map((color) {
            return InkWell(
              onTap: () {
                setState(() {
                  _avatarColor = color;
                  _hasChanges = true;
                });
                Navigator.pop(context);
              },
              child: Container(
                width: 50,
                height: 50,
                decoration: BoxDecoration(
                  color: Color(int.parse(color.replaceAll('#', '0xff'))),
                  borderRadius: BorderRadius.circular(25),
                  border: _avatarColor == color
                      ? Border.all(color: AppTheme.textPrimary, width: 3)
                      : null,
                ),
              ),
            );
          }).toList(),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  void _saveProfile(ProfileProvider profileProvider) {
    if (_formKey.currentState!.validate()) {
      final profile = UserProfile(
        name: _nameController.text,
        email: _emailController.text,
        bio: _bioController.text,
        timezone: _timezoneController.text,
        notifications: ProfileNotifications(
          emailReminders: _emailReminders,
          pushReminders: _pushReminders,
        ),
        avatarColor: _avatarColor,
      );

      profileProvider.updateProfile(profile);
      setState(() => _hasChanges = false);
      
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Profile updated successfully!')),
      );
    }
  }

  void _resetProfile(ProfileProvider profileProvider) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.bgSecondary,
        title: const Text('Reset Profile', style: TextStyle(color: AppTheme.textPrimary)),
        content: const Text(
          'Are you sure you want to reset your profile to default values?',
          style: TextStyle(color: AppTheme.textSecondary),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              profileProvider.resetProfile();
              final profile = profileProvider.profile;
              setState(() {
                _nameController.text = profile.name;
                _emailController.text = profile.email;
                _bioController.text = profile.bio;
                _timezoneController.text = profile.timezone;
                _emailReminders = profile.notifications.emailReminders;
                _pushReminders = profile.notifications.pushReminders;
                _avatarColor = profile.avatarColor;
                _hasChanges = false;
              });
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Profile reset to defaults')),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppTheme.danger),
            child: const Text('Reset'),
          ),
        ],
      ),
    );
  }
}
