import type { Notification } from 'entities/notification';
import { AlertCircle, Check, FileText, Info, ListTodo } from 'lucide-react';
import { useNotifications } from 'pages/home/model/hooks/useNotifications';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Tabs,
  TabsList,
  TabsTrigger,
} from 'shared/ui';


const getNotificationIcon = (notification: Notification) => {
  const isTask = notification.source_service === 'tasks';
  const isDocument = notification.source_service === 'documentflow';
  
  if (isTask) return ListTodo;
  if (isDocument) return FileText;
  return Info;
};

const getIconColor = (notification: Notification): string => {
  const isTask = notification.source_service === 'tasks';
  const isDocument = notification.source_service === 'documentflow';
  
  if (isTask) return 'text-blue-500 bg-blue-50 dark:bg-blue-950/30';
  if (isDocument) return 'text-purple-500 bg-purple-50 dark:bg-purple-950/30';
  return 'text-gray-500 bg-gray-50 dark:bg-gray-950/30';
};

const getBorderColor = (notification: Notification): string => {
  const isTask = notification.source_service === 'tasks';
  const isDocument = notification.source_service === 'documentflow';
  
  if (isTask) return 'border-l-blue-500';
  if (isDocument) return 'border-l-purple-500';
  return 'border-l-gray-500';
};

interface NotificationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NotificationsModal = ({ open, onOpenChange }: NotificationsModalProps) => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  const filteredNotifications =
    activeTab === 'unread' ? notifications.filter((n) => !n.is_read) : notifications;

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }

    const isTask = notification.source_service === 'tasks';
    const isDocument = notification.source_service === 'documentflow';

    if (isTask && notification.extra_data?.task_id) {
      onOpenChange(false);
      navigate('/task-details', { state: { taskId: notification.extra_data.task_id } });
    } else if (isDocument && notification.extra_data?.link) {
      onOpenChange(false);
      navigate(notification.extra_data.link);
    }
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
              const Icon = getNotificationIcon(notification);
              const iconColor = getIconColor(notification);
              const borderColor = getBorderColor(notification);
              
              const isTask = notification.source_service === 'tasks';
              const isDocument = notification.source_service === 'documentflow';
              const isClickable = (isTask && notification.extra_data?.task_id) || 
                                 (isDocument && notification.extra_data?.link);

              return (
                <Card
                  key={notification.id}
                  className={`p-4 transition-all border-l-4 ${borderColor} ${
                    isClickable ? 'cursor-pointer hover:shadow-md' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex gap-3">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${iconColor}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3
                          className={`text-sm font-medium ${
                            !notification.is_read ? 'font-semibold' : ''
                          }`}
                        >
                          {notification.title}
                        </h3>
                        {!notification.is_read && (
                          <Badge
                            variant="secondary"
                            className="h-5 px-1.5 text-xs shrink-0"
                          >
                            Новое
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {notification.body}
                      </p>
                      {notification.sender_name && (
                        <p className="text-xs text-muted-foreground/70 mb-1">
                          от {notification.sender_name}
                        </p>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {notification.created_at}
                      </span>
                    </div>

                    <div className="flex items-start gap-1 shrink-0">
                      {!notification.is_read && (
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
