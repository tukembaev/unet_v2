import { z } from 'zod';
import { UserListItem } from 'entities/user/model/types';

// Zod schema for form validation
export const createTaskFormSchema = z.object({
  taskName: z.string().min(3, 'Название должно содержать минимум 3 символа'),
  description: z.string().optional(),
  isImportant: z.boolean(),
  parent_task_id: z.union([
    z.string().uuid('Некорректный формат ID родительской задачи'),
    z.literal(''),
  ]).optional(),
  responsible: z.custom<UserListItem>((val) => val !== null, 'Ответственный обязателен'),
  observers: z.array(z.custom<UserListItem>()),
  coExecutors: z.array(z.custom<UserListItem>()),
  deadline: z.date({ required_error: 'Крайний срок обязателен' }),
});

// Infer TypeScript type from Zod schema
export type CreateTaskFormData = z.infer<typeof createTaskFormSchema>;

// API request types
export interface CreateTaskRequest {
  title: string;
  description?: string;
  isImportant: boolean;
  responsible: string;
  observers: string[];
  coExecutors: string[];
  deadline: string;
  parent_task_id?: string;
}

export interface CreateTaskResponse {
  id: string;
  title: string;
  description?: string;
  isImportant: boolean;
  responsible: string;
  observers: string[];
  coExecutors: string[];
  deadline: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadTaskFileRequest {
  taskId: string;
  file?: File;
  url?: string;
  extra?: Record<string, unknown>;
}
