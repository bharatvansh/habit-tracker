import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getWeather } from '../services/weatherService';

const WEATHER_STORAGE_KEY = 'habitual_weather';
const WEATHER_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

const WeatherContext = createContext(undefined);

export function WeatherProvider({ children }) {
  const [weather, setWeather] = useState(() => {
    try {
      const stored = localStorage.getItem(WEATHER_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Check if cache is still valid
        if (Date.now() - parsed.timestamp < WEATHER_CACHE_DURATION) {
          return parsed.data;
        }
      }
    } catch (error) {
      console.error('Failed to load weather from localStorage:', error);
    }
    return null;
  });

  const [loading, setLoading] = useState(!weather);
  const [error, setError] = useState(null);

  const fetchWeather = useCallback(async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeather(lat, lon);
      setWeather(data);
      // Cache with timestamp
      localStorage.setItem(
        WEATHER_STORAGE_KEY,
        JSON.stringify({ data, timestamp: Date.now() })
      );
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch weather:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch weather on mount if not cached
  useEffect(() => {
    if (!weather) {
      fetchWeather();
    }
  }, [weather, fetchWeather]);

  // Refresh weather periodically
  useEffect(() => {
    const interval = setInterval(() => {
      fetchWeather();
    }, WEATHER_CACHE_DURATION);

    return () => clearInterval(interval);
  }, [fetchWeather]);

  const value = {
    weather,
    loading,
    error,
    refreshWeather: fetchWeather,
  };

  return <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>;
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
