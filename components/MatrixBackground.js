import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../styles/theme';

const { width, height } = Dimensions.get('window');

const MatrixBackground = () => {
  const lottieRef = useRef(null);
  
  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.play();
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* Matrix animation */}
      <LottieView
        ref={lottieRef}
        source={require('../assets/animations/matrix-code.json')}
        style={styles.matrixAnimation}
        autoPlay
        loop
        speed={0.5}
      />
      
      {/* Overlay gradient */}
      <LinearGradient
        colors={['rgba(10, 25, 47, 0.8)', 'rgba(10, 25, 47, 0.95)']}
        style={styles.overlay}
      />
      
      {/* Grid pattern */}
      <View style={styles.grid} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: width,
    height: height,
    zIndex: -1,
  },
  matrixAnimation: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  grid: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.05)',
    borderRadius: theme.borderRadius.sm,
  },
});

export default MatrixBackground;