import * as Speech from 'expo-speech';

const isWeb = typeof window !== 'undefined';

class SpeechService {
  constructor() {
    this.speaking = false;
    this.voice = null;
    this.rate = 0.9;
    this.pitch = 1.0;
    this.callbacks = {
      onStart: null,
      onDone: null,
      onError: null,
    };
  }

  // Setup callbacks
  setCallbacks(callbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  // Set voice settings
  setVoice(voice) {
    this.voice = voice;
  }

  // Set speech rate (0.5 - 2.0)
  setRate(rate) {
    this.rate = Math.max(0.5, Math.min(2.0, rate));
  }

  // Set pitch (0.5 - 2.0)
  setPitch(pitch) {
    this.pitch = Math.max(0.5, Math.min(2.0, pitch));
  }

  // Speak text
  speak = async (text, language = 'en-US') => {
    try {
      if (this.speaking) {
        await this.stop();
      }
      
      this.speaking = true;
      
      if (this.callbacks.onStart) {
        this.callbacks.onStart();
      }
      
      Speech.speak(text, {
        language,
        pitch: this.pitch,
        rate: this.rate,
        voice: this.voice,
        onDone: () => {
          this.speaking = false;
          if (this.callbacks.onDone) {
            this.callbacks.onDone();
          }
        },
        onError: (error) => {
          this.speaking = false;
          console.error('Speech error:', error);
          if (this.callbacks.onError) {
            this.callbacks.onError(error);
          }
        },
      });
    } catch (error) {
      this.speaking = false;
      console.error('Error in speech synthesis:', error);
      if (this.callbacks.onError) {
        this.callbacks.onError(error);
      }
    }
  };

  // Stop speaking
  stop = async () => {
    try {
      await Speech.stop();
      this.speaking = false;
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  };

  // Check if the service is speaking
  isSpeaking = () => {
    return this.speaking;
  };

  // Get available voices
  getAvailableVoices = async () => {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      return voices;
    } catch (error) {
      console.error('Error getting available voices:', error);
      return [];
    }
  };

  // Check if the device supports speech synthesis
  isSupported = () => {
    return !isWeb || (isWeb && window.speechSynthesis);
  };
}

// Singleton instance
export default new SpeechService();