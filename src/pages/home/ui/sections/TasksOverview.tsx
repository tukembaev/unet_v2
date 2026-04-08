import { ArrowRight, Calendar, Circle, ListTodo } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, Skeleton } from 'shared/ui';
import { useActiveTasks } from '../../model/hooks/useActiveTasks';

const statusConfig: Record<string, { label: string; color: string; dotColor: string }> = {
  PENDING: { label: 'Ожидает', color: 'text-yellow-600 dark:text-yellow-400', dotColor: 'bg-yellow-500' },
  IN_PROGRESS: { label: 'В работе', color: 'text-blue-600 dark:text-blue-400', dotColor: 'bg-blue-500' },
  REVIEW: { label: 'На проверке', color: 'text-purple-600 dark:text-purple-400', dotColor: 'bg-purple-500' },
};

export const TasksOverview = () => {
  const navigate = useNavigate();
  const { tasks, isLoading } = useActiveTasks();

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="space-y-3">
            <Skeleton className="h-6 w-32" />
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ListTodo className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-sm font-semibold">Мои задачи</h2>
            <span className="text-xs text-muted-foreground">
              {tasks.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
          
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/task')}
              className="h-7 px-2 text-xs"
            >
              Все
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>

        {/* Tasks List */}
        {tasks.length === 0 ? (
          <div className="py-8 text-center">
            <ListTodo className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-xs text-muted-foreground">
              Нет активных задач
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                onClick={() => navigate('/task-details', { state: { taskId: task.id } })}
                className="group relative p-3 rounded-lg border bg-card hover:bg-accent/50 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-2">
                  <Circle className={`h-2 w-2 mt-1.5 ${statusConfig[task.status]?.dotColor || 'bg-gray-500'} rounded-full shrink-0`} fill="currentColor" />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-xs leading-tight group-hover:text-primary transition-colors mb-1">
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className={statusConfig[task.status]?.color}>
                        {statusConfig[task.status]?.label || task.status}
                      </span>
                      {task.deadline_at && (
                        <>
                          <span>•</span>
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(task.deadline_at).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
