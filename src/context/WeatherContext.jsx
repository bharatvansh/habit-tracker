import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getWeather } from '../services/weatherService';

const WEATHER_STORAGE_KEY = 'habitual_weather';
const WEATHER_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
const WEATHER_LOCATION_KEY = 'habitual_weather_location';

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

  const [coords, setCoords] = useState(() => {
    try {
      const stored = localStorage.getItem(WEATHER_LOCATION_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      if (typeof parsed?.lat === 'number' && typeof parsed?.lon === 'number') {
        return parsed;
      }
    } catch {
      // ignore
    }
    return null;
  });

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

  // Acquire location (best-effort) then fetch weather.
  useEffect(() => {
    const shouldFetch = !weather;
    if (!shouldFetch) return;

    // If we have cached coordinates, use them first.
    if (coords?.lat && coords?.lon) {
      fetchWeather(coords.lat, coords.lon);
      return;
    }

    // Try geolocation. If denied/unavailable, fall back to default weather.
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const nextCoords = { lat, lon };
          setCoords(nextCoords);
          try {
            localStorage.setItem(WEATHER_LOCATION_KEY, JSON.stringify(nextCoords));
          } catch {
            // ignore
          }
          fetchWeather(lat, lon);
        },
        () => {
          fetchWeather();
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 60 * 60 * 1000 }
      );
      return;
    }

    fetchWeather();
  }, [coords, fetchWeather, weather]);

  // Refresh weather periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (coords?.lat && coords?.lon) {
        fetchWeather(coords.lat, coords.lon);
      } else {
        fetchWeather();
      }
    }, WEATHER_CACHE_DURATION);

    return () => clearInterval(interval);
  }, [coords, fetchWeather]);

  const value = {
    weather,
    loading,
    error,
    refreshWeather: (lat, lon) => {
      if (typeof lat === 'number' && typeof lon === 'number') {
        const nextCoords = { lat, lon };
        setCoords(nextCoords);
        try {
          localStorage.setItem(WEATHER_LOCATION_KEY, JSON.stringify(nextCoords));
        } catch {
          // ignore
        }
        return fetchWeather(lat, lon);
      }
      if (coords?.lat && coords?.lon) {
        return fetchWeather(coords.lat, coords.lon);
      }
      return fetchWeather();
    },
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
