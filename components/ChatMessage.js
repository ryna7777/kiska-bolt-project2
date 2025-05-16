import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

const ChatMessage = ({ message, isUser }) => {
  return (
    <View style={[
      styles.container,
      isUser ? styles.userContainer : styles.assistantContainer
    ]}>
      <View style={[
        styles.bubble,
        isUser ? styles.userBubble : styles.assistantBubble
      ]}>
        <Text style={[
          styles.messageText,
          isUser ? styles.userText : styles.assistantText
        ]}>
          {message}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    maxWidth: '85%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  assistantContainer: {
    alignSelf: 'flex-start',
  },
  bubble: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.subtle,
  },
  userBubble: {
    backgroundColor: theme.colors.primary.light,
    borderTopRightRadius: theme.borderRadius.sm,
  },
  assistantBubble: {
    backgroundColor: theme.colors.ui.card,
    borderTopLeftRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.accent.blue,
  },
  messageText: {
    fontSize: theme.typography.fontSize.md,
    lineHeight: theme.typography.lineHeight.normal,
  },
  userText: {
    color: theme.colors.text.primary,
  },
  assistantText: {
    color: theme.colors.text.primary,
  },
});

export default ChatMessage;