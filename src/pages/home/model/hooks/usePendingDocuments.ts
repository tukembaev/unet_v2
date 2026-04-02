import { useQuery } from '@tanstack/react-query';
import { documentsApi } from 'entities/documents/model/api';
import { Document } from 'entities/documents/model/types';

export const usePendingDocuments = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['pending-documents'],
    queryFn: async () => {
      const response = await documentsApi.getApplicationDocuments({
        scope: 'inbox',
        limit: 10,
      });
      return response;
    },
  });

  // Фильтруем документы, которые требуют действия
  const documents: Document[] = data?.filter(
    (doc) => doc.status && doc.status !== 'Выполнено'
  ) || [];

  return {
    documents,
    isLoading,
  };
};
