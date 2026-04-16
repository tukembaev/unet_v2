import { useCallback } from 'react';
import {
  useNotificationsList,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from 'entities/notification';
import type { Notification } from 'entities/notification';

export type { Notification };

const EMPTY_NOTIFICATIONS: Notification[] = [];

export const useNotifications = () => {
  const { data: notificationsData, isLoading } = useNotificationsList();
  const notifications = notificationsData ?? EMPTY_NOTIFICATIONS;

  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAsRead = useCallback(
    (id: string) => {
      markAsReadMutation.mutate(id);
    },
    [markAsReadMutation],
  );

  const markAllAsRead = useCallback(() => {
    markAllAsReadMutation.mutate();
  }, [markAllAsReadMutation]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    isLoading,
  };
};
