import { apiNotificationClient } from 'shared/config/notification_axios';
import type { Notification } from '../types';

export const getNotifications = async (read?: boolean): Promise<Notification[]> => {
  const params = read !== undefined ? { read } : {};
  const { data } = await apiNotificationClient.get('notifications', { params });
  return data;
};

export const markNotificationAsRead = async (id: string): Promise<void> => {
  await apiNotificationClient.patch(`notifications/${id}/read`);
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  await apiNotificationClient.patch('notifications/read-all');
};
