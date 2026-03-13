import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTaskDetails, getEmployeeTasks, getTaskDocuments, addTaskMembers, updateTaskStatus } from '../api';
import type { AddTaskMembersRequest, UpdateTaskStatusRequest } from '../api';

export const TASK_DETAILS_QUERY_KEY = 'task-details';
export const TASK_DOCUMENTS_QUERY_KEY = 'task-documents';
export const EMPLOYEE_TASKS_QUERY_KEY = 'employee-tasks';

export const useTaskDetails = (id: string | undefined) => {
  return useQuery({
    queryKey: [TASK_DETAILS_QUERY_KEY],
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

export const useAddTaskMembers = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: AddTaskMembersRequest }) =>
      addTaskMembers(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_DETAILS_QUERY_KEY] });
    },
  });
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: UpdateTaskStatusRequest }) =>
      updateTaskStatus(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_DETAILS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [EMPLOYEE_TASKS_QUERY_KEY] });
    },
  });
};
