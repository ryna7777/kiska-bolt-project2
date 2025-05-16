import { colors } from './colors';

// Main theme object for the app
export const theme = {
  // Colors from our palette
  colors,
  
  // Typography settings
  typography: {
    fontFamily: {
      regular: 'System',  // Default system font
      mono: 'monospace',   // For code and technical text
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    fontWeight: {
      light: '300',
      regular: '400',
      medium: '500',
      bold: '700',
    },
    lineHeight: {
      tight: 1.2,    // For headings
      normal: 1.5,   // For body text
      loose: 1.8,    // For readable paragraphs
    },
  },
  
  // Spacing system (based on 8px)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  
  // Border radius
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    circle: 9999,
  },
  
  // Shadows
  shadows: {
    // Subtle shadow
    subtle: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    // Medium shadow
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
    // Strong shadow
    strong: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 6,
    },
    // Glow effect (blue)
    glow: {
      shadowColor: colors.accent.blue,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 8,
    },
  },
  
  // Animation timing
  animation: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  
  // Z-index levels
  zIndex: {
    base: 1,
    menu: 10,
    modal: 100,
    tooltip: 1000,
  },
};