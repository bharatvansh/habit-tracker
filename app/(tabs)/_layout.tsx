import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Slot, usePathname, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const navItems = [
  { name: 'index', title: 'Home', icon: 'home' as const },
  { name: 'dna', title: 'Habit DNA™', icon: 'fitness' as const },
  { name: 'analytics', title: 'Analytics', icon: 'analytics' as const },
  { name: 'reminders', title: 'Reminders', icon: 'notifications' as const },
  { name: 'habits', title: 'Habits', icon: 'checkbox' as const },
  { name: 'profile', title: 'Profile', icon: 'person' as const },
];

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
                size={24}
                color={active ? '#ffffff' : '#b3b3b3'}
              />
              <Text style={[styles.navText, active && styles.navTextActive]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        })}
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
    width: 165,
    backgroundColor: '#1e1e1e',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 20,
    paddingHorizontal: 12,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  brandIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#252525',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  brandText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 4,
    borderRadius: 8,
  },
  navItemActive: {
    backgroundColor: '#2d2d2d',
  },
  navText: {
    color: '#b3b3b3',
    fontSize: 14,
    marginLeft: 12,
  },
  navTextActive: {
    color: '#ffffff',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
});