import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Player } from '@lottiefiles/react-lottie-player';
import { theme } from '../styles/theme';

const AnimatedOrb = ({ isListening, isSpeaking, size = 200 }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const lottieRef = useRef(null);
  
  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.play();
    }
  }, []);
  
  useEffect(() => {
    if (isListening || isSpeaking) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isListening, isSpeaking, pulseAnim]);

  const animatedStyle = {
    transform: [{ scale: pulseAnim }],
  };

  return (
    <Animated.View style={[styles.container, animatedStyle, { width: size, height: size }]}>
      <Player
        ref={lottieRef}
        src={require('../assets/animations/blue-orb.json')}
        autoplay
        loop
        style={styles.lottie}
      />
      
      <View style={[styles.glow, { width: size * 1.5, height: size * 1.5 }]} />
      
      {(isListening || isSpeaking) && (
        <View style={[
          styles.activeIndicator,
          { backgroundColor: isListening ? theme.colors.accent.purple : theme.colors.accent.blue }
        ]} />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  glow: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.accent.blue,
    opacity: 0.3,
    ...theme.shadows.glow,
  },
  activeIndicator: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    top: 10,
    right: 10,
  },
});

export default AnimatedOrb;