import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DOCUMENT_DETAILS_QUERY_KEY, DOCUMENTS_QUERY_KEY } from "entities/documents";
import { AddMemberPayload, CreateDocumentPayload, CreateTypeApprovalPayload, UpdateDocumentStatusPayload } from "../types";
import { documentsActionApi } from "../api";

// 4. Создать документ
export const useCreateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDocumentPayload) => documentsActionApi.createDocument(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCUMENTS_QUERY_KEY] });
    },
  });
};

// 5. Обновить статус документа
export const useUpdateDocumentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateDocumentStatusPayload }) =>
      documentsActionApi.updateDocumentStatus(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [DOCUMENTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [DOCUMENT_DETAILS_QUERY_KEY, variables.id] });
    },
  });
};

// 6. Добавить участников документа
export const useAddDocumentMembers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, members }: { id: string; members: AddMemberPayload[] }) =>
      documentsActionApi.addDocumentMembers(id, members),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [DOCUMENT_DETAILS_QUERY_KEY, variables.id] });
    },
  });
};

// 7. Создать тип согласования
export const useCreateTypeApproval = () => {
  return useMutation({
    mutationFn: (payload: CreateTypeApprovalPayload) => documentsActionApi.createTypeApproval(payload),
  });
};

