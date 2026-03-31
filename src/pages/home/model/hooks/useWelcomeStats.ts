import { useQuery } from '@tanstack/react-query';
import { apiClientGo } from 'shared/config';

interface WelcomeStats {
  activeTasks: number;
  pendingDocuments: number;
  totalDocuments: number;
  completedTasks: number;
}

export const useWelcomeStats = () => {
  const { data: tasksData } = useQuery({
    queryKey: ['employee-tasks'],
    queryFn: async () => {
      const { data } = await apiClientGo.get('tasks/employee');
      return data;
    },
  });

  const stats: WelcomeStats = {
    activeTasks: 0,
    pendingDocuments: 0,
    totalDocuments: 0,
    completedTasks: 0,
  };

  if (tasksData) {
    // Подсчет активных задач (в работе + на проверке)
    const inProgress = tasksData.DOING?.IN_PROGRESS?.length || 0;
    const review = tasksData.DOING?.REVIEW?.length || 0;
    stats.activeTasks = inProgress + review;

    // Подсчет задач на согласовании (ожидающие)
    stats.pendingDocuments = tasksData.DOING?.PENDING?.length || 0;

    // Подсчет завершенных задач
    stats.completedTasks = tasksData.COMPLETED?.length || 0;

    // Общее количество документов (примерная оценка)
    stats.totalDocuments = (tasksData.ALL?.PENDING?.length || 0) + 
                          (tasksData.ALL?.IN_PROGRESS?.length || 0) +
                          (tasksData.ALL?.COMPLETED?.length || 0);
  }

  return {
    stats,
    isLoading: !tasksData,
  };
};
