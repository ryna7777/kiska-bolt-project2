import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Animated,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../styles/theme';
import MatrixBackground from '../components/MatrixBackground';
import AnimatedOrb from '../components/AnimatedOrb';
import TimeDisplay from '../components/TimeDisplay';
import WeatherDisplay from '../components/WeatherDisplay';
import ChatMessage from '../components/ChatMessage';
import EmailScreen from './EmailScreen';
import authService from '../services/authService';
import voiceService from '../services/voiceService';
import speechService from '../services/speechService';
import chatService from '../services/chatService';

// Screen dimensions
const { width, height } = Dimensions.get('window');

// Create bottom tab navigator
const Tab = createBottomTabNavigator();

// Home Tab Screen
const HomeTab = ({ navigation }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userName, setUserName] = useState('User');
  
  const scrollViewRef = useRef();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Set up voice service callbacks
  useEffect(() => {
    voiceService.setCallbacks({
      onStart: () => setIsListening(true),
      onEnd: () => setIsListening(false),
      onResults: handleVoiceResults,
      onError: (error) => {
        console.error('Voice error:', error);
        setIsListening(false);
      },
    });
    
    // Set up speech service callbacks
    speechService.setCallbacks({
      onStart: () => setIsSpeaking(true),
      onDone: () => setIsSpeaking(false),
      onError: (error) => {
        console.error('Speech error:', error);
        setIsSpeaking(false);
      },
    });
    
    // Add welcome message
    setTimeout(() => {
      const welcomeMessage = "Hello, I'm KISKA. How can I assist you today?";
      setMessages([{ text: welcomeMessage, isUser: false }]);
      speechService.speak(welcomeMessage);
    }, 1000);
    
    // Cleanup
    return () => {
      voiceService.destroy();
    };
  }, []);
  
  // Fade in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);
  
  // Handle voice recognition results
  const handleVoiceResults = async (results) => {
    if (results && results.length > 0) {
      const recognizedText = results[0];
      setInput(recognizedText);
      await handleMessage(recognizedText);
    }
  };
  
  // Start voice recognition
  const startListening = () => {
    voiceService.start();
  };
  
  // Stop voice recognition
  const stopListening = () => {
    if (isListening) {
      voiceService.stop();
    }
  };
  
  // Handle sending a message
  const handleMessage = async (text = input) => {
    if (!text.trim()) return;
    
    // Add user message to chat
    const userMessage = { text, isUser: true };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    
    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
    
    // Process message
    try {
      // Check for time query
      if (text.toLowerCase().includes('time')) {
        const now = new Date();
        const timeResponse = `It's currently ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`;
        
        // Add assistant response
        const assistantMessage = { text: timeResponse, isUser: false };
        setMessages((prevMessages) => [...prevMessages, assistantMessage]);
        
        // Speak response
        speechService.speak(timeResponse);
      }
      // Check for weather query
      else if (text.toLowerCase().includes('weather')) {
        const weatherResponse = "I'm checking the current weather for you. You can see it in the top right corner of the screen.";
        
        // Add assistant response
        const assistantMessage = { text: weatherResponse, isUser: false };
        setMessages((prevMessages) => [...prevMessages, assistantMessage]);
        
        // Speak response
        speechService.speak(weatherResponse);
      }
      // Check for logout query
      else if (text.toLowerCase().includes('logout') || text.toLowerCase().includes('sign out')) {
        const logoutResponse = "Signing you out. Goodbye!";
        
        // Add assistant response
        const assistantMessage = { text: logoutResponse, isUser: false };
        setMessages((prevMessages) => [...prevMessages, assistantMessage]);
        
        // Speak response
        speechService.speak(logoutResponse);
        
        // Sign out after a delay
        setTimeout(() => {
          authService.signOut();
        }, 2000);
      }
      // Other queries
      else {
        // Get response from chat service
        const response = await chatService.getResponse(text);
        
        // Add assistant response
        const assistantMessage = { text: response, isUser: false };
        setMessages((prevMessages) => [...prevMessages, assistantMessage]);
        
        // Speak response
        speechService.speak(response);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add error message
      const errorMessage = { 
        text: "I'm sorry, I encountered an error processing your request.", 
        isUser: false 
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
    
    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <MatrixBackground />
      
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={styles.header}>
          <TimeDisplay />
          <WeatherDisplay />
        </View>
        
        {/* Central Orb */}
        <View style={styles.orbContainer}>
          <AnimatedOrb 
            isListening={isListening} 
            isSpeaking={isSpeaking}
            size={150} 
          />
          <Text style={styles.title}>KISKA</Text>
        </View>
        
        {/* Chat Messages */}
        <View style={styles.chatContainer}>
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message.text}
                isUser={message.isUser}
              />
            ))}
          </ScrollView>
          
          {/* Input Bar */}
          <View style={styles.inputBar}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Type your message..."
              placeholderTextColor={theme.colors.text.tertiary}
              returnKeyType="send"
              onSubmitEditing={() => handleMessage()}
            />
            
            <TouchableOpacity 
              style={styles.micButton}
              onPressIn={startListening}
              onPressOut={stopListening}
            >
              <LinearGradient
                colors={[theme.colors.primary.medium, theme.colors.primary.light]}
                style={styles.micButtonGradient}
              >
                <Text style={styles.micButtonText}>🎤</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.sendButton}
              onPress={() => handleMessage()}
            >
              <LinearGradient
                colors={[theme.colors.accent.cyan, theme.colors.accent.blue]}
                style={styles.sendButtonGradient}
              >
                <Text style={styles.sendButtonText}>▶</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

// Settings Tab Screen
const SettingsTab = () => {
  const [loading, setLoading] = useState(false);
  
  const handleSignOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <MatrixBackground />
      
      <View style={styles.settingsContainer}>
        <Text style={styles.settingsTitle}>Settings</Text>
        
        <View style={styles.settingSection}>
          <Text style={styles.settingTitle}>Account</Text>
          <TouchableOpacity 
            style={styles.settingButton}
            onPress={handleSignOut}
            disabled={loading}
          >
            <Text style={styles.settingButtonText}>
              {loading ? 'Signing Out...' : 'Sign Out'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.settingSection}>
          <Text style={styles.settingTitle}>Voice</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Voice Type</Text>
            <Text style={styles.settingValue}>Female</Text>
          </View>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Speech Rate</Text>
            <Text style={styles.settingValue}>Normal</Text>
          </View>
        </View>
        
        <View style={styles.settingSection}>
          <Text style={styles.settingTitle}>Appearance</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Theme</Text>
            <Text style={styles.settingValue}>Dark</Text>
          </View>
        </View>
        
        <View style={styles.settingSection}>
          <Text style={styles.settingTitle}>About</Text>
          <Text style={styles.aboutText}>
            KISKA AI Assistant v1.0.0{'\n'}
            Created with React Native and Expo
          </Text>
        </View>
      </View>
    </View>
  );
};

// Main Home Screen with Tab Navigator
const HomeScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: theme.colors.accent.blue,
        tabBarInactiveTintColor: theme.colors.text.tertiary,
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Assistant" 
        component={HomeTab}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabBarIcon, { color }]}>🤖</Text>
          ),
        }}
      />
      
      <Tab.Screen 
        name="Email" 
        component={EmailScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabBarIcon, { color }]}>📧</Text>
          ),
        }}
      />
      
      <Tab.Screen 
        name="Settings" 
        component={SettingsTab}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabBarIcon, { color }]}>⚙️</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary.dark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: theme.spacing.md,
    width: '100%',
    zIndex: 2,
  },
  orbContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.accent.blue,
    marginTop: theme.spacing.md,
    letterSpacing: 8,
  },
  chatContainer: {
    flex: 1,
    width: '100%',
    marginTop: theme.spacing.lg,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.sm,
  },
  messagesContent: {
    flexGrow: 1,
    paddingVertical: theme.spacing.md,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.primary.medium,
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.divider,
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: theme.colors.ui.card,
    color: theme.colors.text.primary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    marginRight: theme.spacing.sm,
    fontSize: theme.typography.fontSize.md,
  },
  micButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: theme.spacing.sm,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  micButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButtonText: {
    fontSize: 20,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  sendButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 20,
    color: theme.colors.text.primary,
  },
  tabBar: {
    backgroundColor: theme.colors.primary.medium,
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.divider,
    height: 60,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  tabBarIcon: {
    fontSize: 24,
  },
  settingsContainer: {
    flex: 1,
    padding: theme.spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 80 : 40,
  },
  settingsTitle: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xl,
  },
  settingSection: {
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.ui.card,
    padding: theme.spacing.lg,
    ...theme.shadows.subtle,
  },
  settingTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.divider,
  },
  settingLabel: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
  },
  settingValue: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.accent.blue,
  },
  settingButton: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary.light,
    alignItems: 'center',
  },
  settingButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  aboutText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    lineHeight: 24,
  },
});

export default HomeScreen;