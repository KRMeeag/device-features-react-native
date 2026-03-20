import { useState, useEffect, useCallback } from 'react';
import { AppState } from 'react-native';
import { NotificationService } from '../services/notification.service';

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState(false);
  const [isSimulator, setIsSimulator] = useState(false);

  const register = useCallback(async () => {
    // Reset states before re-evaluating
    setPermissionError(false);

    const result = await NotificationService.registerForPushNotifications();

    if (result.status === 'success') {
      setExpoPushToken(result.token);
    } else if (result.status === 'error_permission') {
      setPermissionError(true);
      setExpoPushToken(null);
    } else if (result.status === 'error_simulator') {
      setIsSimulator(true);
    } else if (result.status === 'error_config') {
      setExpoPushToken(null);
    }
  }, []);

  useEffect(() => {
    // Initial check on mount
    register();

    // Re-check automatically when returning from device settings
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        register();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [register]);

  const sendNotification = async (title: string, body: string) => {
    await NotificationService.scheduleLocalNotification(title, body);
  };

  return { expoPushToken, permissionError, isSimulator, sendNotification };
};