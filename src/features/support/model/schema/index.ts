import { z } from 'zod';

export const supportRequestSchema = z
  .object({
    applicant_type: z.string(),
    category_id: z.string().trim().min(1, 'Выберите тему обращения'),
    feedback_email: z.string().optional(),
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
    full_name: z.string().optional(),
    group_name: z.string().optional(),
    pin: z.string().optional(),
    phone: z.string().optional(),
    department: z.string().optional(),
    institute: z.string().optional(),
    position: z.string().optional(),
    files: z.array(z.instanceof(File)).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.applicant_type !== 'student' && data.applicant_type !== 'employee') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Выберите, кто обращается',
        path: ['applicant_type'],
      });
      return;
    }

    if (!data.full_name?.trim() || data.full_name.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Укажите ФИО',
        path: ['full_name'],
      });
    }

    const email = data.feedback_email?.trim() ?? '';
    if (!email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Укажите email для ответа',
        path: ['feedback_email'],
      });
    } else if (!z.string().email().safeParse(email).success) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Введите корректный email',
        path: ['feedback_email'],
      });
    }

    if (data.applicant_type === 'student') {
      if (!data.group_name?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Укажите группу',
          path: ['group_name'],
        });
      }
      return;
    }

    if (!data.pin?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Укажите ПИН',
        path: ['pin'],
      });
    }
    if (!data.phone?.trim() || data.phone.trim().length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Укажите номер телефона',
        path: ['phone'],
      });
    }
    if (!data.department?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Укажите кафедру',
        path: ['department'],
      });
    }
    if (!data.institute?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Укажите институт',
        path: ['institute'],
      });
    }
    if (!data.position?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Укажите должность',
        path: ['position'],
      });
    }
  });

export type SupportRequestFormValues = z.infer<typeof supportRequestSchema>;
