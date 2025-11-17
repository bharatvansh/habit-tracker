import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHabitStore } from '../store/habit-store';

// Client component for weekly reset
export function WeeklyResetHandler() {
  const { resetWeeklyStats } = useHabitStore();

  useEffect(() => {
    const checkWeeklyReset = async () => {
      // Check if it's the start of a new week (Monday)
      const today = new Date();
      if (today.getDay() === 1) {
        // Monday
        const lastResetKey = "lastWeeklyReset";
        const lastReset = await AsyncStorage.getItem(lastResetKey);
        const thisMonday = today.toISOString().split("T")[0];

        if (lastReset !== thisMonday) {
          resetWeeklyStats();
          await AsyncStorage.setItem(lastResetKey, thisMonday);
        }
      }
    };

    checkWeeklyReset();
  }, [resetWeeklyStats]);

  return null;
}