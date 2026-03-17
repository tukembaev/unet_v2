import { apiClientGo } from 'shared/config';

export interface AddTaskMembersRequest {
  coExecutors: string[];
  observers: string[];
}

export interface AddTaskMembersResponse {
  success: boolean;
  error?: string;
}

export const addTaskMembers = async (
  taskId: string,
  data: AddTaskMembersRequest
): Promise<AddTaskMembersResponse> => {
  try {
    await apiClientGo.post(`tasks/${taskId}/members`, {
      coExecutors: data.coExecutors,
      observers: data.observers,
    });

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
