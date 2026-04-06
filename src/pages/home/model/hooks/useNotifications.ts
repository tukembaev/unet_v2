import { useCallback } from 'react';
import {
  useNotificationsList,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from 'entities/notification';
import type { Notification } from 'entities/notification';

export type { Notification };

export const useNotifications = () => {
  const { data: notifications = [], isLoading } = useNotificationsList();

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
