export type {
  Notification,
  WsNotification,
  NotificationType,
  NotificationExtraData,
  NotificationIconType,
} from './model/types';

export { getNotificationIconType } from './model/types';

export {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from './model/api';

export {
  NOTIFICATIONS_QUERY_KEY,
  useNotificationsList,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from './model/queries';

export { useNotificationWebSocket } from './model/hooks/useNotificationWebSocket';
