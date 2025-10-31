import { z } from 'zod';

// Employee interface from API
export interface Employee {
  id: number;
  label: string;
  value: number;
  is_active: boolean;
  employee_id: number;
  full_name: string;
}

// Document type options
export const DOCUMENT_TYPES = ['Рапорт', 'Заявление', 'Письмо'] as const;
export type DocumentType = typeof DOCUMENT_TYPES[number];

// Zod schema for form validation
export const createDocumentFormSchema = z.object({
  type_doc: z.enum(DOCUMENT_TYPES, {
    required_error: 'Выберите тип документа',
  }),
  addressee: z.string().min(1, 'Выберите адресата'),
  type: z.string().min(3, 'Тема должна содержать минимум 3 символа'),
  text: z.string().min(10, 'Содержимое документа должно содержать минимум 10 символов'),
  very_urgent: z.boolean().default(false),
  file: z.instanceof(File, { message: 'Выберите основной документ' }),
  files: z.array(z.instanceof(File)).default([]),
});

// Infer TypeScript type from Zod schema
export type CreateDocumentFormData = z.infer<typeof createDocumentFormSchema>;

