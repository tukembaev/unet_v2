import { apiClientGo } from 'shared/config';
import { TaskStatus } from '../types';

export interface UpdateTaskStatusRequest {
  status: TaskStatus;
}

export interface UpdateTaskStatusResponse {
  success: boolean;
  error?: string;
}

export const updateTaskStatus = async (
  taskId: string,
  data: UpdateTaskStatusRequest
): Promise<UpdateTaskStatusResponse> => {
  try {
    await apiClientGo.patch(`tasks/${taskId}/status`, data);
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка',
    };
  }
};
