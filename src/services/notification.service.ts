import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// 1. Global Foreground Handler
// 1. Global Foreground Handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true, // Added: Shows the drop-down banner in foreground
    shouldShowList: true,   // Added: Keeps it in the notification center history
  }),
});

export type PushTokenResult =
  | { status: 'success'; token: string }
  | { status: 'error_simulator' }
  | { status: 'error_permission' }
  | { status: 'error_config' };

export const NotificationService = {
  async registerForPushNotifications(): Promise<PushTokenResult> {
    if (!Device.isDevice) {
      console.log('Must use a physical device for push notifications');
      return { status: 'error_simulator' };
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { granted: existingPermission } = await Notifications.getPermissionsAsync();
    let finalPermission = existingPermission;

    if (!existingPermission) {
      const { granted: newPermission } = await Notifications.requestPermissionsAsync();
      finalPermission = newPermission;
    }

    if (!finalPermission) {
      console.log('Failed to get push token for push notifications!');
      return { status: 'error_permission' };
    }

    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) {
      console.log('Project ID not found in Expo config.');
      return { status: 'error_config' };
    }

    try {
      const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
      return { status: 'success', token: tokenData.data };
    } catch (error) {
      console.error('Error fetching Expo Push Token:', error);
      return { status: 'error_config' };
    }
  },

  async scheduleLocalNotification(title: string, body: string): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
      },
      trigger: null, // null means send immediately
    });
  }
};