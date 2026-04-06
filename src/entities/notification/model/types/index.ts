export type NotificationType = 'GENERAL' | 'TASK' | 'DOCUMENT' | 'ALERT' | 'INFO';

export interface NotificationExtraData {
  [key: string]: string;
}

/** GET /notifications response item */
export interface Notification {
  id: string;
  event_id: string | null;
  user_id: string;
  source_service: string | null;
  event_type: string | null;
  type: NotificationType;
  title: string;
  body: string;
  extra_data: NotificationExtraData;
  is_read: boolean;
  sender_id: string;
  sender_name: string;
  created_at: string;
}

/** WebSocket incoming message (no user_id, no is_read, ISO created_at) */
export interface WsNotification {
  id: string;
  event_id: string | null;
  title: string;
  body: string;
  type: NotificationType;
  extra_data: NotificationExtraData;
  sender_id: string;
  sender_name: string;
  source_service: string;
  event_type: string;
  created_at: string;
}

export type NotificationIconType = 'document' | 'task' | 'alert' | 'info';

const typeMap: Record<NotificationType, NotificationIconType> = {
  GENERAL: 'info',
  TASK: 'task',
  DOCUMENT: 'document',
  ALERT: 'alert',
  INFO: 'info',
};

export function getNotificationIconType(type: NotificationType): NotificationIconType {
  return typeMap[type] ?? 'info';
}
