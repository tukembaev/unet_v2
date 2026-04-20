import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Card } from 'shared/ui';

import { EmployeeTask } from '../model/types';
import { Calendar, MoreHorizontal } from 'lucide-react';
import { AvatarGroup } from 'shared/components/avatar/avatar-group';

export type TaskRole = 'RESPONSIBLE' | 'EXECUTOR' | 'OBSERVER' | 'CREATOR';

interface TaskCardProps {
  task: EmployeeTask;
  currentUserId?: string;
}

const TaskCardComponent: React.FC<TaskCardProps> = ({ task, currentUserId }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate('/task-details', { state: { taskId: task.id } });
  };

  // Определяем роль текущего пользователя в задаче
  const getUserRole = (): TaskRole | null => {
    if (!currentUserId) return null;

    // Проверяем, является ли пользователь ответственным
    if (task.responsible_user_id === currentUserId) {
      return 'RESPONSIBLE';
    }

    // Проверяем роль в members
    const member = task.members?.find(m => m.user_id === currentUserId);
    if (member) {
      if (member.role === 'CO_EXECUTOR') return 'EXECUTOR';
      if (member.role === 'OBSERVER') return 'OBSERVER';
      if (member.role === 'RESPONSIBLE') return 'RESPONSIBLE';
    }

    // Если пользователь не найден ни как ответственный, ни в members - он создатель
    return 'CREATOR';
  };

  const userRole = getUserRole();

  // Определяем цвет обводки в зависимости от роли
  const getBorderColor = (): string => {
    if (!userRole) return '';
    
    switch (userRole) {
      case 'CREATOR':
        return 'border-l-2 border-l-purple-500 dark:border-l-purple-400';
      case 'RESPONSIBLE':
        return 'border-l-2 border-l-blue-500 dark:border-l-blue-400';
      case 'EXECUTOR':
        return 'border-l-2 border-l-green-500 dark:border-l-green-400';
      case 'OBSERVER':
        return 'border-l-2 border-l-yellow-500 dark:border-l-yellow-400';
      default:
        return '';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Без срока';
    
    // Parse date string like "12.10.2025 12:00" and format as "12 окт 25"
    try {
      const isoDate = new Date(dateString);
      if (!Number.isNaN(isoDate.getTime())) {
        return new Intl.DateTimeFormat('ru-RU', {
          day: '2-digit',
          month: 'short',
          year: '2-digit',
        })
          .format(isoDate)
          .replace(/\./g, '');
      }

      const [datePart] = dateString.split(' ');
      const [day, month, year] = datePart.split('.');
      const monthNames = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
      const monthName = monthNames[parseInt(month) - 1];
      const shortYear = year.slice(-2);
      return `${day} ${monthName} ${shortYear}`;
    } catch {
      return dateString;
    }
  };

  const borderColor = getBorderColor();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card 
        className={`p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer group ${borderColor}`}
        onClick={handleCardClick}
      >
        <div className="space-y-3">
          {/* Header with title and menu */}
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-sm text-foreground line-clamp-2 flex-1 pr-2">
              {task.title}
            </h3>
            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded">
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>

          {/* Separator */}
          <div className="border-t border-border"></div>

          {/* Bottom section */}
          <div className="space-y-3">
            {/* Members */}
       
              {/* Creation and Deadline */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <AvatarGroup members={task.members} max={2} />

                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {formatDate(task.created_at)}
                    {task.deadline_at && ` - ${formatDate(task.deadline_at)}`}
                  </span>
                </div>
              </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export const TaskCard = React.memo(TaskCardComponent);
