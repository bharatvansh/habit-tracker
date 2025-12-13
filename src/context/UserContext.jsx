import React, { createContext, useContext, useState, useEffect } from 'react';

const USER_STORAGE_KEY = 'habitual_user';

const defaultUser = {
  name: 'Alex',
  displayName: 'Alex Strangelove',
  preferences: {
    theme: 'dark',
  },
};

const UserContext = createContext(undefined);

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load user from localStorage:', error);
    }
    return defaultUser;
  });

  // Persist to localStorage whenever user changes
  useEffect(() => {
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save user to localStorage:', error);
    }
  }, [user]);

  const updateUser = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const updatePreferences = (preferences) => {
    setUser((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, ...preferences },
    }));
  };

  // Get first name for greetings
  const firstName = user.displayName?.split(' ')[0] || user.name || 'User';

  const value = {
    user,
    firstName,
    updateUser,
    updatePreferences,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
