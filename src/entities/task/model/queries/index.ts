import { useQuery } from '@tanstack/react-query';
import { getTaskDetails, getEmployeeTasks, getTaskDocuments } from '../api';

export const TASK_DETAILS_QUERY_KEY = 'task-details';
export const TASK_DOCUMENTS_QUERY_KEY = 'task-documents';
export const EMPLOYEE_TASKS_QUERY_KEY = 'employee-tasks';

export const useTaskDetails = (id: string | undefined) => {
  return useQuery({
    queryKey: [TASK_DETAILS_QUERY_KEY, id],
    queryFn: () => getTaskDetails(id!),
    enabled: !!id,
  });
};



export const useEmployeeTasks = () => {
  return useQuery({
    queryKey: [EMPLOYEE_TASKS_QUERY_KEY],
    queryFn: () => getEmployeeTasks(),
    enabled: true,
  });
};


export const useTaskDocuments = (id: string | undefined) => {
  return useQuery({
    queryKey: [TASK_DOCUMENTS_QUERY_KEY, id],
    queryFn: () => getTaskDocuments(id!),
    enabled: !!id,
  }); 
};
