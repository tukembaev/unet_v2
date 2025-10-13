import React, { useState, useMemo } from 'react';
import { KanbanBoard } from './KanbanBoard';
import { TasksRoot } from '../model/types';
import { mockTasks } from '../model/api/mock';

const filterConfig = [
  { key: 'ALL', label: 'Все', value: 'all' },
  { key: 'ATTACHED', label: 'Прикрепленные', value: 'attached' },
  { key: 'COMPLETED', label: 'Завершенные', value: 'completed' },
  { key: 'DOING', label: 'Выполняю', value: 'doing' },
  { key: 'HELPING', label: 'Помогаю', value: 'helping' },
  { key: 'INSTRUCTED', label: 'Поручил', value: 'instructed' },
  { key: 'WATCHING', label: 'Наблюдаю', value: 'watching' },
];

interface TaskTabsContentProps {
  selectedFilters?: string[];
}

export const TaskTabsContent: React.FC<TaskTabsContentProps> = ({ 
  selectedFilters = ['all'] 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const filteredTasks = useMemo(() => {
    if (selectedFilters.includes('all') || selectedFilters.length === 0) {
      return mockTasks.ALL;
    }

    // Combine tasks from selected filters
    const combinedTasks: TasksRoot[keyof TasksRoot] = {
      OVERDUE: [],
      TODAY: [],
      WEEK: [],
      MONTH: [],
      LONGRANGE: [],
      INDEFINITE: [],
    };

    selectedFilters.forEach(filterValue => {
      const filterKey = filterConfig.find(f => f.value === filterValue)?.key as keyof TasksRoot;
      if (filterKey && mockTasks[filterKey]) {
        const tasks = mockTasks[filterKey];
        Object.keys(combinedTasks).forEach(key => {
          const categoryKey = key as keyof typeof combinedTasks;
          combinedTasks[categoryKey] = [
            ...combinedTasks[categoryKey],
            ...tasks[categoryKey]
          ];
        });
      }
    });

    return combinedTasks;
  }, [selectedFilters]);

  // Simulate loading when filters change
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [selectedFilters]);

  return (
    <div className="space-y-6">
      <KanbanBoard 
        tasks={filteredTasks} 
        isLoading={isLoading}
      />
    </div>
  );
};
