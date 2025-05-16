import axios from 'axios';

// Replace with your OpenWeatherMap API key
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchWeather = async (location = 'London') => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: location,
        units: 'imperial', // Use 'metric' for Celsius
        appid: API_KEY
      }
    });
    
    return {
      temperature: Math.round(response.data.main.temp),
      condition: response.data.weather[0].main,
      location: response.data.name,
      icon: response.data.weather[0].icon,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      feelsLike: Math.round(response.data.main.feels_like)
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return {
      temperature: '--',
      condition: 'Unknown',
      location: 'Unknown',
      icon: '01d',
      humidity: '--',
      windSpeed: '--',
      feelsLike: '--'
    };
  }
};

// Get weather icon URL
export const getWeatherIconUrl = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};