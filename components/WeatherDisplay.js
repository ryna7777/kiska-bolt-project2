import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { fetchWeather, getWeatherIconUrl } from '../services/weatherService';
import { theme } from '../styles/theme';

const WeatherDisplay = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch weather data on component mount
  useEffect(() => {
    const getWeatherData = async () => {
      try {
        setLoading(true);
        const data = await fetchWeather();
        setWeatherData(data);
        setError(null);
      } catch (err) {
        setError('Unable to fetch weather data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getWeatherData();
    
    // Refresh weather data every 30 minutes
    const interval = setInterval(getWeatherData, 30 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={theme.colors.accent.blue} />
      </View>
    );
  }

  if (error || !weatherData) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error || 'Weather unavailable'}</Text>
      </View>
    );
  }

  const { temperature, condition, icon } = weatherData;

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: getWeatherIconUrl(icon) }} 
        style={styles.icon} 
      />
      <Text style={styles.temperature}>{temperature}°F</Text>
      <Text style={styles.condition}>{condition}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.ui.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    ...theme.shadows.subtle,
  },
  icon: {
    width: 30,
    height: 30,
  },
  temperature: {
    ...theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.bold,
    marginHorizontal: theme.spacing.xs,
  },
  condition: {
    ...theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  error: {
    ...theme.typography.fontSize.sm,
    color: theme.colors.status.error,
  },
});

export default WeatherDisplay;