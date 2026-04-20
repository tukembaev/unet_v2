import React, { useMemo } from 'react';
import { useEmployeeTasks } from '../model/queries';
import { EmployeeTask, TaskCategory } from '../model/types';
import { KanbanBoard } from './KanbanBoard';
import { TaskFilters } from './TaskFilter';

interface TaskTabsContentProps {
  selectedFilters?: TaskFilters;
  searchQuery?: string;
}

const emptyTaskCategory = (): TaskCategory => {
  return {
    PENDING: [],
    IN_PROGRESS: [],
    REVIEW: [],
    COMPLETED: [],
    CANCELED: [],
  };
};

const distributeTasksByStatus = (tasks: EmployeeTask[]): TaskCategory => {
  const result = emptyTaskCategory();

  tasks.forEach((task) => {
    switch (task.status) {
      case 'PENDING':
        result.PENDING.push(task);
        break;
      case 'IN_PROGRESS':
        result.IN_PROGRESS.push(task);
        break;
      case 'REVIEW':
        result.REVIEW.push(task);
        break;
      case 'COMPLETED':
        result.COMPLETED.push(task);
        break;
      case 'CANCELED':
        result.CANCELED.push(task);
        break;
      default:
        // Если статус неизвестен, помещаем в PENDING
        result.PENDING.push(task);
        break;
    }
  });

  return result;
};

const TaskTabsContentComponent: React.FC<TaskTabsContentProps> = ({ 
  selectedFilters,
  searchQuery = '',
}) => {

  const { data: tasksData, isLoading } = useEmployeeTasks();

  const filteredTasks = useMemo(() => {
    if (!tasksData) {
      return emptyTaskCategory();
    }

    return distributeTasksByStatus(tasksData);
  }, [tasksData]);

  return (
    <div className="space-y-6">
      <KanbanBoard 
        tasks={filteredTasks} 
        isLoading={isLoading}
        filters={selectedFilters}
        searchQuery={searchQuery}
      />
    </div>
  );
};

export const TaskTabsContent = React.memo(TaskTabsContentComponent);
