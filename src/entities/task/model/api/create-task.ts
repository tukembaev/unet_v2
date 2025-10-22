import { Task, User, Member } from '../types';

export interface CreateTaskRequest {
  task_name: string;
  description?: string;
  is_important?: boolean;
  attached_document?: string;
  deadline_date?: string;
  members: {
    user_id: number;
    member_type: 'Ответственный' | 'Соисполнитель' | 'Наблюдатель';
  }[];
}

export interface CreateTaskResponse {
  success: boolean;
  task?: Task;
  error?: string;
}

// Mock implementation for creating a task
export const createTask = async (data: CreateTaskRequest): Promise<CreateTaskResponse> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock user data (in real app, this would come from auth context)
    const mockCreator: User = {
      id: 1,
      user: 1,
      first_name: "Ариф",
      surname: "Тукембаев",
      surname_name: "Тукембаев Ариф",
      short_name: "Тукембаев А.",
      number_phone: "0700000000",
      imeag: "https://www.hindustantimes.com/ht-img/img/2023/07/15/550x309/jennie_1689410686831_1689410687014.jpg",
      email: "arif@example.com",
      division: "Отдел разработки",
      position: "Frontend разработчик",
      is_online: true,
    };

    // Mock member data
    const mockMembers: Member[] = data.members.map((member, index) => ({
      id: index + 1,
      member: {
        ...mockCreator,
        id: member.user_id,
      },
      member_type: member.member_type,
    }));

    // Create new task
    const newTask: Task = {
      id: Date.now(), // Simple ID generation for mock
      task_name: data.task_name,
      creator: mockCreator,
      status: "Ждет выполнения",
      attached_document: data.attached_document || "",
      create_date: new Date().toLocaleString('ru-RU'),
      deadline_date: data.deadline_date || null,
      members: mockMembers,
    };

    return {
      success: true,
      task: newTask,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка',
    };
  }
};

// Real API implementation (commented out for now)
/*
export const createTask = async (data: CreateTaskRequest): Promise<CreateTaskResponse> => {
  try {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: true,
      task: result.task,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка',
    };
  }
};
*/
