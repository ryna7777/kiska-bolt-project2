import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../styles/theme';

const EmailItem = ({ email, onPress }) => {
  const { sender, subject, preview, date, isRead } = email;
  
  // Format date for display
  const formatDate = (dateString) => {
    const emailDate = new Date(dateString);
    const today = new Date();
    
    // If email is from today, show time
    if (emailDate.toDateString() === today.toDateString()) {
      return emailDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Otherwise show day and month
    return emailDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };
  
  return (
    <TouchableOpacity 
      style={[styles.container, !isRead && styles.unread]} 
      onPress={() => onPress(email)}
    >
      {/* Sender initial avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {sender.charAt(0).toUpperCase()}
        </Text>
      </View>
      
      {/* Email content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text 
            style={[styles.sender, !isRead && styles.unreadText]} 
            numberOfLines={1}
          >
            {sender}
          </Text>
          <Text style={styles.date}>{formatDate(date)}</Text>
        </View>
        
        <Text 
          style={[styles.subject, !isRead && styles.unreadText]} 
          numberOfLines={1}
        >
          {subject}
        </Text>
        
        <Text style={styles.preview} numberOfLines={2}>
          {preview}
        </Text>
      </View>
      
      {/* Unread indicator */}
      {!isRead && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.divider,
    backgroundColor: theme.colors.primary.dark,
  },
  unread: {
    backgroundColor: theme.colors.primary.medium,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.accent.blue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  avatarText: {
    color: theme.colors.primary.dark,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  sender: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    flex: 1,
  },
  unreadText: {
    fontWeight: theme.typography.fontWeight.bold,
  },
  date: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    marginLeft: theme.spacing.sm,
  },
  subject: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  preview: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.accent.blue,
    alignSelf: 'center',
    marginLeft: theme.spacing.sm,
  },
});

export default EmailItem;