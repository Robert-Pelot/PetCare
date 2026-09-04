import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { reminderTime } from '../domain/pets';

export async function scheduleAppointmentReminder(
  petName: string,
  appointmentTitle: string,
  appointmentDate: Date,
): Promise<string | undefined> {
  const triggerDate = reminderTime(appointmentDate, 30);
  if (triggerDate.getTime() <= Date.now()) return undefined;

  const permission = await Notifications.requestPermissionsAsync();
  if (!permission.granted) return undefined;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('appointments', {
      name: 'Appointment reminders',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      body: `${appointmentTitle} for ${petName} starts in 30 minutes.`,
      sound: true,
      title: 'PetCare reminder',
    },
    trigger: {
      channelId: Platform.OS === 'android' ? 'appointments' : undefined,
      date: triggerDate,
      type: Notifications.SchedulableTriggerInputTypes.DATE,
    },
  });
}

export async function cancelReminder(reminderId?: string): Promise<void> {
  if (reminderId) await Notifications.cancelScheduledNotificationAsync(reminderId);
}
