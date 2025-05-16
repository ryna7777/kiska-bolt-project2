import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthService {
  // Sign in with email and password
  signIn = async (email, password) => {
    try {
      const response = await firebase.auth().signInWithEmailAndPassword(email, password);
      return { user: response.user, error: null };
    } catch (error) {
      return { user: null, error: this._formatFirebaseError(error) };
    }
  };

  // Sign up with email and password
  signUp = async (email, password) => {
    try {
      const response = await firebase.auth().createUserWithEmailAndPassword(email, password);
      return { user: response.user, error: null };
    } catch (error) {
      return { user: null, error: this._formatFirebaseError(error) };
    }
  };

  // Sign out
  signOut = async () => {
    try {
      await firebase.auth().signOut();
      return { error: null };
    } catch (error) {
      return { error: this._formatFirebaseError(error) };
    }
  };

  // Reset password
  resetPassword = async (email) => {
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      return { error: null };
    } catch (error) {
      return { error: this._formatFirebaseError(error) };
    }
  };

  // Get current user
  getCurrentUser = () => {
    return firebase.auth().currentUser;
  };

  // Format Firebase error messages to be more user-friendly
  _formatFirebaseError = (error) => {
    const errorCode = error.code;
    
    const errorMessages = {
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/invalid-credential': 'Invalid login credentials. Please try again.',
      'auth/email-already-in-use': 'This email is already in use. Please try another one.',
      'auth/weak-password': 'Password is too weak. It should be at least 6 characters.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/too-many-requests': 'Too many failed login attempts. Please try again later.',
      'auth/user-disabled': 'This account has been disabled.',
    };
    
    return errorMessages[errorCode] || error.message;
  };
  
  // Persist auth state
  persistAuthState = async (user) => {
    try {
      if (user) {
        await AsyncStorage.setItem('user', JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Error persisting auth state:', error);
    }
  };
  
  // Get persisted auth state
  getPersistedAuthState = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting persisted auth state:', error);
      return null;
    }
  };
}

// Singleton instance
export default new AuthService();