import {
  calculateCompletionRate,
  getLongestStreak,
  getTodayProgress,
  wasHabitCompletedOnDate,
  getHabitsByCategory,
  calculateWeeklyActivity
} from './habit-utils';
import type { Habit } from '@/store/habit-store';

describe('habit-utils', () => {
  const mockHabits: Habit[] = [
    {
      id: '1',
      name: 'Habit 1',
      frequency: 'daily',
      days: ['Monday', 'Wednesday', 'Friday'],
      category: 'Health',
      reminder: false,
      completed: 10,
      streak: 5,
      lastCompletedDate: '2023-10-27',
      weeklyCompleted: 2,
      createdAt: '2023-01-01',
    },
    {
      id: '2',
      name: 'Habit 2',
      frequency: 'daily',
      days: ['Tuesday', 'Thursday'],
      category: 'Work',
      reminder: true,
      completed: 5,
      streak: 2,
      lastCompletedDate: '2023-10-26',
      weeklyCompleted: 1,
      createdAt: '2023-01-01',
    },
  ];

  describe('calculateCompletionRate', () => {
    beforeAll(() => {
       jest.useFakeTimers();
       jest.setSystemTime(new Date('2023-10-27')); // Friday
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    it('should return 0 if no habits', () => {
      expect(calculateCompletionRate([], 'today')).toBe(0);
    });

    it('should calculate completion rate for today', () => {
       // Friday. Habit 1 is scheduled on Friday and completed on 2023-10-27.
       // Habit 2 is scheduled on Tuesday, Thursday. Not scheduled today.
       // So total scheduled today is 1 (Habit 1). Completed today is 1.
       // Rate should be 100%.

       // Wait, let's check logic in habit-utils.ts
       // const todayDayName = today.toLocaleDateString("en-US", { weekday: "long" })
       // const scheduledToday = habits.filter((h) => h.days && h.days.includes(todayDayName))
       // const totalToday = scheduledToday.length || habits.length
       // const completedToday = habits.filter((h) => h.lastCompletedDate === todayStr).length

       // On Friday:
       // Habit 1: scheduled (Friday), completed (lastCompletedDate === '2023-10-27')
       // Habit 2: not scheduled

       // scheduledToday.length = 1
       // completedToday = 1
       // 1/1 * 100 = 100

      expect(calculateCompletionRate(mockHabits, 'today')).toBe(100);
    });

    it('should calculate completion rate for week', () => {
        // totalWeeklyPossible = sum(habit.days.length) = 3 + 2 = 5
        // totalWeeklyCompleted = sum(habit.weeklyCompleted) = 2 + 1 = 3
        // 3/5 * 100 = 60
        expect(calculateCompletionRate(mockHabits, 'week')).toBe(60);
    });
  });

  describe('getLongestStreak', () => {
    it('should return the longest streak', () => {
      const result = getLongestStreak(mockHabits);
      expect(result).toEqual({ days: 5, name: 'Habit 1' });
    });

    it('should return None if no habits', () => {
      expect(getLongestStreak([])).toEqual({ days: 0, name: 'None' });
    });
  });

  describe('getTodayProgress', () => {
    beforeAll(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2023-10-27')); // Friday
     });

     afterAll(() => {
         jest.useRealTimers();
     });

    it('should calculate today progress', () => {
      // Friday.
      // Habit 1: scheduled, completed today.
      // Habit 2: not scheduled.
      // Total scheduled: 1
      // Completed today: 1
      expect(getTodayProgress(mockHabits)).toEqual({ completed: 1, total: 1 });
    });
  });

  describe('wasHabitCompletedOnDate', () => {
    it('should return true if completed on date', () => {
      expect(wasHabitCompletedOnDate(mockHabits[0], '2023-10-27')).toBe(true);
    });

    it('should return false if not completed on date', () => {
      expect(wasHabitCompletedOnDate(mockHabits[0], '2023-10-26')).toBe(false);
    });
  });

  describe('getHabitsByCategory', () => {
    it('should group habits by category', () => {
      const categories = ['Health', 'Work', 'Personal'];
      const result = getHabitsByCategory(mockHabits, categories);
      expect(result).toEqual({
        Health: 1,
        Work: 1,
        Personal: 0,
      });
    });
  });

  describe('calculateWeeklyActivity', () => {
      // This function seems complex, let's test it.
      // It calculates percentages for each day of the week.

      it('should calculate weekly activity', () => {
         // mockHabits[0]: M, W, F. Completed 10 times.
         // mockHabits[1]: T, Th. Completed 5 times.
         // The function implementation uses `habitsForDay.filter((h) => h.completed > 0).length`
         // It checks if the habit has EVER been completed > 0 times, not specifically on that day.
         // Let's check the implementation again.
         /*
            const completedForDay = habitsForDay.filter((h) => h.completed > 0).length
            return Math.round((completedForDay / habitsForDay.length) * 100)
         */
         // Yes, it seems to verify if the habit has any completions at all.

         // Sunday: No habits scheduled. Returns 0.
         // Monday: Habit 1. Habit 1 has completed > 0. 100%.
         // Tuesday: Habit 2. Habit 2 has completed > 0. 100%.
         // Wednesday: Habit 1. 100%.
         // Thursday: Habit 2. 100%.
         // Friday: Habit 1. 100%.
         // Saturday: No habits. 0.

         const result = calculateWeeklyActivity(mockHabits, 'All Habits');
         expect(result).toEqual([0, 100, 100, 100, 100, 100, 0]);
      });
  });
});
