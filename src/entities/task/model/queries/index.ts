import { useQuery } from '@tanstack/react-query';
import { getTaskDetails, getEmployeeTasks } from '../api';

export const TASK_DETAILS_QUERY_KEY = 'task-details';
export const EMPLOYEE_TASKS_QUERY_KEY = 'employee-tasks';

export const useTaskDetails = (id: number | undefined) => {
  return useQuery({
    queryKey: [TASK_DETAILS_QUERY_KEY, id],
    queryFn: () => getTaskDetails(id!),
    enabled: !!id,
  });
};

export const useEmployeeTasks = (userId: number | undefined) => {
  return useQuery({
    queryKey: [EMPLOYEE_TASKS_QUERY_KEY, userId],
    queryFn: () => getEmployeeTasks(userId!),
    enabled: !!userId,
  });
};

