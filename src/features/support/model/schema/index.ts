import { z } from 'zod';

export const supportRequestSchema = z.object({
  category_id: z.string().trim().min(1, 'Выберите тему обращения'),
  feedback_email: z
    .string()
    .trim()
    .min(1, 'Укажите email для ответа')
    .email('Введите корректный email'),
  title: z
    .string()
    .trim()
    .min(1, 'Укажите тему обращения')
    .max(200, 'Тема не должна превышать 200 символов'),
  description: z
    .string()
    .trim()
    .min(10, 'Опишите вопрос подробнее (минимум 10 символов)')
    .max(4000, 'Сообщение слишком длинное'),
  files: z.array(z.instanceof(File)).optional(),
});

export type SupportRequestFormValues = z.infer<typeof supportRequestSchema>;
