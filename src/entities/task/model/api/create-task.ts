import { TaskDetail, TaskMember, TaskMemberRole, TaskPriority, TaskStatus } from '../types';

export interface CreateTaskRequest {
  type?: string;
  title: string;
  description: string;
  priority?: TaskPriority;
  deadline_at?: string | null;
  allow_change_deadline?: boolean;
  check_after_finish?: boolean;
  auto_complete_parent?: boolean;
  parent_task_id?: string;
  members: Array<{
    user_id: string;
    user_name: string;
    role: TaskMemberRole | string;
    avatar_url?: string;
    is_online?: boolean;
    email?: string;
  }>;
}

export interface CreateTaskResponse {
  success: boolean;
  task?: TaskDetail;
  error?: string;
}

// Mock implementation for creating a task
export const createTask = async (data: CreateTaskRequest): Promise<CreateTaskResponse> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const nowIso = new Date().toISOString();
    const newTaskId = crypto.randomUUID?.() ?? String(Date.now());

    const mockMembers: TaskMember[] = data.members.map((member) => ({
      task_id: newTaskId,
      user_id: member.user_id,
      user_name: member.user_name,
      role: member.role,
      avatar_url: member.avatar_url ?? '',
      is_online: member.is_online ?? false,
      email: member.email ?? '',
      assigned_at: nowIso,
    }));

    const newTask: TaskDetail = {
      id: newTaskId,
      type: data.type ?? '',
      title: data.title,
      description: data.description,
      status: 'PENDING' satisfies TaskStatus,
      priority: data.priority ?? 'MEDIUM',
      creator_id: 'mock-creator',
      created_at: nowIso,
      updated_at: nowIso,
      deadline_at: data.deadline_at ?? null,
      doc_type: '',
      doc_title: '',
      doc_id: '',
      cancel_reason: '',
      allow_change_deadline: data.allow_change_deadline ?? false,
      check_after_finish: data.check_after_finish ?? false,
      auto_complete_parent: data.auto_complete_parent ?? false,
      parent_task_id: data.parent_task_id,
      members: mockMembers,
      subtasks: [],
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
