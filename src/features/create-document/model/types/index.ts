import { DocumentType } from 'entities/documents/model/types';
import { z } from 'zod';


export const DocumentTypes = [
  { value: 'ORDER_STUD', label: 'Приказ (студент)' },
  { value: 'ORDER_EMPL', label: 'Приказ (сотрудник)' },
  { value: 'APPLICATION', label: 'Заявление' },
  { value: 'MAIL', label: 'Письмо' },
  { value: 'REPORT', label: 'Отчет' },
] as const;


// Create Document Types
export interface CreateDocumentMember {
  user_id: string;
  type_approval_id: string;
  user_name?: string; // Добавляем имя пользователя для отображения
}

export interface CreateDocumentPayload {
  sender_id: string;
  type: DocumentType;
  title?: string;
  file: File;
  status?: string;
  members: CreateDocumentMember[];
}

// Update Status Types
export interface UpdateDocumentStatusPayload {
  status: string;
}

export interface UpdateDocumentStatusResponse {
  status: string;
}

// Add Members Types
export interface AddMemberPayload {
  user_id: string;
  type_approval_id: string;
}

export interface AddMemberResponse {
  user_id: string;
  type_approval_id: string;
}

// Type Approval Types
export interface CreateTypeApprovalPayload {
  title: string;
  approve_name: string;
}

export interface TypeApproval {
  id: string;
  title: string;
  approve_name: string;
}

// Form types
export interface CreateDocumentFormData {
  sender_id: string;
  type: DocumentType;
  title?: string;
  file: File;
  status?: string;
  members: CreateDocumentMember[];
}

export type DocumentMember = CreateDocumentMember;

export const createDocumentFormSchema = z.object({
  sender_id: z.string(),
  type: z.enum(['ORDER_STUD', 'ORDER_EMPL', 'APPLICATION', 'MAIL', 'REPORT'], {
    required_error: 'Выберите тип документа',
  }),
  title: z.string().optional(),
  file: z.instanceof(File, {
    message: 'Загрузите PDF файл',
  }),
  status: z.string().optional(),
  members: z.array(z.object({
    user_id: z.string(),
    type_approval_id: z.string(),
    user_name: z.string().optional(),
  })),
});