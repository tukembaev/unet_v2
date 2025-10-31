import React, { useMemo } from 'react';
import { KanbanBoard } from './KanbanBoard';
import { TaskCategory, EmployeeTasksResponse, Task } from '../model/types';
import { useEmployeeTasks } from '../model/queries';
import { useAuthUser } from 'features/auth/model/queries';

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

// Helper function to convert Task[] to TaskCategory
const tasksArrayToCategory = (tasks: Task[]): TaskCategory => {
  return {
    OVERDUE: [],
    TODAY: [],
    WEEK: [],
    MONTH: [],
    LONGRANGE: [],
    INDEFINITE: [],
  };
};

// Helper function to get tasks from a filter key
const getTasksFromFilter = (
  tasksData: EmployeeTasksResponse | undefined,
  filterKey: keyof EmployeeTasksResponse
): TaskCategory => {
  if (!tasksData || !tasksData[filterKey]) {
    return tasksArrayToCategory([]);
  }

  const tasks = tasksData[filterKey];
  
  // If it's an array (COMPLETED or ATTACHED), convert to TaskCategory
  if (Array.isArray(tasks)) {
    // For arrays, we need to distribute them - for now, put all in INDEFINITE
    // or you could add logic to categorize them based on deadline_date
    return {
      OVERDUE: [],
      TODAY: [],
      WEEK: [],
      MONTH: [],
      LONGRANGE: [],
      INDEFINITE: tasks,
    };
  }

  // If it's already a TaskCategory, return it
  return tasks;
};

export const TaskTabsContent: React.FC<TaskTabsContentProps> = ({ 
  selectedFilters = ['all'] 
}) => {
  const { data: user } = useAuthUser();
  console.log(user)
  const { data: tasksData, isLoading } = useEmployeeTasks(69298);

  const filteredTasks = useMemo(() => {
    if (!tasksData) {
      return tasksArrayToCategory([]);
    }

    // If 'all' is selected or no filters, return ALL tasks
    if (selectedFilters.includes('all') || selectedFilters.length === 0) {
      return tasksData.ALL;
    }

    // Combine tasks from selected filters
    const combinedTasks: TaskCategory = {
      OVERDUE: [],
      TODAY: [],
      WEEK: [],
      MONTH: [],
      LONGRANGE: [],
      INDEFINITE: [],
    };

    selectedFilters.forEach(filterValue => {
      const filterKey = filterConfig.find(f => f.value === filterValue)?.key as keyof EmployeeTasksResponse;
      
      if (filterKey && tasksData[filterKey]) {
        const tasks = getTasksFromFilter(tasksData, filterKey);
        
        // Combine tasks from each category
        Object.keys(combinedTasks).forEach(key => {
          const categoryKey = key as keyof TaskCategory;
          combinedTasks[categoryKey] = [
            ...combinedTasks[categoryKey],
            ...tasks[categoryKey]
          ];
        });
      }
    });

    return combinedTasks;
  }, [tasksData, selectedFilters]);

  return (
    <div className="space-y-6">
      <KanbanBoard 
        tasks={filteredTasks} 
        isLoading={isLoading}
      />
    </div>
  );
};
