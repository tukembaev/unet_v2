import { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from 'shared/ui';
import UserTooltip from 'entities/user/ui/UserTooltip';
import type { UserTaskStats } from '../model';

interface TaskUsersTableProps {
  users: UserTaskStats[];
  isLoading?: boolean;
}

type SortField = 'user_name' | 'total_assigned' | 'completed' | 'avg_completion_time';
type SortOrder = 'asc' | 'desc';

export function TaskUsersTable({ users, isLoading }: TaskUsersTableProps) {
  const [sortField, setSortField] = useState<SortField>('total_assigned');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    const multiplier = sortOrder === 'asc' ? 1 : -1;
    
    if (sortField === 'user_name') {
      return multiplier * a.user_name.localeCompare(b.user_name);
    }
    
    const aValue = a[sortField] ?? 0;
    const bValue = b[sortField] ?? 0;
    return multiplier * (aValue - bValue);
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Отчет по исполнителям задач</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Отчет по исполнителям задач</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('user_name')}
                    className="h-8 px-2"
                  >
                    Исполнитель
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('total_assigned')}
                    className="h-8 px-2"
                  >
                    Назначено
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('completed')}
                    className="h-8 px-2"
                  >
                    Выполнено
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-center">В работе</TableHead>
                <TableHead className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('avg_completion_time')}
                    className="h-8 px-2"
                  >
                    Среднее время
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Прогресс</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.map((user) => {
                const completionPercent = user.total_assigned > 0
                  ? (user.completed / user.total_assigned) * 100
                  : 0;

                return (
                  <TableRow key={user.user_id}>
                    <TableCell className="font-medium">
                      <UserTooltip userId={user.user_id}>
                        <div className="flex items-center gap-3 cursor-pointer">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar_url || undefined} alt={user.user_name} />
                            <AvatarFallback className="text-xs">
                              {getInitials(user.user_name)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{user.user_name}</span>
                        </div>
                      </UserTooltip>
                    </TableCell>
                    <TableCell className="text-center">{user.total_assigned}</TableCell>
                    <TableCell className="text-center">{user.completed}</TableCell>
                    <TableCell className="text-center">{user.in_progress}</TableCell>
                    <TableCell className="text-center">
                      {(user.avg_completion_time ?? 0).toFixed(1)}ч
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-2 bg-muted rounded-full overflow-hidden flex-1">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${completionPercent}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground min-w-[45px]">
                          {completionPercent.toFixed(0)}%
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
