import { FileText, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Button } from 'shared/ui';
import type { Notification, NotificationIconType } from 'entities/notification';
import { getNotificationIconType } from 'entities/notification';

const notificationIcons: Record<NotificationIconType, typeof Info> = {
  document: FileText,
  task: CheckCircle2,
  alert: AlertCircle,
  info: Info,
};

const notificationColors: Record<NotificationIconType, string> = {
  document: 'text-yellow-600 dark:text-yellow-400 bg-yellow-500/10',
  task: 'text-blue-600 dark:text-blue-400 bg-blue-500/10',
  alert: 'text-red-600 dark:text-red-400 bg-red-500/10',
  info: 'text-gray-600 dark:text-gray-400 bg-gray-500/10',
};

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onClick?: (notification: Notification) => void;
  compact?: boolean;
}

export const NotificationItem = ({
  notification,
  onMarkAsRead,
  onClick,
  compact = false,
}: NotificationItemProps) => {
  const iconType = getNotificationIconType(notification.type);
  const Icon = notificationIcons[iconType];
  const colorClass = notificationColors[iconType];

  return (
    <div
      onClick={() => onClick?.(notification)}
      className={`group relative rounded-lg border transition-all ${
        onClick ? 'cursor-pointer' : ''
      } ${
        notification.is_read
          ? 'bg-card hover:bg-accent/30'
          : 'bg-primary/5 border-primary/20 hover:bg-primary/10'
      } ${compact ? 'p-3' : 'p-4'}`}
    >
      <div className="flex gap-3">
        <div className={`p-${compact ? '1.5' : '2'} rounded-lg ${colorClass} shrink-0 h-fit`}>
          <Icon className={`h-${compact ? '3.5' : '4'} w-${compact ? '3.5' : '4'}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className={`${compact ? 'text-xs' : 'text-sm'} font-medium leading-tight`}>
              {notification.title}
            </p>
            {!notification.is_read && (
              <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
            )}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-1">
            {notification.body}
          </p>
          {notification.sender_name && (
            <p className="text-xs text-muted-foreground/70 mb-1">
              от {notification.sender_name}
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {notification.created_at}
            </span>
            {!notification.is_read && onMarkAsRead && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead(notification.id);
                }}
                className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Прочитать
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
