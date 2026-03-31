import { useState } from 'react';
import { FileText, CheckCircle2, AlertCircle, Info, Trash2, Check } from 'lucide-react';
import {
  Button,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsList,
  TabsTrigger,
  Card,
} from 'shared/ui';
import { useNotifications } from 'pages/home/model/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import type { Notification } from 'pages/home/model/hooks/useNotifications';

const notificationIcons = {
  document: FileText,
  task: CheckCircle2,
  alert: AlertCircle,
  info: Info,
};

const notificationColors = {
  document: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30',
  task: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30',
  alert: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30',
  info: 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/30',
};

interface NotificationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NotificationsModal = ({ open, onOpenChange }: NotificationsModalProps) => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } =
    useNotifications();
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const filteredNotifications =
    activeTab === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
      onOpenChange(false);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    clearNotification(id);
  };

  const handleMarkAsRead = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    markAsRead(id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-xl">Уведомления</DialogTitle>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="h-6 px-2">
                  {unreadCount}
                </Badge>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="gap-2"
              >
                <Check className="h-4 w-4" />
                Прочитать все
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Tabs */}
        <div className="px-6 pt-4">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as 'all' | 'unread')}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">Все ({notifications.length})</TabsTrigger>
              <TabsTrigger value="unread">
                Непрочитанные ({unreadCount})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto px-6 py-4 space-y-2" style={{ maxHeight: 'calc(85vh - 180px)' }}>
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">
                {activeTab === 'unread'
                  ? 'Нет непрочитанных уведомлений'
                  : 'Нет уведомлений'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const Icon = notificationIcons[notification.type];
              const colorClass = notificationColors[notification.type];

              return (
                <Card
                  key={notification.id}
                  className={`p-4 transition-all cursor-pointer hover:shadow-md ${
                    !notification.read ? 'border-l-4 border-l-primary' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3
                          className={`text-sm font-medium ${
                            !notification.read ? 'font-semibold' : ''
                          }`}
                        >
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <Badge
                            variant="secondary"
                            className="h-5 px-1.5 text-xs shrink-0"
                          >
                            Новое
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                          locale: ru,
                        })}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-start gap-1 shrink-0">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => handleMarkAsRead(e, notification.id)}
                          title="Отметить как прочитанное"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={(e) => handleDelete(e, notification.id)}
                        title="Удалить"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
