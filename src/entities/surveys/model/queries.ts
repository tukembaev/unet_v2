import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createBankQuestion,
  createCategory,
  createSurvey,
  deleteBankQuestion,
  deleteCategory,
  deleteSurvey,
  fetchBankQuestions,
  fetchCategories,
  fetchDepartmentEmployees,
  fetchDepartments,
  fetchPublicSurvey,
  fetchSurvey,
  fetchSurveyResponses,
  fetchSurveys,
  regenerateShareToken,
  submitPublicSurveyResponse,
  submitSurveyResponse,
  updateBankQuestion,
  updateCategory,
  updateSurvey,
} from './api';
import type {
  BankQuestionPayload,
  SurveyAnswerPayload,
  SurveyPayload,
} from './types';

export const surveysKeys = {
  all: ['surveys'] as const,
  list: (params: Record<string, unknown>) =>
    [...surveysKeys.all, 'list', params] as const,
  detail: (id: string) => [...surveysKeys.all, 'detail', id] as const,
  responses: (id: string) => [...surveysKeys.all, 'responses', id] as const,
  public: (token: string) => [...surveysKeys.all, 'public', token] as const,
  categories: () => [...surveysKeys.all, 'categories'] as const,
  bank: (params: Record<string, unknown>) =>
    [...surveysKeys.all, 'bank', params] as const,
  departments: () => [...surveysKeys.all, 'departments'] as const,
  employees: (deptId: string | null) =>
    [...surveysKeys.all, 'employees', deptId] as const,
};

export function useSurveys(params?: {
  department_id?: string;
  is_active?: boolean;
  limit?: number;
}) {
  return useQuery({
    queryKey: surveysKeys.list(params ?? {}),
    queryFn: () => fetchSurveys(params),
  });
}

export function useSurvey(id: string | null) {
  return useQuery({
    queryKey: surveysKeys.detail(id ?? ''),
    queryFn: () => fetchSurvey(id!),
    enabled: Boolean(id),
  });
}

export function useSurveyResponses(id: string | null, enabled = true) {
  return useQuery({
    queryKey: surveysKeys.responses(id ?? ''),
    queryFn: () => fetchSurveyResponses(id!),
    enabled: Boolean(id) && enabled,
  });
}

export function usePublicSurvey(token: string | null) {
  return useQuery({
    queryKey: surveysKeys.public(token ?? ''),
    queryFn: () => fetchPublicSurvey(token!),
    enabled: Boolean(token),
    retry: false,
  });
}

export function useDepartments() {
  return useQuery({
    queryKey: surveysKeys.departments(),
    queryFn: fetchDepartments,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDepartmentEmployees(departmentId: string | null) {
  return useQuery({
    queryKey: surveysKeys.employees(departmentId),
    queryFn: () => fetchDepartmentEmployees(departmentId!),
    enabled: Boolean(departmentId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: surveysKeys.categories(),
    queryFn: fetchCategories,
  });
}

export function useBankQuestions(params?: {
  category_id?: string;
  q?: string;
  type?: string;
}) {
  return useQuery({
    queryKey: surveysKeys.bank(params ?? {}),
    queryFn: () => fetchBankQuestions(params),
  });
}

function useInvalidateSurveys() {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: surveysKeys.all });
  };
}

export function useCreateSurvey() {
  const invalidate = useInvalidateSurveys();
  return useMutation({
    mutationFn: (payload: SurveyPayload) => createSurvey(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateSurvey() {
  const invalidate = useInvalidateSurveys();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<SurveyPayload>;
    }) => updateSurvey(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteSurvey() {
  const invalidate = useInvalidateSurveys();
  return useMutation({
    mutationFn: (id: string) => deleteSurvey(id),
    onSuccess: invalidate,
  });
}

export function useRegenerateShareToken() {
  const invalidate = useInvalidateSurveys();
  return useMutation({
    mutationFn: (id: string) => regenerateShareToken(id),
    onSuccess: invalidate,
  });
}

export function useSubmitSurveyResponse() {
  const invalidate = useInvalidateSurveys();
  return useMutation({
    mutationFn: ({
      surveyId,
      answers,
    }: {
      surveyId: string;
      answers: SurveyAnswerPayload[];
    }) => submitSurveyResponse(surveyId, answers),
    onSuccess: invalidate,
  });
}

export function useSubmitPublicResponse() {
  return useMutation({
    mutationFn: ({
      token,
      answers,
    }: {
      token: string;
      answers: SurveyAnswerPayload[];
    }) => submitPublicSurveyResponse(token, answers),
  });
}

export function useCreateCategory() {
  const invalidate = useInvalidateSurveys();
  return useMutation({
    mutationFn: (name: string) => createCategory(name),
    onSuccess: invalidate,
  });
}

export function useUpdateCategory() {
  const invalidate = useInvalidateSurveys();
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateCategory(id, name),
    onSuccess: invalidate,
  });
}

export function useDeleteCategory() {
  const invalidate = useInvalidateSurveys();
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: invalidate,
  });
}

export function useCreateBankQuestion() {
  const invalidate = useInvalidateSurveys();
  return useMutation({
    mutationFn: (payload: BankQuestionPayload) => createBankQuestion(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateBankQuestion() {
  const invalidate = useInvalidateSurveys();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: BankQuestionPayload;
    }) => updateBankQuestion(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteBankQuestion() {
  const invalidate = useInvalidateSurveys();
  return useMutation({
    mutationFn: (id: string) => deleteBankQuestion(id),
    onSuccess: invalidate,
  });
}
