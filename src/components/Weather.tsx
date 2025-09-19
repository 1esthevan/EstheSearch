import React, { useState, useEffect } from 'react';

interface WeatherData {
  temp: number;
  city: string;
  icon: string;
}

interface WeatherProps {
  userCity: string;
}

// Mapping WMO Weather interpretation codes to Font Awesome icons
// See: https://open-meteo.com/en/docs
const WEATHER_CODE_MAP: { [key: number]: string } = {
  0: 'fa-sun', // Clear sky
  1: 'fa-cloud-sun', // Mainly clear
  2: 'fa-cloud', // Partly cloudy
  3: 'fa-cloud', // Overcast
  45: 'fa-smog', // Fog
  48: 'fa-smog', // Depositing rime fog
  51: 'fa-cloud-rain', // Drizzle: Light
  53: 'fa-cloud-rain', // Drizzle: Moderate
  55: 'fa-cloud-rain', // Drizzle: Dense
  61: 'fa-cloud-showers-heavy', // Rain: Slight
  63: 'fa-cloud-showers-heavy', // Rain: Moderate
  65: 'fa-cloud-showers-heavy', // Rain: Heavy
  71: 'fa-snowflake', // Snow fall: Slight
  73: 'fa-snowflake', // Snow fall: Moderate
  75: 'fa-snowflake', // Snow fall: Heavy
  77: 'fa-snowflake', // Snow grains
  80: 'fa-cloud-showers-heavy', // Rain showers: Slight
  81: 'fa-cloud-showers-heavy', // Rain showers: Moderate
  82: 'fa-cloud-showers-heavy', // Rain showers: Violent
  95: 'fa-bolt', // Thunderstorm: Slight or moderate
  96: 'fa-bolt', // Thunderstorm with slight hail
  99: 'fa-bolt', // Thunderstorm with heavy hail
};


const Weather: React.FC<WeatherProps> = ({ userCity }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherAndLocation = async (lat: number, lon: number, knownCity?: string) => {
      // setLoading(true) is managed by the calling function
      try {
        // Fetch weather data from Open-Meteo using the current recommended API
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        if (!weatherResponse.ok) {
          throw new Error('Failed to fetch weather data.');
        }
        const weatherData = await weatherResponse.json();
        
        // Use knownCity if provided, otherwise fetch city name from Nominatim
        let cityName = knownCity || "Local Area";
        if (!knownCity) {
          const locationResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
           if (locationResponse.ok) {
              const locationData = await locationResponse.json();
              cityName = locationData.address?.city || locationData.address?.town || locationData.address?.village || "Local Area";
           }
        }

        const temp = Math.round(weatherData.current_weather.temperature);
        const weatherCode = weatherData.current_weather.weathercode;
        const icon = WEATHER_CODE_MAP[weatherCode] || 'fa-question-circle';

        setWeather({ temp, city: cityName, icon });
        setError(null);

      } catch (err) {
        let message = 'An unknown error occurred.';
        if (err instanceof Error) {
            message = err.message;
        }
        setError(message);
        setWeather(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchWeatherForCity = async (city: string) => {
      setLoading(true);
      setError(null);
      try {
        const geocodeResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
        if (!geocodeResponse.ok) throw new Error('Failed to find city.');
        const geocodeData = await geocodeResponse.json();
        if (!geocodeData.results || geocodeData.results.length === 0) {
          throw new Error(`Could not find location for "${city}".`);
        }
        const { latitude, longitude, name } = geocodeData.results[0];
        await fetchWeatherAndLocation(latitude, longitude, name);
      } catch (err) {
         let message = 'An unknown error occurred.';
         if (err instanceof Error) {
             message = err.message;
         }
         setError(message);
         setWeather(null);
         setLoading(false);
      }
    };
    
    const getLocation = () => {
      setLoading(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherAndLocation(latitude, longitude);
          },
          (err) => {
            setError('Location permission denied.');
            fetchWeatherAndLocation(40.71, -74.01, 'New York');
          }
        );
      } else {
        setError('Geolocation is not supported.');
        fetchWeatherAndLocation(40.71, -74.01, 'New York');
      }
    };

    if (userCity) {
      fetchWeatherForCity(userCity);
    } else {
      getLocation();
    }
  }, [userCity]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
           <i className="fas fa-spinner fa-spin text-4xl text-white/80"></i>
           <span className="mt-3 text-sm text-white/60">Fetching weather...</span>
        </div>
      );
    }

    if (error && !weather) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
           <i className="fas fa-exclamation-triangle text-4xl text-yellow-400"></i>
           <span className="mt-3 text-sm text-white/80">{error}</span>
        </div>
      );
    }
    
    if (weather) {
      return (
        <div className="text-center">
            <i className={`fas ${weather.icon} text-6xl text-white/90`}></i>
            <p className="text-5xl font-bold mt-2">{weather.temp}°C</p>
            <p className="text-md text-white/70 mt-1">{weather.city}</p>
             {error && <p className="text-xs text-yellow-400/70 mt-2 absolute bottom-4 left-0 right-0 px-2">{error}</p>}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="group cursor-pointer hover:skew-x-6 hover:-skew-y-6 hover:duration-500 duration-500 group-hover:duration-500 overflow-hidden relative rounded-2xl shadow-inner shadow-gray-50 flex flex-col justify-center items-center w-48 h-48 bg-black/30 backdrop-blur-variable text-gray-50">
      <div className="relative w-full h-full flex items-center justify-center p-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default Weather;