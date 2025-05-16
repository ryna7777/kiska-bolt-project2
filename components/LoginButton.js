import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../styles/theme';

const LoginButton = ({ onPress, title = 'LOGIN', style, isLoading = false }) => {
  // Animation for the glow effect
  const animatedValue = new Animated.Value(0);
  
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  
  const glowOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 0.9],
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.buttonContainer, style]}
      disabled={isLoading}
    >
      <LinearGradient
        colors={[theme.colors.primary.medium, theme.colors.primary.light]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <Animated.View 
          style={[
            styles.glow,
            { opacity: glowOpacity }
          ]} 
        />
        <Text style={styles.text}>{isLoading ? 'PLEASE WAIT...' : title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: 200,
    height: 50,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: theme.colors.accent.blue,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.glow,
  },
  text: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: 2,
  },
});

export default LoginButton;