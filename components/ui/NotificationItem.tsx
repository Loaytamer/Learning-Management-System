import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { BellDot, Mail, BookOpen, AlertCircle } from 'lucide-react-native';
import { Notification } from '../../data/notifications';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
}) => {
  const handleMarkAsRead = () => {
    onMarkAsRead(notification.id);
  };

  const formatTime = (date: Date) => {
    // Format date as relative time (e.g., "2 hours ago")
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMin = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMin / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMin < 60) {
      return `${diffInMin} min ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'announcement':
        return <BellDot size={24} color="#F59E0B" />;
      case 'course_update':
        return <BookOpen size={24} color="#3B82F6" />;
      case 'reminder':
        return <AlertCircle size={24} color="#EF4444" />;
      case 'system':
        return <Mail size={24} color="#10B981" />;
      default:
        return <BellDot size={24} color="#6B7280" />;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        notification.isRead ? styles.readContainer : styles.unreadContainer,
      ]}
      onPress={handleMarkAsRead}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>{getIcon()}</View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {notification.title}
        </Text>
        <Text style={styles.message} numberOfLines={2}>
          {notification.message}
        </Text>
        <Text style={styles.time}>{formatTime(notification.createdAt)}</Text>
      </View>
      {!notification.isRead && <View style={styles.unreadIndicator} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  readContainer: {
    backgroundColor: '#1F2937',
  },
  unreadContainer: {
    backgroundColor: '#18202d',
  },
  iconContainer: {
    marginRight: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F9FAFB',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#D1D5DB',
    marginBottom: 6,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6200EE',
    alignSelf: 'flex-start',
    marginTop: 8,
  },
});

export default NotificationItem;