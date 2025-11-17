import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { ProfileProvider } from '../hooks/use-profile';
import { WeeklyResetHandler } from '../components/weekly-reset-handler';
import { SessionTracker } from '../components/session-tracker';
import * as Notifications from 'expo-notifications';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function RootLayout() {
  return (
    <ProfileProvider>
      <PaperProvider>
        <SafeAreaProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="light" />
          <WeeklyResetHandler />
          <SessionTracker />
        </SafeAreaProvider>
      </PaperProvider>
    </ProfileProvider>
  );
}