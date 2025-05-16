import Voice from 'react-native-voice';

const isWeb = typeof window !== 'undefined';
const isVoiceSupported = !isWeb || (isWeb && (window.SpeechRecognition || window.webkitSpeechRecognition));

class VoiceService {
  constructor() {
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechRecognized = this.onSpeechRecognized;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
    Voice.onSpeechPartialResults = this.onSpeechPartialResults;

    this.callbacks = {
      onStart: null,
      onRecognized: null,
      onEnd: null,
      onError: null,
      onResults: null,
      onPartialResults: null,
    };
  }

  // Setup callbacks
  setCallbacks(callbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  // Start listening
  start = async (locale = 'en-US') => {
    if (!isVoiceSupported) {
      console.warn('Voice recognition is not supported on this platform.');
      return;
    }
    try {
      await Voice.start(locale);
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      if (this.callbacks.onError) {
        this.callbacks.onError(error);
      }
    }
  };

  // Stop listening
  stop = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
  };

  // Clean up resources
  destroy = async () => {
    try {
      await Voice.destroy();
    } catch (error) {
      console.error('Error destroying voice instance:', error);
    }
  };

  // Voice callback handlers
  onSpeechStart = (event) => {
    if (this.callbacks.onStart) {
      this.callbacks.onStart(event);
    }
  };

  onSpeechRecognized = (event) => {
    if (this.callbacks.onRecognized) {
      this.callbacks.onRecognized(event);
    }
  };

  onSpeechEnd = (event) => {
    if (this.callbacks.onEnd) {
      this.callbacks.onEnd(event);
    }
  };

  onSpeechError = (event) => {
    if (this.callbacks.onError) {
      this.callbacks.onError(event);
    }
  };

  onSpeechResults = (event) => {
    if (this.callbacks.onResults && event.value) {
      this.callbacks.onResults(event.value);
    }
  };

  onSpeechPartialResults = (event) => {
    if (this.callbacks.onPartialResults && event.value) {
      this.callbacks.onPartialResults(event.value);
    }
  };

  // Check if supported
  isSupported = () => {
    return isVoiceSupported;
  };
}

export default new VoiceService();