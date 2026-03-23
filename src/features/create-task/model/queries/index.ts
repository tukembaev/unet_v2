import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask, uploadTaskFile } from '../api';
import { EMPLOYEE_TASKS_QUERY_KEY, TASK_DETAILS_QUERY_KEY } from 'entities/task/model/queries';

export function useCreateTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EMPLOYEE_TASKS_QUERY_KEY]});
      queryClient.invalidateQueries({ queryKey: [TASK_DETAILS_QUERY_KEY] });
    },
  });
}

export function useUploadTaskFile() {
  return useMutation({
    mutationFn: uploadTaskFile,
  });
}
