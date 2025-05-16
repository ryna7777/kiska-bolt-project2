import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Player } from '@lottiefiles/react-lottie-player';
import MatrixBackground from '../components/MatrixBackground';
import LoginButton from '../components/LoginButton';
import { theme } from '../styles/theme';
import authService from '../services/authService';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const formPosition = useRef(new Animated.Value(50)).current;
  const lottieRef = useRef(null);
  
  React.useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.play();
    }
    
    Animated.timing(titleOpacity, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    
    Animated.timing(formPosition, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);
  
  const handleAuth = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      let result;
      
      if (isLogin) {
        result = await authService.signIn(email, password);
      } else {
        result = await authService.signUp(email, password);
      }
      
      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <MatrixBackground />
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.orbContainer}>
            <Player
              ref={lottieRef}
              src={require('../assets/animations/blue-orb.json')}
              style={styles.orbAnimation}
              loop
              autoplay
            />
          </View>
          
          <Animated.View style={{ opacity: titleOpacity }}>
            <Text style={styles.title}>KISKA</Text>
            <Text style={styles.subtitle}>Artificial Intelligence Assistant</Text>
          </Animated.View>
          
          <Animated.View 
            style={[styles.formContainer, { transform: [{ translateY: formPosition }] }]}
          >
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            }
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={theme.colors.text.tertiary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={theme.colors.text.tertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            
            <LoginButton
              title={isLogin ? 'LOGIN' : 'SIGN UP'}
              onPress={handleAuth}
              isLoading={loading}
              style={styles.loginButton}
            />
            
            <TouchableOpacity 
              onPress={toggleAuthMode}
              style={styles.toggleContainer}
            >
              <Text style={styles.toggleText}>
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary.dark,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  orbContainer: {
    width: 150,
    height: 150,
    marginBottom: theme.spacing.lg,
  },
  orbAnimation: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 48,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    letterSpacing: 8,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.accent.blue,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    letterSpacing: 1,
  },
  formContainer: {
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.ui.card,
    ...theme.shadows.subtle,
  },
  input: {
    width: '100%',
    height: 50,
    paddingHorizontal: theme.spacing.md,
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
  },
  loginButton: {
    width: '100%',
    marginTop: theme.spacing.md,
  },
  toggleContainer: {
    marginTop: theme.spacing.lg,
  },
  toggleText: {
    color: theme.colors.accent.blue,
    fontSize: theme.typography.fontSize.md,
  },
  errorText: {
    color: theme.colors.status.error,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
});

export default LoginScreen;