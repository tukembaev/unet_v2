import React from 'react';
import { TaskCard } from './TaskCard';
import { TaskCategory } from '../model/types';
import { Badge, Card } from 'shared/ui';

interface KanbanBoardProps {
  tasks: TaskCategory;
  isLoading?: boolean;
}

const sectionConfig = [
  { key: 'OVERDUE' as keyof TaskCategory, title: 'Просроченные', color: 'text-red-600' },
  { key: 'TODAY' as keyof TaskCategory, title: 'На сегодня', color: 'text-orange-600' },
  { key: 'WEEK' as keyof TaskCategory, title: 'На этой неделе', color: 'text-blue-600' },
  { key: 'MONTH' as keyof TaskCategory, title: 'На этот месяц', color: 'text-green-600' },
  { key: 'LONGRANGE' as keyof TaskCategory, title: 'Больше этого месяца', color: 'text-purple-600' },
  { key: 'INDEFINITE' as keyof TaskCategory, title: 'Без срока', color: 'text-gray-600' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, isLoading = false }) => {
  if (isLoading) {
    return <KanbanSkeleton />;
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-6 min-w-max">
        {sectionConfig.map((section) => {
          const sectionTasks = tasks[section.key];
          const taskCount = sectionTasks.length;

          return (
            <div key={section.key} className="w-80 flex-shrink-0">
              <div className="space-y-4">
                {/* Section Header */}
                <div className="flex items-center gap-2 px-1">
                  <h2 className={`font-semibold text-base ${section.color}`}>
                    {section.title}
                  </h2>
                  <Badge variant="outline" >
                      {taskCount}
                  </Badge>
          
                </div>

                {/* Tasks List */}
                <div className="space-y-3">
                  {sectionTasks.length > 0 ? (
                    sectionTasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))
                  ) : (
                    <Card className="p-8 border-dashed border-2 border-gray-200">
                      <div className="text-center text-gray-400 text-sm">
                        Нет задач
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Skeleton Loader Component
const KanbanSkeleton: React.FC = () => {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-6 min-w-max">
        {sectionConfig.map((section) => (
          <div key={section.key} className="w-80 flex-shrink-0">
            <div className="space-y-4">
              {/* Section Header Skeleton */}
              <div className="flex items-center justify-between px-1">
                <div className="h-5 bg-gray-200 rounded w-32 animate-pulse"></div>
                <div className="flex items-center gap-2">
                  <div className="h-4 bg-gray-200 rounded w-6 animate-pulse"></div>
                  <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>

              {/* Task Cards Skeleton */}
              <div className="space-y-3">
                {[...Array(3)].map((_, index) => (
                  <Card key={index} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                          <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
                          <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse"></div>
                          <div className="flex gap-2">
                            <div className="h-3 w-3 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-3 w-3 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
