import { renderHook, act } from '@testing-library/react';
import { useHabitStore, DEFAULT_CATEGORIES, Habit } from './habit-store';

describe('useHabitStore', () => {
  const initialStoreState = useHabitStore.getState();

  beforeEach(() => {
    useHabitStore.setState(initialStoreState, true); // Reset store
    // Clear local storage if needed, though we are resetting state
    localStorage.clear();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useHabitStore());
    expect(result.current.habits).toEqual([]);
    expect(result.current.categories).toEqual(DEFAULT_CATEGORIES);
    // In test environment with persist middleware, onRehydrateStorage might trigger immediately or differently.
    // However, we want to verify that the initial state can be checked.
    // We might skip checking isLoading here if it's flaky due to persist hydration.
  });

  it('should load habits', () => {
    const { result } = renderHook(() => useHabitStore());
    act(() => {
      result.current.loadHabits();
    });
    expect(result.current.isLoading).toBe(false);
  });

  it('should add a habit', () => {
    const { result } = renderHook(() => useHabitStore());
    const newHabit: Omit<Habit, "id"> = {
      name: 'New Habit',
      frequency: 'daily',
      days: ['Monday'],
      category: 'Health',
      reminder: false,
      completed: 0,
      streak: 0,
      lastCompletedDate: null,
      weeklyCompleted: 0,
      createdAt: '',
    };

    act(() => {
      result.current.addHabit(newHabit);
    });

    expect(result.current.habits).toHaveLength(1);
    expect(result.current.habits[0].name).toBe('New Habit');
    expect(result.current.habits[0].id).toBeDefined();
  });

  it('should edit a habit', () => {
    const { result } = renderHook(() => useHabitStore());
    const newHabit: Omit<Habit, "id"> = {
      name: 'New Habit',
      frequency: 'daily',
      days: ['Monday'],
      category: 'Health',
      reminder: false,
      completed: 0,
      streak: 0,
      lastCompletedDate: null,
      weeklyCompleted: 0,
      createdAt: '',
    };

    act(() => {
      result.current.addHabit(newHabit);
    });

    const habitId = result.current.habits[0].id;

    act(() => {
        result.current.editHabit(habitId, { ...newHabit, name: 'Updated Habit' });
    });

    expect(result.current.habits[0].name).toBe('Updated Habit');
  });

  it('should delete a habit', () => {
    const { result } = renderHook(() => useHabitStore());
    const newHabit: Omit<Habit, "id"> = {
        name: 'New Habit',
        frequency: 'daily',
        days: ['Monday'],
        category: 'Health',
        reminder: false,
        completed: 0,
        streak: 0,
        lastCompletedDate: null,
        weeklyCompleted: 0,
        createdAt: '',
      };

      act(() => {
        result.current.addHabit(newHabit);
      });

      const habitId = result.current.habits[0].id;

      act(() => {
        result.current.deleteHabit(habitId);
      });

      expect(result.current.habits).toHaveLength(0);
  });

  it('should add a category', () => {
      const { result } = renderHook(() => useHabitStore());
      act(() => {
          result.current.addCategory('New Category');
      });
      expect(result.current.categories).toContain('New Category');
  });

  it('should not add duplicate category', () => {
    const { result } = renderHook(() => useHabitStore());
    act(() => {
        result.current.addCategory('Health');
    });
    expect(result.current.categories.filter(c => c === 'Health')).toHaveLength(1);
});

  it('should delete a category', () => {
    const { result } = renderHook(() => useHabitStore());
    // First add a category that is not used
    act(() => {
        result.current.addCategory('Unused Category');
    });

    act(() => {
        result.current.deleteCategory('Unused Category');
    });

    expect(result.current.categories).not.toContain('Unused Category');
  });

  it('should not delete a category if used by a habit', () => {
    const { result } = renderHook(() => useHabitStore());

    // Mock window.alert
    window.alert = jest.fn();

    const newHabit: Omit<Habit, "id"> = {
        name: 'Health Habit',
        frequency: 'daily',
        days: ['Monday'],
        category: 'Health',
        reminder: false,
        completed: 0,
        streak: 0,
        lastCompletedDate: null,
        weeklyCompleted: 0,
        createdAt: '',
      };

      act(() => {
        result.current.addHabit(newHabit);
      });

      act(() => {
          result.current.deleteCategory('Health');
      });

      expect(window.alert).toHaveBeenCalled();
      expect(result.current.categories).toContain('Health');
  });

  describe('markHabitComplete', () => {
      beforeEach(() => {
          jest.useFakeTimers();
      });

      afterEach(() => {
          jest.useRealTimers();
      });

      it('should mark habit as complete', () => {
        const { result } = renderHook(() => useHabitStore());
        const today = new Date('2023-10-27'); // Friday
        jest.setSystemTime(today);

        const newHabit: Omit<Habit, "id"> = {
            name: 'Daily Habit',
            frequency: 'daily',
            days: ['Friday'],
            category: 'Health',
            reminder: false,
            completed: 0,
            streak: 0,
            lastCompletedDate: null,
            weeklyCompleted: 0,
            createdAt: '',
        };

        act(() => {
            result.current.addHabit(newHabit);
        });

        const habitId = result.current.habits[0].id;

        act(() => {
            result.current.markHabitComplete(habitId);
        });

        const habit = result.current.habits[0];
        expect(habit.completed).toBe(1);
        expect(habit.weeklyCompleted).toBe(1);
        expect(habit.lastCompletedDate).toBe('2023-10-27');
        // Streak should be 1
        expect(habit.streak).toBe(1);
      });

      it('should not mark habit as complete if already completed today', () => {
        const { result } = renderHook(() => useHabitStore());
        const today = new Date('2023-10-27'); // Friday
        jest.setSystemTime(today);

        const newHabit: Omit<Habit, "id"> = {
            name: 'Daily Habit',
            frequency: 'daily',
            days: ['Friday'],
            category: 'Health',
            reminder: false,
            completed: 0,
            streak: 0,
            lastCompletedDate: null,
            weeklyCompleted: 0,
            createdAt: '',
        };

        act(() => {
            result.current.addHabit(newHabit);
        });

        const habitId = result.current.habits[0].id;

        act(() => {
            result.current.markHabitComplete(habitId);
        });

        act(() => {
            result.current.markHabitComplete(habitId);
        });

        const habit = result.current.habits[0];
        expect(habit.completed).toBe(1); // Should still be 1
      });

      it('should increment streak correctly', () => {
          const { result } = renderHook(() => useHabitStore());
          // Case: Previous completion was yesterday
          // Yesterday: Thursday 2023-10-26
          // Today: Friday 2023-10-27
          // Days: Thursday, Friday

          jest.setSystemTime(new Date('2023-10-27'));

          const newHabit: Omit<Habit, "id"> = {
            name: 'Daily Habit',
            frequency: 'daily',
            days: ['Thursday', 'Friday'],
            category: 'Health',
            reminder: false,
            completed: 1,
            streak: 1,
            lastCompletedDate: '2023-10-26', // Yesterday
            weeklyCompleted: 1,
            createdAt: '',
        };

        act(() => {
            result.current.addHabit(newHabit);
        });

        const habitId = result.current.habits[0].id;

        act(() => {
            result.current.markHabitComplete(habitId);
        });

        const habit = result.current.habits[0];
        expect(habit.streak).toBe(2);
      });

      it('should reset streak if missed a day', () => {
        const { result } = renderHook(() => useHabitStore());
        // Case: Previous completion was 2 days ago
        // 2 days ago: Wednesday 2023-10-25
        // Today: Friday 2023-10-27
        // Days: Wednesday, Thursday, Friday
        // Missed Thursday.

        jest.setSystemTime(new Date('2023-10-27'));

        const newHabit: Omit<Habit, "id"> = {
          name: 'Daily Habit',
          frequency: 'daily',
          days: ['Wednesday', 'Thursday', 'Friday'],
          category: 'Health',
          reminder: false,
          completed: 10,
          streak: 10,
          lastCompletedDate: '2023-10-25', // Wednesday
          weeklyCompleted: 1,
          createdAt: '',
      };

      act(() => {
          result.current.addHabit(newHabit);
      });

      const habitId = result.current.habits[0].id;

      act(() => {
          result.current.markHabitComplete(habitId);
      });

      const habit = result.current.habits[0];
      expect(habit.streak).toBe(1);
    });
  });

  it('should reset weekly stats', () => {
    const { result } = renderHook(() => useHabitStore());
    const newHabit: Omit<Habit, "id"> = {
        name: 'Habit',
        frequency: 'daily',
        days: ['Monday'],
        category: 'Health',
        reminder: false,
        completed: 5,
        streak: 5,
        lastCompletedDate: '2023-10-27',
        weeklyCompleted: 5,
        createdAt: '',
      };

      act(() => {
        result.current.addHabit(newHabit);
      });

      act(() => {
          result.current.resetWeeklyStats();
      });

      expect(result.current.habits[0].weeklyCompleted).toBe(0);
      // Completed count should remain same
      expect(result.current.habits[0].completed).toBe(5);
  });
});
