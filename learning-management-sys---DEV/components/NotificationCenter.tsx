import React from 'react';
import { View, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useNotifications } from '../contexts/NotificationContext';

export const NotificationCenter: React.FC = () => {
  const { notifications, markAsRead, clearNotifications } = useNotifications();
  const [fadeAnim] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (notifications.length > 0) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (notifications.length > 0) {
          markAsRead(notifications[0].id);
        }
      });
    }
  }, [notifications]);

  if (notifications.length === 0) return null;

  const latestNotification = notifications[0];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.notification,
          {
            backgroundColor:
              latestNotification.type === 'success'
                ? '#4CAF50'
                : latestNotification.type === 'error'
                ? '#F44336'
                : '#2196F3',
          },
        ]}
        onPress={() => markAsRead(latestNotification.id)}
      >
        <Text style={styles.title}>{latestNotification.title}</Text>
        <Text style={styles.message}>{latestNotification.message}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  notification: {
    padding: 16,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  message: {
    color: 'white',
    fontSize: 14,
  },
});
