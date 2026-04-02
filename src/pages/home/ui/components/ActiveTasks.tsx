import { Card, CardContent, Badge, Skeleton, Avatar, AvatarFallback, AvatarImage } from 'shared/ui';
import { ListTodo, ArrowRight, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useActiveTasks } from '../../model/hooks/useActiveTasks';

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  IN_PROGRESS: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  REVIEW: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
};

const statusLabels: Record<string, string> = {
  PENDING: 'Ожидает',
  IN_PROGRESS: 'В работе',
  REVIEW: 'На проверке',
};

export const ActiveTasks = () => {
  const navigate = useNavigate();
  const { tasks, isLoading } = useActiveTasks();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <ListTodo className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            Нет активных задач
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.slice(0, 5).map((task) => (
        <Card
          key={task.id}
          className="hover:shadow-md transition-all duration-200 cursor-pointer"
          onClick={() => navigate('/task-details', { state: { taskId: task.id } })}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="p-2 rounded-lg bg-blue-500/10 shrink-0">
                  <ListTodo className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      variant="outline"
                      className={statusColors[task.status] || ''}
                    >
                      {statusLabels[task.status] || task.status}
                    </Badge>
                    {task.deadline_at && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(task.deadline_at).toLocaleDateString('ru-RU')}
                      </div>
                    )}
                  </div>
                  {task.members && task.members.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex -space-x-2">
                        {task.members.slice(0, 3).map((member, idx) => (
                          <Avatar key={idx} className="h-6 w-6 border-2 border-background">
                            <AvatarImage src={member.avatar_url} />
                            <AvatarFallback className="text-xs">
                              {member.user_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      {task.members.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{task.members.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
