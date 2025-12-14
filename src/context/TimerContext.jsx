import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const TIMER_STORAGE_KEY = 'habitual_timer';
const TIMER_SESSIONS_KEY = 'habitual_timer_sessions';

const DEFAULT_SESSION_DURATION = 45 * 60; // 45 minutes in seconds

const TimerContext = createContext(undefined);

export function TimerProvider({ children }) {
  const [timerState, setTimerState] = useState(() => {
    try {
      const stored = localStorage.getItem(TIMER_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Recalculate remaining time if timer was running
        if (parsed.isRunning && parsed.lastUpdated) {
          const elapsed = Math.floor((Date.now() - parsed.lastUpdated) / 1000);
          const newRemaining = Math.max(0, parsed.remainingSeconds - elapsed);
          return {
            ...parsed,
            remainingSeconds: newRemaining,
            isRunning: newRemaining > 0 ? parsed.isRunning : false,
          };
        }
        return parsed;
      }
    } catch (error) {
      console.error('Failed to load timer from localStorage:', error);
    }
    return {
      sessionName: 'Deep Work Session',
      totalSeconds: DEFAULT_SESSION_DURATION,
      remainingSeconds: DEFAULT_SESSION_DURATION,
      isRunning: false,
      isPaused: false,
      lastUpdated: null,
      sessionStartedAt: null,
    };
  });

  // Track completed sessions for productivity
  const [completedSessions, setCompletedSessions] = useState(() => {
    try {
      const stored = localStorage.getItem(TIMER_SESSIONS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [];
  });

  // Callback for when session completes
  const onSessionCompleteRef = useRef(null);

  const intervalRef = useRef(null);

  // Persist timer state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        TIMER_STORAGE_KEY,
        JSON.stringify({
          ...timerState,
          lastUpdated: timerState.isRunning ? Date.now() : null,
        })
      );
    } catch (error) {
      console.error('Failed to save timer to localStorage:', error);
    }
  }, [timerState]);

  // Persist completed sessions
  useEffect(() => {
    try {
      localStorage.setItem(TIMER_SESSIONS_KEY, JSON.stringify(completedSessions));
    } catch {}
  }, [completedSessions]);

  // Timer countdown logic
  useEffect(() => {
    if (timerState.isRunning && timerState.remainingSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setTimerState((prev) => {
          if (prev.remainingSeconds <= 1) {
            // Session completed - record it
            const completedMinutes = Math.round(prev.totalSeconds / 60);
            const session = {
              completedAt: new Date().toISOString(),
              durationMinutes: completedMinutes,
              sessionName: prev.sessionName,
            };
            setCompletedSessions(s => [...s, session]);
            
            // Trigger callback if set
            if (onSessionCompleteRef.current) {
              onSessionCompleteRef.current(completedMinutes);
            }
            
            return {
              ...prev,
              remainingSeconds: 0,
              isRunning: false,
              isPaused: false,
              sessionStartedAt: null,
            };
          }
          return {
            ...prev,
            remainingSeconds: prev.remainingSeconds - 1,
          };
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.isRunning]);

  const startTimer = useCallback((sessionName = 'Deep Work Session', durationMinutes = 45) => {
    const totalSeconds = durationMinutes * 60;
    setTimerState({
      sessionName,
      totalSeconds,
      remainingSeconds: totalSeconds,
      isRunning: true,
      isPaused: false,
      lastUpdated: Date.now(),
      sessionStartedAt: Date.now(),
    });
  }, []);

  const pauseTimer = useCallback(() => {
    setTimerState((prev) => ({
      ...prev,
      isRunning: false,
      isPaused: true,
    }));
  }, []);

  const resumeTimer = useCallback(() => {
    setTimerState((prev) => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      lastUpdated: Date.now(),
    }));
  }, []);

  const stopTimer = useCallback(() => {
    setTimerState((prev) => {
      // Record partial session if significant time was spent
      if (prev.sessionStartedAt) {
        const elapsedMinutes = Math.round((prev.totalSeconds - prev.remainingSeconds) / 60);
        if (elapsedMinutes >= 5) {
          const session = {
            completedAt: new Date().toISOString(),
            durationMinutes: elapsedMinutes,
            sessionName: prev.sessionName,
            partial: true,
          };
          setCompletedSessions(s => [...s, session]);
          
          if (onSessionCompleteRef.current) {
            onSessionCompleteRef.current(elapsedMinutes);
          }
        }
      }
      
      return {
        ...prev,
        remainingSeconds: prev.totalSeconds,
        isRunning: false,
        isPaused: false,
        sessionStartedAt: null,
      };
    });
  }, []);

  const resetTimer = useCallback(() => {
    setTimerState({
      sessionName: 'Deep Work Session',
      totalSeconds: DEFAULT_SESSION_DURATION,
      remainingSeconds: DEFAULT_SESSION_DURATION,
      isRunning: false,
      isPaused: false,
      lastUpdated: null,
    });
  }, []);

  // Format time for display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return {
      minutes: mins.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0'),
      display: `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`,
    };
  };

  const formattedTime = formatTime(timerState.remainingSeconds);
  const progress = timerState.totalSeconds > 0
    ? ((timerState.totalSeconds - timerState.remainingSeconds) / timerState.totalSeconds) * 100
    : 0;

  // Set callback for session completion (used by productivity tracking)
  const setOnSessionComplete = useCallback((callback) => {
    onSessionCompleteRef.current = callback;
  }, []);

  // Get today's completed sessions
  const todaysSessions = completedSessions.filter(s => {
    const today = new Date().toISOString().split('T')[0];
    return s.completedAt.startsWith(today);
  });

  const totalFocusMinutesToday = todaysSessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  const value = {
    ...timerState,
    formattedTime,
    progress,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    completedSessions,
    todaysSessions,
    totalFocusMinutesToday,
    setOnSessionComplete,
  };

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}
