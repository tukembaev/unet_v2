import { useQuery } from '@tanstack/react-query';
import { apiClientGo } from 'shared/config';
import { EmployeeTask } from 'entities/task/model/types';

export const useActiveTasks = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['employee-tasks'],
    queryFn: async () => {
      const { data } = await apiClientGo.get('tasks/employee');
      return data;
    },
  });

  const tasks: EmployeeTask[] = [];

  if (data?.DOING) {
    // Собираем задачи в работе и на проверке
    if (data.DOING.IN_PROGRESS) {
      tasks.push(...data.DOING.IN_PROGRESS);
    }
    if (data.DOING.REVIEW) {
      tasks.push(...data.DOING.REVIEW);
    }
    if (data.DOING.PENDING) {
      tasks.push(...data.DOING.PENDING);
    }
  }

  // Сортируем по дедлайну
  tasks.sort((a, b) => {
    if (!a.deadline_at) return 1;
    if (!b.deadline_at) return -1;
    return new Date(a.deadline_at).getTime() - new Date(b.deadline_at).getTime();
  });

  return {
    tasks,
    isLoading,
  };
};
