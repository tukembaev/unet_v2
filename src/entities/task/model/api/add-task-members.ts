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
    const response = await fetch(`/api/tasks/${taskId}/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coExecutors: data.coExecutors,
        observers: data.observers,
      }),
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
