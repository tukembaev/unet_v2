import { apiDocsClient } from "shared/config/docs_axios";
import { AddMemberPayload, AddMemberResponse, CreateDocumentPayload, CreateTypeApprovalPayload, TypeApproval, UpdateDocumentStatusPayload, UpdateDocumentStatusResponse } from "../types";
import { toast } from "sonner";

export const documentsActionApi = {

  // 4. Создать документ
  createDocument: async (payload: CreateDocumentPayload): Promise<Document> => {
    try {
      const formData = new FormData();
      
      formData.append('sender_id', payload.sender_id);
      formData.append('type', payload.type);
      formData.append('status', 'В процессе выполнения');
      formData.append('file', payload.file);
      
      if (payload.title) {
        formData.append('title', payload.title);
      }
      
      // Очищаем members от user_name перед отправкой (это поле только для UI)
      const membersForApi = (payload.members || []).map(({ user_id, type_approval_id }) => ({
        user_id,
        type_approval_id,
      }));
      
      const membersJson = JSON.stringify(membersForApi);
      formData.append('members', membersJson);

      // Логирование для отладки
      console.log('Creating document with payload:', {
        sender_id: payload.sender_id,
        type: payload.type,
        status: 'В процессе выполнения',
        title: payload.title,
        file: payload.file.name,
        members: membersForApi,
        membersJson,
      });

      const { data } = await apiDocsClient.post('create/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Документ успешно создан');
      return data;
    } catch (error: any) {
      const status = error?.response?.status || 'неизвестная ошибка';
      toast.error(`Ошибка при создании документа (${status})`);
      throw error;
    }
  },

  // 5. Обновить статус документа
  updateDocumentStatus: async (
    id: string,
    payload: UpdateDocumentStatusPayload
  ): Promise<UpdateDocumentStatusResponse> => {
    try {
      const { data } = await apiDocsClient.patch(`${id}/`, payload);
      toast.success('Статус документа успешно обновлен');
      return data;
    } catch (error: any) {
      const status = error?.response?.status || 'неизвестная ошибка';
      toast.error(`Ошибка при обновлении статуса документа (${status})`);
      throw error;
    }
  },

  // 6. Добавить участников документа
  addDocumentMembers: async (
    id: string,
    members: AddMemberPayload[]
  ): Promise<AddMemberResponse[]> => {
    try {
      const { data } = await apiDocsClient.patch(`add-member/${id}/`, members);
      toast.success('Участники документа успешно добавлены');
      return data;
    } catch (error: any) {
      const status = error?.response?.status || 'неизвестная ошибка';
      toast.error(`Ошибка при добавлении участников документа (${status})`);
      throw error;
    }
  },

  // 7. Создать тип согласования
  createTypeApproval: async (payload: CreateTypeApprovalPayload): Promise<TypeApproval> => {
    try {
      const { data } = await apiDocsClient.post('type-approval/', payload);
      toast.success('Тип согласования успешно создан');
      return data;
    } catch (error: any) {
      const status = error?.response?.status || 'неизвестная ошибка';
      toast.error(`Ошибка при создании типа согласования (${status})`);
      throw error;
    }
  },
};