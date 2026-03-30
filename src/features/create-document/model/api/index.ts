import { apiDocsClient } from "shared/config/docs_axios";
import { AddMemberPayload, AddMemberResponse, CreateDocumentPayload, CreateTypeApprovalPayload, TypeApproval, UpdateDocumentStatusPayload, UpdateDocumentStatusResponse } from "../types";

export const documentsActionApi = {

  // 4. Создать документ
  createDocument: async (payload: CreateDocumentPayload): Promise<Document> => {
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
    return data;
  },

  // 5. Обновить статус документа
  updateDocumentStatus: async (
    id: string,
    payload: UpdateDocumentStatusPayload
  ): Promise<UpdateDocumentStatusResponse> => {
    const { data } = await apiDocsClient.patch(`${id}/`, payload);
    return data;
  },

  // 6. Добавить участников документа
  addDocumentMembers: async (
    id: string,
    members: AddMemberPayload[]
  ): Promise<AddMemberResponse[]> => {
    const { data } = await apiDocsClient.patch(`add-member/${id}/`, members);
    return data;
  },

  // 7. Создать тип согласования
  createTypeApproval: async (payload: CreateTypeApprovalPayload): Promise<TypeApproval> => {
    const { data } = await apiDocsClient.post('type-approval/', payload);
    return data;
  },
};