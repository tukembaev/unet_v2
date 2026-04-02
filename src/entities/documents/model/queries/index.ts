import { useQuery } from '@tanstack/react-query';
import { documentsApi } from '../api';
import { DocumentScope } from '../types';

export const DOCUMENTS_QUERY_KEY = 'documents';
export const DOCUMENT_DETAILS_QUERY_KEY = 'document-details';
export const TYPE_APPROVALS_QUERY_KEY = 'type-approvals';

// 1. Получить список документов (application)
export const useApplicationDocuments = (scope: DocumentScope, offset = 0, limit = 20) => {
  return useQuery({
    queryKey: [DOCUMENTS_QUERY_KEY, 'application', scope, offset, limit],
    queryFn: () => documentsApi.getApplicationDocuments({ scope, offset, limit }),
  });
};

// 2. Получить список документов (order)
export const useOrderDocuments = (scope: DocumentScope, offset = 0, limit = 20) => {
  return useQuery({
    queryKey: [DOCUMENTS_QUERY_KEY, 'order', scope, offset, limit],
    queryFn: () => documentsApi.getOrderDocuments({ scope, offset, limit }),
  });
};

// 3. Получить детали документа
export const useDocumentDetails = (id: string) => {
  return useQuery({
    queryKey: [DOCUMENT_DETAILS_QUERY_KEY, id],
    queryFn: () => documentsApi.getDocumentDetails(id),
    enabled: !!id,
  });
};

// 4. Получить список типов согласования
export const useTypeApprovals = () => {
  return useQuery({
    queryKey: [TYPE_APPROVALS_QUERY_KEY],
    queryFn: () => documentsApi.getTypeApprovals(),
  });
};

