import { apiClientGo } from 'shared/config/go_axios';
import type {
  DateRangeParams,
  UsersReportResponse,
  PerformanceReportResponse,
  TasksReportParams,
  TasksReportResponse,
} from '../types';

export const taskReportsApi = {
  // Отчет по исполнителям
  getUsersReport: async (params: DateRangeParams): Promise<UsersReportResponse> => {
    const { data } = await apiClientGo.get<UsersReportResponse>('reports/users', { params });
    return data;
  },

  // Производительность
  getPerformanceReport: async (params: DateRangeParams): Promise<PerformanceReportResponse> => {
    const { data } = await apiClientGo.get<PerformanceReportResponse>('reports/performance', { params });
    return data;
  },

  // Отчет по задачам с фильтрами
  getTasksReport: async (params: TasksReportParams): Promise<TasksReportResponse> => {
    const { data } = await apiClientGo.get<TasksReportResponse>('reports/tasks', { params });
    return data;
  },
};
