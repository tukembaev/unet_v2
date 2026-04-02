import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'shared/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'shared/ui/select';
import { Badge } from 'shared/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from 'shared/ui/avatar';
import { Skeleton } from 'shared/ui/skeleton';
import { Button } from 'shared/ui/button';
import { Download } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { ReportTask, TaskRole, TaskStatus } from '../model/types';

interface TasksTableProps {
  tasks: ReportTask[];
  isLoading: boolean;
  onRoleChange: (role: TaskRole | 'ALL') => void;
  onStatusChange: (status: TaskStatus | 'ALL') => void;
  selectedRole: TaskRole | 'ALL';
  selectedStatus: TaskStatus | 'ALL';
  onDownloadPdf: () => void;
  isDownloading?: boolean;
}

const ROLE_LABELS: Record<TaskRole | 'ALL', string> = {
  ALL: 'Все роли',
  RESPONSIBLE: 'Ответственный',
  EXECUTOR: 'Исполнитель',
  OBSERVER: 'Наблюдатель',
  CREATOR: 'Поручитель',

};

const STATUS_LABELS: Record<TaskStatus | 'ALL', string> = {
  ALL: 'Все статусы',
  PENDING: 'В очереди',
  IN_PROGRESS: 'В работе',
  PAUSED: 'Приостановлено',
  REVIEW: 'На проверке',
  COMPLETED: 'Завершено',
  CANCELED: 'Отменено',
};

const STATUS_COLORS: Record<TaskStatus, string> = {
  PENDING: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  PAUSED: 'bg-yellow-100 text-yellow-800',
  REVIEW: 'bg-purple-100 text-purple-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELED: 'bg-red-100 text-red-800',
};

const PRIORITY_COLORS: Record<string, string> = {
  LOW: 'bg-gray-100 text-gray-800',
  MEDIUM: 'bg-blue-100 text-blue-800',
  HIGH: 'bg-orange-100 text-orange-800',
  CRITICAL: 'bg-red-100 text-red-800',
};

export const TasksTable = ({
  tasks,
  isLoading,
  onRoleChange,
  onStatusChange,
  selectedRole,
  selectedStatus,
  onDownloadPdf,
  isDownloading = false,
}: TasksTableProps) => {
  if (isLoading) {
    return <TasksTableSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* Фильтры */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Select value={selectedRole} onValueChange={onRoleChange}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите роль" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ROLE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите статус" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button 
          onClick={onDownloadPdf} 
          disabled={isDownloading}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          {isDownloading ? 'Загрузка...' : 'Скачать PDF'}
        </Button>
      </div>

      {/* Таблица */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Задача</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Приоритет</TableHead>
              <TableHead>Участники</TableHead>
              <TableHead>Дедлайн</TableHead>
              <TableHead>Создана</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Задачи не найдены
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{task.title}</div>
                      {task.description && (
                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {task.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={STATUS_COLORS[task.status]}>
                      {STATUS_LABELS[task.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={PRIORITY_COLORS[task.priority]}>
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex -space-x-2">
                      {task.members.slice(0, 3).map((member) => (
                        <Avatar key={member.user_id} className="w-8 h-8 border-2 border-background">
                          <AvatarImage src={member.avatar_url} />
                          <AvatarFallback className="text-xs">
                            {member.user_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {task.members.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                          +{task.members.length - 3}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {task.deadline_at ? (
                      <div className="text-sm">
                        {formatDistanceToNow(new Date(task.deadline_at), {
                          addSuffix: true,
                          locale: ru,
                        })}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Не указан</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDistanceToNow(new Date(task.created_at), {
                        addSuffix: true,
                        locale: ru,
                      })}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const TasksTableSkeleton = () => (
  <div className="space-y-4">
    <div className="flex gap-4">
      <Skeleton className="h-10 flex-1" />
      <Skeleton className="h-10 flex-1" />
    </div>
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Задача</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Приоритет</TableHead>
            <TableHead>Участники</TableHead>
            <TableHead>Дедлайн</TableHead>
            <TableHead>Создана</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-16" />
              </TableCell>
              <TableCell>
                <div className="flex -space-x-2">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-8 h-8 rounded-full" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);