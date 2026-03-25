import { apiDocsClient } from 'shared/config/docs_axios';
import {
  DocumentDetailResponse,
  DocumentListResponse,
  DocumentListParams,
  TypeApproval
} from '../types';

export const documentsApi = {
  // 1. Получить список документов (application)
  getApplicationDocuments: async (params: DocumentListParams): Promise<DocumentListResponse> => {
    const { data } = await apiDocsClient.get('v1/application/', { params });
    return data;
  },

  // 2. Получить список документов (order)
  getOrderDocuments: async (params: DocumentListParams): Promise<DocumentListResponse> => {
    const { data } = await apiDocsClient.get('v1/order/', { params });
    return data;
  },

  // 3. Получить детали документа
  getDocumentDetails: async (id: string): Promise<DocumentDetailResponse> => {
    const { data } = await apiDocsClient.get(`${id}/`);
    return data;
  },

  // 4. Получить список типов согласования
  getTypeApprovals: async (): Promise<TypeApproval[]> => {
    const { data } = await apiDocsClient.get('type-approval/');
    return data;
  },
};