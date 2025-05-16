// Chat service for handling conversation with OpenAI GPT model
// API key would need to be added at deployment time

// Sample responses for demonstration
const SAMPLE_RESPONSES = {
  'hello': 'Hello! How can I assist you today?',
  'hi': 'Hi there! What can I do for you?',
  'how are you': 'I\'m functioning perfectly. How can I help you?',
  'what time is it': 'I\'ll check the current time for you.',
  'weather': 'I\'ll get the current weather information for you.',
  'who are you': 'I am KISKA, your personal AI assistant. I\'m designed to help you with information, tasks, and more.',
  'what can you do': 'I can provide information, check the weather, tell you the time, help manage your tasks, and much more. Just ask!',
  'thank you': 'You\'re welcome! Is there anything else I can help with?',
  'thanks': 'You\'re welcome! Need anything else?',
  'goodbye': 'Goodbye! Have a great day!',
  'bye': 'Bye! Feel free to ask for help anytime.',
};

class ChatService {
  constructor() {
    this.apiKey = null;
    this.messageHistory = [];
    this.maxHistoryLength = 20;
  }

  // Initialize with API key
  initialize(apiKey) {
    this.apiKey = apiKey;
  }

  // Get response for user message
  async getResponse(message) {
    try {
      // For a real implementation, you would call OpenAI API here
      // This is a simple demo implementation
      
      const lowerMessage = message.toLowerCase();
      
      // Add message to history
      this.addMessageToHistory({
        role: 'user',
        content: message
      });
      
      // Demo response handling
      let response;
      
      // Check for specific patterns
      if (lowerMessage.includes('time')) {
        response = this._generateTimeResponse();
      } else if (lowerMessage.includes('weather')) {
        response = 'I\'ll check the weather for you. One moment please.';
      } else {
        // Check for matching responses in samples
        response = this._getSampleResponse(lowerMessage);
      }
      
      // Add response to history
      this.addMessageToHistory({
        role: 'assistant',
        content: response
      });
      
      return response;
    } catch (error) {
      console.error('Error getting chat response:', error);
      return 'I apologize, but I\'m having trouble processing your request right now.';
    }
  }
  
  // Add message to history
  addMessageToHistory(message) {
    this.messageHistory.push(message);
    
    // Trim history if it gets too long
    if (this.messageHistory.length > this.maxHistoryLength) {
      this.messageHistory = this.messageHistory.slice(
        this.messageHistory.length - this.maxHistoryLength
      );
    }
  }
  
  // Get conversation history
  getMessageHistory() {
    return this.messageHistory;
  }
  
  // Clear conversation history
  clearMessageHistory() {
    this.messageHistory = [];
  }
  
  // Generate time response
  _generateTimeResponse() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    const formattedHours = hours % 12 || 12;
    const amPm = hours >= 12 ? 'PM' : 'AM';
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    return `It's currently ${formattedHours}:${formattedMinutes} ${amPm}.`;
  }
  
  // Get sample response
  _getSampleResponse(message) {
    // Check for direct matches
    for (const key of Object.keys(SAMPLE_RESPONSES)) {
      if (message.includes(key)) {
        return SAMPLE_RESPONSES[key];
      }
    }
    
    // Default response
    return "I'm not sure how to respond to that. Is there something specific you'd like to know?";
  }
}

// Singleton instance
export default new ChatService();