import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Slot, usePathname, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const navItems = [
  { name: 'index', title: 'Home', icon: 'home' as const },
  { name: 'dna', title: 'Habit DNA™', icon: 'fitness' as const },
  { name: 'analytics', title: 'Analytics', icon: 'analytics' as const },
  { name: 'reminders', title: 'Reminders', icon: 'notifications' as const },
  { name: 'habits', title: 'Habits', icon: 'checkbox' as const },
];

const profileItem = { name: 'profile', title: 'Profile', icon: 'person' as const };

export default function TabLayout() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (name: string) => {
    if (name === 'index') {
      return pathname === '/' || pathname === '/index';
    }
    return pathname.includes(name);
  };

  return (
    <View style={styles.container}>
      <View style={styles.sidebar}>
        <View style={styles.brandContainer}>
          <View style={styles.brandIcon}>
            <Ionicons name="checkmark-circle" size={20} color="#8a2be2" />
          </View>
          <Text style={styles.brandText}>Habitual</Text>
        </View>
        
        <View style={styles.navContainer}>
          {navItems.map((item) => {
            const active = isActive(item.name);
            return (
              <TouchableOpacity
                key={item.name}
                style={[styles.navItem, active && styles.navItemActive]}
                onPress={() =>
                  router.push(`/(tabs)/${item.name === 'index' ? '' : item.name}`)
                }
              >
                <Ionicons
                  name={item.icon}
                  size={22}
                  color={active ? '#ffffff' : '#b3b3b3'}
                />
                <Text style={[styles.navText, active && styles.navTextActive]}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <View style={[styles.profileAvatar, isActive('profile') && styles.profileAvatarActive]}>
            <Ionicons name="person" size={24} color={isActive('profile') ? '#8a2be2' : '#b3b3b3'} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Slot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#121212',
  },
  sidebar: {
    width: 240,
    backgroundColor: '#1e1e1e',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 24,
    paddingHorizontal: 16,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 32,
  },
  brandIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#252525',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  brandText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
  navContainer: {
    flex: 1,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 6,
    borderRadius: 10,
  },
  navItemActive: {
    backgroundColor: 'rgba(138, 43, 226, 0.15)',
  },
  navText: {
    color: '#b3b3b3',
    fontSize: 15,
    marginLeft: 14,
  },
  navTextActive: {
    color: '#ffffff',
    fontWeight: '500',
  },
  profileButton: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#252525',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  profileAvatarActive: {
    borderColor: '#8a2be2',
    backgroundColor: 'rgba(138, 43, 226, 0.1)',
  },
  content: {
    flex: 1,
  },
});