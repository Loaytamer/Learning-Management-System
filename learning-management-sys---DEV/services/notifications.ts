import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Request permissions
export const requestNotificationPermissions = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return true;
};

// Schedule a local notification
export const scheduleLocalNotification = async ({
  title,
  body,
  data = {},
}: {
  title: string;
  body: string;
  data?: Record<string, any>;
}) => {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: null, // Show immediately
    });
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
};
