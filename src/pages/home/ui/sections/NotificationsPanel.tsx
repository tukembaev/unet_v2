import { Card, CardContent, Button } from 'shared/ui';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../model/hooks/useNotifications';
import { NotificationItem } from '../components/NotificationItem';

export const NotificationsPanel = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  
  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Уведомления</h3>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs h-6 px-2"
            >
              Прочитать все
            </Button>
          )}
        </div>

        {/* Notifications List */}
        {unreadNotifications.length === 0 ? (
          <div className="py-6 text-center">
            <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-xs text-muted-foreground">
              Нет новых уведомлений
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {unreadNotifications.slice(0, 3).map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                compact
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
