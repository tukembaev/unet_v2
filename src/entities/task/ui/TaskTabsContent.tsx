import React, { useMemo } from 'react';
import { useEmployeeTasks } from '../model/queries';
import { EmployeeTask } from '../model/types';
import { KanbanBoard } from './KanbanBoard';

interface TaskTabsContentProps {
  selectedFilters?: string[];
}

type EmployeeTaskCategory = {
  OVERDUE: EmployeeTask[];
  TODAY: EmployeeTask[];
  WEEK: EmployeeTask[];
  MONTH: EmployeeTask[];
  LONGRANGE: EmployeeTask[];
  INDEFINITE: EmployeeTask[];
};

const emptyEmployeeTaskCategory = (): EmployeeTaskCategory => {
  return {
    OVERDUE: [],
    TODAY: [],
    WEEK: [],
    MONTH: [],
    LONGRANGE: [],
    INDEFINITE: [],
  };
};

const distributeEmployeeTasksByDeadline = (tasks: EmployeeTask[]): EmployeeTaskCategory => {
  const result = emptyEmployeeTaskCategory();

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  const endOfWeek = new Date(endOfToday);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  const endOfMonth = new Date(endOfToday);
  endOfMonth.setDate(endOfMonth.getDate() + 30);

  tasks.forEach((task) => {
    if (!task.deadline_at) {
      result.INDEFINITE.push(task);
      return;
    }

    const deadline = new Date(task.deadline_at);
    if (Number.isNaN(deadline.getTime())) {
      result.INDEFINITE.push(task);
      return;
    }

    if (deadline < startOfToday) {
      result.OVERDUE.push(task);
      return;
    }

    if (deadline >= startOfToday && deadline <= endOfToday) {
      result.TODAY.push(task);
      return;
    }

    if (deadline > endOfToday && deadline <= endOfWeek) {
      result.WEEK.push(task);
      return;
    }

    if (deadline > endOfWeek && deadline <= endOfMonth) {
      result.MONTH.push(task);
      return;
    }

    result.LONGRANGE.push(task);
  });

  return result;
};

const TaskTabsContentComponent: React.FC<TaskTabsContentProps> = ({ 
  selectedFilters = ['all'] 
}) => {

  const { data: tasksData, isLoading } = useEmployeeTasks();
  console.log(tasksData)
  const filteredTasks = useMemo(() => {
    if (!tasksData) {
      return emptyEmployeeTaskCategory();
    }

    void selectedFilters;
    return distributeEmployeeTasksByDeadline(tasksData);
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

export const TaskTabsContent = React.memo(TaskTabsContentComponent);
