import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteDepartmentDiscipline,
  getAllDisciplineForPrerequisite,
  getKafDiscipline,
  getSelectorDirections,
  patchKafDiscipline,
  postKafDiscipline,
} from './api';
import type { DepartmentDisciplinePayload } from './types';

const rootKey = ['department-disciplines'] as const;

export const departmentDisciplineKeys = {
  all: rootKey,
  list: (search: string) => [...rootKey, 'list', search] as const,
  prerequisites: [...rootKey, 'prerequisites'] as const,
  directions: [...rootKey, 'directions'] as const,
};

export function useDepartmentDisciplines(search: string) {
  return useQuery({
    queryKey: departmentDisciplineKeys.list(search),
    queryFn: () => getKafDiscipline(search),
  });
}

export function usePrerequisiteOptions() {
  return useQuery({
    queryKey: departmentDisciplineKeys.prerequisites,
    queryFn: getAllDisciplineForPrerequisite,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDirectionOptions() {
  return useQuery({
    queryKey: departmentDisciplineKeys.directions,
    queryFn: getSelectorDirections,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateDepartmentDiscipline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: DepartmentDisciplinePayload) => postKafDiscipline(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: departmentDisciplineKeys.all });
    },
  });
}

export function useUpdateDepartmentDiscipline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: DepartmentDisciplinePayload }) =>
      patchKafDiscipline(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: departmentDisciplineKeys.all });
    },
  });
}

export function useDeleteDepartmentDiscipline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteDepartmentDiscipline(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: departmentDisciplineKeys.all });
    },
  });
}
