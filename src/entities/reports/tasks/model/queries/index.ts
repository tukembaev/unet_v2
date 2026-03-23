import { useQuery } from '@tanstack/react-query';
import { taskReportsApi } from '../api';
import type { DateRangeParams, TasksReportParams } from '../types';

// Query keys
export const taskReportsKeys = {
  all: ['task-reports'] as const,
  users: (params: DateRangeParams) => [...taskReportsKeys.all, 'users', params] as const,
  performance: (params: DateRangeParams) => [...taskReportsKeys.all, 'performance', params] as const,
  tasks: (params: TasksReportParams) => [...taskReportsKeys.all, 'tasks', params] as const,
};

// Хук для отчета по исполнителям
export const useUsersReport = (params: DateRangeParams) => {
  return useQuery({
    queryKey: taskReportsKeys.users(params),
    queryFn: () => taskReportsApi.getUsersReport(params),
    staleTime: 5 * 60 * 1000,
  });
};

// Хук для производительности
export const usePerformanceReport = (params: DateRangeParams) => {
  return useQuery({
    queryKey: taskReportsKeys.performance(params),
    queryFn: () => taskReportsApi.getPerformanceReport(params),
    staleTime: 5 * 60 * 1000,
  });
};

// Хук для отчета по задачам с фильтрами
export const useTasksReport = (params: TasksReportParams) => {
  return useQuery({
    queryKey: taskReportsKeys.tasks(params),
    queryFn: () => taskReportsApi.getTasksReport(params),
    staleTime: 5 * 60 * 1000,
    enabled: !!(params.start_date && params.end_date),
  });
};
