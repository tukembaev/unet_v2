import { TaskStatus } from '../types';

export interface UpdateTaskStatusRequest {
  status: TaskStatus | 'PAUSED' | 'REVIEW';
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
    const response = await fetch(`/api/tasks/${taskId}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

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
