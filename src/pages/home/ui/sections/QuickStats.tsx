import { Card, CardContent, Skeleton } from 'shared/ui';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useWelcomeStats } from '../../model/hooks/useWelcomeStats';

export const QuickStats = () => {
  const { stats, isLoading } = useWelcomeStats();

  const statItems = [
    {
      label: 'Активные задачи',
      value: stats.activeTasks,
      change: '+12%',
      trend: 'up' as const,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: 'На согласовании',
      value: stats.pendingDocuments,
      change: '-5%',
      trend: 'down' as const,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-500/10',
    },
    {
      label: 'Завершено',
      value: stats.completedTasks,
      change: '0%',
      trend: 'neutral' as const,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-500/10',
    },
  ];

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <Skeleton className="h-6 w-24 mb-4" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-sm font-semibold mb-4">Статистика</h3>
        <div className="space-y-4">
          {statItems.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{item.label}</span>
                <div className="flex items-center gap-1 text-xs">
                  {item.trend === 'up' && (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  )}
                  {item.trend === 'down' && (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  {item.trend === 'neutral' && (
                    <Minus className="h-3 w-3 text-muted-foreground" />
                  )}
                  <span
                    className={
                      item.trend === 'up'
                        ? 'text-green-600 dark:text-green-400'
                        : item.trend === 'down'
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-muted-foreground'
                    }
                  >
                    {item.change}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${item.bgColor}`}>
                  <div className={`text-2xl font-bold ${item.color}`}>
                    {item.value}
                  </div>
                </div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.bgColor.replace('/10', '/50')}`}
                    style={{ width: `${Math.min((item.value / 20) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
