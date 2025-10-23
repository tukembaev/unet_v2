import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsApi, getDocumentDetails } from '../api';
import { DocumentFilters, Document } from '../types';

export const DOCUMENTS_QUERY_KEY = 'documents';

export const useDocuments = (filters: DocumentFilters) => {
  return useQuery({
    queryKey: [DOCUMENTS_QUERY_KEY, filters],
    queryFn: () => documentsApi.getDocuments(filters),
  });
};

export const useDocumentsDetails = (id: number) => {
  return useQuery({
    queryKey: ['conversion/raport/', id],
    queryFn: () => getDocumentDetails(id),
    enabled: !!id,
  });
};

export const useCreateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Document>) => documentsApi.createDocument(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCUMENTS_QUERY_KEY] });
    },
  });
};

