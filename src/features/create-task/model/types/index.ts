import { z } from 'zod';

// Types for CreateTaskDialog
export interface CreateTaskDialogUser {
  id: string;
  name: string;
  email: string;
}

export interface CreateTaskDialogStudent {
  id: string;
  name: string;
  group: string;
}

export interface CreateTaskDialogObserver {
  id: string;
  name: string;
  role: string;
}

export interface CreateTaskDialogCoExecutor {
  id: string;
  name: string;
  department: string;
}

// Zod schema for form validation
export const createTaskFormSchema = z.object({
  taskName: z.string().min(3, 'Название должно содержать минимум 3 символа'),
  description: z.string().optional(),
  isImportant: z.boolean(),
  selectedFiles: z.array(z.instanceof(File)),
  responsible: z.string().min(1, 'Ответственный обязателен'),
  students: z.array(z.string()),
  observers: z.array(z.string()),
  coExecutors: z.array(z.string()),
  deadline: z.date({ required_error: 'Крайний срок обязателен' }),
});

// Infer TypeScript type from Zod schema
export type CreateTaskFormData = z.infer<typeof createTaskFormSchema>;
