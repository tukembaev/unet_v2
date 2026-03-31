import { Card, CardContent, Avatar, AvatarFallback, AvatarImage, Badge } from 'shared/ui';
import { FileText, CheckCircle2, Clock, MessageSquare } from 'lucide-react';

interface Activity {
  id: string;
  type: 'document' | 'task' | 'comment';
  user: string;
  avatar?: string;
  action: string;
  target: string;
  time: string;
  status?: string;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'document',
    user: 'Иванов И.И.',
    action: 'согласовал',
    target: 'Заявление на отпуск',
    time: '5 мин назад',
    status: 'approved',
  },
  {
    id: '2',
    type: 'task',
    user: 'Петрова А.С.',
    action: 'завершила',
    target: 'Подготовка отчета',
    time: '1 час назад',
    status: 'completed',
  },
  {
    id: '3',
    type: 'comment',
    user: 'Сидоров П.П.',
    action: 'оставил комментарий к',
    target: 'Приказ о зачислении',
    time: '2 часа назад',
  },
  {
    id: '4',
    type: 'document',
    user: 'Козлова М.В.',
    action: 'отправила на согласование',
    target: 'Отчет о проделанной работе',
    time: '3 часа назад',
  },
];

const activityIcons = {
  document: FileText,
  task: CheckCircle2,
  comment: MessageSquare,
};

const activityColors = {
  document: 'text-yellow-600 dark:text-yellow-400 bg-yellow-500/10',
  task: 'text-green-600 dark:text-green-400 bg-green-500/10',
  comment: 'text-blue-600 dark:text-blue-400 bg-blue-500/10',
};

export const ActivityFeed = () => {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Последняя активность</h3>
          <Badge variant="outline" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Сегодня
          </Badge>
        </div>

        <div className="space-y-4">
          {mockActivities.map((activity) => {
            const Icon = activityIcons[activity.type];
            const colorClass = activityColors[activity.type];

            return (
              <div key={activity.id} className="flex gap-3">
                {/* Avatar */}
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={activity.avatar} />
                  <AvatarFallback className="text-xs">
                    {activity.user.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-1">
                    <div className={`p-1 rounded ${colorClass}`}>
                      <Icon className="h-3 w-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs leading-relaxed">
                        <span className="font-medium">{activity.user}</span>{' '}
                        <span className="text-muted-foreground">{activity.action}</span>{' '}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t">
          <button className="text-xs text-muted-foreground hover:text-foreground transition-colors w-full text-center">
            Показать всю активность
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
