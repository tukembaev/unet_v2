import { useState, useCallback } from 'react';

export interface Notification {
  id: string;
  type: 'document' | 'task' | 'alert' | 'info';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  link?: string;
}

// Mock данные - заменить на реальный API
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'document',
    title: 'Документ согласован',
    message: 'Иванов И.И. согласовал ваше заявление на отпуск',
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: '2',
    type: 'task',
    title: 'Новая задача',
    message: 'Вам назначена задача "Подготовить отчет"',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: '3',
    type: 'alert',
    title: 'Приближается дедлайн',
    message: 'Задача "Согласовать документ" должна быть завершена завтра',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: '4',
    type: 'info',
    title: 'Обновление системы',
    message: 'Система будет обновлена сегодня в 22:00',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: '5',
    type: 'document',
    title: 'Документ отклонен',
    message: 'Петров П.П. отклонил документ "Приказ о зачислении"',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: '6',
    type: 'task',
    title: 'Задача завершена',
    message: 'Сидоров С.С. завершил задачу "Проверка документов"',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: '7',
    type: 'info',
    title: 'Новое сообщение',
    message: 'У вас новое сообщение от администратора',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: '8',
    type: 'alert',
    title: 'Требуется действие',
    message: 'Необходимо подтвердить участие в мероприятии до конца недели',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
];

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
  };
};
