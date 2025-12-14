// Weather Service using Open-Meteo API (free, no API key required)
// Default location: San Francisco (37.7749, -122.4194)

const DEFAULT_LAT = 37.7749;
const DEFAULT_LON = -122.4194;

// Weather code mapping for Open-Meteo
const weatherCodeMap = {
  0: { condition: 'Clear Sky', icon: 'sunny' },
  1: { condition: 'Mainly Clear', icon: 'sunny' },
  2: { condition: 'Partly Cloudy', icon: 'partly_cloudy_day' },
  3: { condition: 'Overcast', icon: 'cloud' },
  45: { condition: 'Foggy', icon: 'foggy' },
  48: { condition: 'Rime Fog', icon: 'foggy' },
  51: { condition: 'Light Drizzle', icon: 'rainy' },
  53: { condition: 'Moderate Drizzle', icon: 'rainy' },
  55: { condition: 'Dense Drizzle', icon: 'rainy' },
  56: { condition: 'Freezing Drizzle', icon: 'weather_snowy' },
  57: { condition: 'Dense Freezing Drizzle', icon: 'weather_snowy' },
  61: { condition: 'Slight Rain', icon: 'rainy' },
  63: { condition: 'Moderate Rain', icon: 'rainy' },
  65: { condition: 'Heavy Rain', icon: 'rainy' },
  66: { condition: 'Freezing Rain', icon: 'weather_snowy' },
  67: { condition: 'Heavy Freezing Rain', icon: 'weather_snowy' },
  71: { condition: 'Slight Snow', icon: 'weather_snowy' },
  73: { condition: 'Moderate Snow', icon: 'weather_snowy' },
  75: { condition: 'Heavy Snow', icon: 'weather_snowy' },
  77: { condition: 'Snow Grains', icon: 'weather_snowy' },
  80: { condition: 'Slight Showers', icon: 'rainy' },
  81: { condition: 'Moderate Showers', icon: 'rainy' },
  82: { condition: 'Violent Showers', icon: 'rainy' },
  85: { condition: 'Slight Snow Showers', icon: 'weather_snowy' },
  86: { condition: 'Heavy Snow Showers', icon: 'weather_snowy' },
  95: { condition: 'Thunderstorm', icon: 'thunderstorm' },
  96: { condition: 'Thunderstorm with Hail', icon: 'thunderstorm' },
  99: { condition: 'Thunderstorm with Heavy Hail', icon: 'thunderstorm' },
};

export async function getWeather(lat = DEFAULT_LAT, lon = DEFAULT_LON) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,uv_index&temperature_unit=fahrenheit`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    const weatherCode = data.current.weather_code;
    const weatherInfo = weatherCodeMap[weatherCode] || { condition: 'Unknown', icon: 'cloud' };

    const location = await getLocationLabel(lat, lon);
    
    return {
      temperature: Math.round(data.current.temperature_2m),
      condition: weatherInfo.condition,
      icon: weatherInfo.icon,
      uvIndex: Math.round(data.current.uv_index || 0),
      location,
    };
  } catch (error) {
    console.error('Failed to fetch weather:', error);
    // Return fallback data
    return {
      temperature: 72,
      condition: 'Clear Sky',
      icon: 'sunny',
      uvIndex: 4,
      location: 'San Francisco',
    };
  }
}

async function getLocationLabel(lat, lon) {
  // Best-effort reverse geocoding (no API key). If it fails, fall back gracefully.
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1&language=en&format=json`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Geocoding API error: ${response.status}`);
    const data = await response.json();

    const first = data?.results?.[0];
    const name = first?.name;
    const admin1 = first?.admin1;
    const country = first?.country;
    if (name && admin1) return `${name}, ${admin1}`;
    if (name && country) return `${name}, ${country}`;
    if (name) return name;
  } catch {
    // ignore
  }
  return 'Local';
}
