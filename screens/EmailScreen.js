import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity,
  FlatList,
  Dimensions
} from 'react-native';
import { theme } from '../styles/theme';
import MatrixBackground from '../components/MatrixBackground';
import EmailItem from '../components/EmailItem';

const isWeb = typeof window !== 'undefined';
const topPadding = isWeb ? 60 : 20;

// Sample email data
const SAMPLE_EMAILS = [
  {
    id: '1',
    sender: 'Project Manager',
    subject: 'Weekly Update on Project Status',
    preview: 'Hey team, just wanted to check in on the progress of our current sprint. Can you please provide your updates...',
    date: '2023-04-05T09:30:00',
    isRead: false,
  },
  {
    id: '2',
    sender: 'Marketing Team',
    subject: 'New Campaign Launch',
    preview: 'We are excited to announce our new marketing campaign that will launch next week. Please review the materials...',
    date: '2023-04-04T14:25:00',
    isRead: true,
  },
  {
    id: '3',
    sender: 'HR Department',
    subject: 'Company Policy Updates',
    preview: 'Please be informed that we have updated our company policies. The new handbook is available on the intranet...',
    date: '2023-04-03T11:15:00',
    isRead: true,
  },
  {
    id: '4',
    sender: 'Sarah Johnson',
    subject: 'Client Meeting Recap',
    preview: 'Following our meeting with the client yesterday, I wanted to summarize the key points we discussed and next steps...',
    date: '2023-04-03T08:45:00',
    isRead: false,
  },
  {
    id: '5',
    sender: 'Tech Support',
    subject: 'Your Support Ticket #45892',
    preview: 'We received your support ticket regarding the login issues. Our team is looking into it and will get back to you shortly...',
    date: '2023-04-02T16:20:00',
    isRead: true,
  },
];

const EmailScreen = () => {
  const [emails, setEmails] = useState(SAMPLE_EMAILS);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [replyText, setReplyText] = useState('');
  
  // Handle email selection
  const handleEmailSelect = (email) => {
    // Mark email as read when selected
    const updatedEmails = emails.map(item => 
      item.id === email.id ? { ...item, isRead: true } : item
    );
    setEmails(updatedEmails);
    setSelectedEmail(email);
  };
  
  // Handle reply submission
  const handleSendReply = () => {
    if (!replyText.trim() || !selectedEmail) return;
    
    // In a real app, this would send the reply to the backend
    alert(`Reply sent to ${selectedEmail.sender}: "${replyText}"`);
    
    // Clear reply text and return to inbox
    setReplyText('');
    setSelectedEmail(null);
  };
  
  // Handle back to inbox
  const handleBackToInbox = () => {
    setSelectedEmail(null);
    setReplyText('');
  };
  
  // Render email detail view
  const renderEmailDetail = () => {
    return (
      <View style={styles.emailDetailContainer}>
        <View style={styles.emailHeader}>
          <TouchableOpacity onPress={handleBackToInbox} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.emailSubject}>{selectedEmail.subject}</Text>
        </View>
        
        <View style={styles.emailInfo}>
          <Text style={styles.emailSender}>From: {selectedEmail.sender}</Text>
          <Text style={styles.emailDate}>
            {new Date(selectedEmail.date).toLocaleString()}
          </Text>
        </View>
        
        <ScrollView style={styles.emailContent}>
          <Text style={styles.emailPreview}>{selectedEmail.preview}</Text>
          {/* In a real app, this would show the full email content */}
          <Text style={styles.emailBody}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, 
            nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget aliquam
            nunc nisl eget nunc. Nullam auctor, nisl eget ultricies tincidunt, 
            nunc nisl aliquam nisl, eget aliquam nunc nisl eget nunc.
            {'\n\n'}
            Best regards,
            {'\n'}
            {selectedEmail.sender}
          </Text>
        </ScrollView>
        
        <View style={styles.replyContainer}>
          <TextInput
            style={styles.replyInput}
            placeholder="Type your reply..."
            placeholderTextColor={theme.colors.text.tertiary}
            value={replyText}
            onChangeText={setReplyText}
            multiline
          />
          
          <TouchableOpacity 
            style={[
              styles.sendButton, 
              !replyText.trim() && styles.sendButtonDisabled
            ]}
            onPress={handleSendReply}
            disabled={!replyText.trim()}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  // Render email inbox
  const renderInbox = () => {
    return (
      <View style={styles.inboxContainer}>
        <Text style={styles.inboxTitle}>Inbox</Text>
        
        {emails.length === 0 ? (
          <Text style={styles.noEmailsText}>No emails to display</Text>
        ) : (
          <FlatList
            data={emails}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <EmailItem email={item} onPress={handleEmailSelect} />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <MatrixBackground />
      
      {selectedEmail ? renderEmailDetail() : renderInbox()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary.dark,
  },
  inboxContainer: {
    flex: 1,
    padding: theme.spacing.md,
    paddingTop: topPadding,
  },
  inboxTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
    marginLeft: theme.spacing.md,
  },
  noEmailsText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.md,
    textAlign: 'center',
    marginTop: theme.spacing.xl,
  },
  emailDetailContainer: {
    flex: 1,
    padding: theme.spacing.md,
    paddingTop: topPadding,
    backgroundColor: theme.colors.primary.medium,
  },
  emailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.divider,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    ...theme.shadows.subtle,
  },
  backButtonText: {
    fontSize: 20,
    color: theme.colors.text.primary,
  },
  emailSubject: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    flex: 1,
  },
  emailInfo: {
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.ui.divider,
  },
  emailSender: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  emailDate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
  },
  emailContent: {
    flex: 1,
    paddingVertical: theme.spacing.md,
  },
  emailPreview: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
    fontWeight: theme.typography.fontWeight.medium,
  },
  emailBody: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.lineHeight.normal,
  },
  replyContainer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.ui.divider,
    backgroundColor: theme.colors.primary.light,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.subtle,
  },
  replyInput: {
    height: 100,
    backgroundColor: theme.colors.ui.card,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
    textAlignVertical: 'top',
    marginBottom: theme.spacing.md,
  },
  sendButton: {
    backgroundColor: theme.colors.accent.blue,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.primary.medium,
    opacity: 0.7,
  },
  sendButtonText: {
    color: theme.colors.primary.dark,
    fontWeight: theme.typography.fontWeight.bold,
    fontSize: theme.typography.fontSize.md,
  },
});