import { useState } from 'react';
import { Bell, FileText, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Button, Badge, Popover, PopoverContent, PopoverTrigger } from 'shared/ui';
import { useNotifications } from 'pages/home/model/hooks/useNotifications';
import type { Notification, NotificationIconType } from 'entities/notification';
import { getNotificationIconType } from 'entities/notification';
import { NotificationsModal } from './NotificationsModal';

const notificationIcons: Record<NotificationIconType, typeof Info> = {
  document: FileText,
  task: CheckCircle2,
  alert: AlertCircle,
  info: Info,
};

const notificationColors: Record<NotificationIconType, string> = {
  document: 'text-yellow-600 dark:text-yellow-400',
  task: 'text-blue-600 dark:text-blue-400',
  alert: 'text-red-600 dark:text-red-400',
  info: 'text-gray-600 dark:text-gray-400',
};

export const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const unreadNotifications = notifications.filter((n) => !n.is_read).slice(0, 5);

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Уведомления"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[320px] p-0"
        align="end"
        sideOffset={8}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold text-sm">Уведомления</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setOpen(false);
              setModalOpen(true);
            }}
            className="text-xs h-6 px-2"
          >
            Показать все
          </Button>
        </div>

        <div className="max-h-[360px] overflow-y-auto">
          {unreadNotifications.length === 0 ? (
            <div className="py-8 text-center px-4">
              <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-xs text-muted-foreground">
                Нет новых уведомлений
              </p>
            </div>
          ) : (
            <div>
              {unreadNotifications.map((notification) => {
                const iconType = getNotificationIconType(notification.type);
                const Icon = notificationIcons[iconType];
                const colorClass = notificationColors[iconType];

                return (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className="px-4 py-3 hover:bg-accent/50 transition-colors cursor-pointer border-b last:border-b-0"
                  >
                    <div className="flex gap-2.5">
                      <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${colorClass}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium leading-tight mb-0.5">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
                          {notification.body}
                        </p>
                        {notification.sender_name && (
                          <p className="text-xs text-muted-foreground/70 mt-0.5">
                            от {notification.sender_name}
                          </p>
                        )}
                        <span className="text-xs text-muted-foreground mt-1 inline-block">
                          {notification.created_at}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {unreadCount > 0 && (
          <div className="p-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs h-8"
              onClick={markAllAsRead}
            >
              Прочитать все
            </Button>
          </div>
        )}
      </PopoverContent>

      <NotificationsModal open={modalOpen} onOpenChange={setModalOpen} />
    </Popover>
  );
};
