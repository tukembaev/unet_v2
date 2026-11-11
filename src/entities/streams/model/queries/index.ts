import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createFlowsShedules,
  deleteStream,
  getFlowsShedules,
  getFormEducationOptions,
  getLevelEducationOptions,
  getSubjectsInDepartments,
  getSyllabusSemesters,
  getTeachersInDepartment,
  getWorkPlanInDepartment,
  patchTeachers,
} from '../api';
import type { FlowInfo, FlowSubjectsParams } from '../types';
import { getHttpErrorMessage } from 'shared/lib';
import { toast } from 'sonner';

export const streamsKeys = {
  all: ['streams'] as const,
  levels: () => [...streamsKeys.all, 'levels'] as const,
  forms: () => [...streamsKeys.all, 'forms'] as const,
  workPlans: (level: string | null, form: string | null) =>
    [...streamsKeys.all, 'workPlans', level, form] as const,
  semesters: (syllabusId: number | null) =>
    [...streamsKeys.all, 'semesters', syllabusId] as const,
  subjects: (params: FlowSubjectsParams) =>
    [...streamsKeys.all, 'subjects', params] as const,
  flowInfo: (subjectId: number | string | null) =>
    [...streamsKeys.all, 'flowInfo', subjectId] as const,
  employees: (departmentId: number | null) =>
    [...streamsKeys.all, 'employees', departmentId] as const,
};

export function useLevelEducationOptions() {
  return useQuery({
    queryKey: streamsKeys.levels(),
    queryFn: getLevelEducationOptions,
    staleTime: 10 * 60 * 1000,
  });
}

export function useFormEducationOptions() {
  return useQuery({
    queryKey: streamsKeys.forms(),
    queryFn: getFormEducationOptions,
    staleTime: 10 * 60 * 1000,
  });
}

export function useWorkPlans(levelEducation: string | null, formEducation: string | null) {
  return useQuery({
    queryKey: streamsKeys.workPlans(levelEducation, formEducation),
    queryFn: () =>
      getWorkPlanInDepartment({
        levelEducation: levelEducation!,
        formEducation: formEducation!,
      }),
    enabled: Boolean(levelEducation && formEducation),
    staleTime: 5 * 60 * 1000,
  });
}

export function useSyllabusSemesters(syllabusId: number | null) {
  return useQuery({
    queryKey: streamsKeys.semesters(syllabusId),
    queryFn: () => getSyllabusSemesters(syllabusId!),
    enabled: syllabusId != null,
    staleTime: 5 * 60 * 1000,
  });
}

export function useFlows(params: FlowSubjectsParams, enabled = true) {
  return useQuery({
    queryKey: streamsKeys.subjects(params),
    queryFn: () => getSubjectsInDepartments(params),
    enabled,
    placeholderData: (previous) => previous,
  });
}

export function useUpdateTeacher(subjectId: string | number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ flowId, teacher }: { flowId: number; teacher: number }) =>
      patchTeachers(flowId, { teacher }),
    onSuccess: () => {
      if (subjectId != null) {
        void queryClient.invalidateQueries({
          queryKey: streamsKeys.flowInfo(subjectId),
        });
      }
      toast.success('Преподаватель прикреплён');
    },
    onError: (error) => {
      toast.error('Не удалось прикрепить преподавателя', {
        description: getHttpErrorMessage(error),
      });
    },
  });
}

/** Только GET потоков — без повторной генерации. */
export function useFlowsSchedules(subjectId: string | number | null) {
  return useQuery<FlowInfo[], Error>({
    queryKey: streamsKeys.flowInfo(subjectId),
    queryFn: () => getFlowsShedules(subjectId!),
    enabled: !!subjectId,
  });
}

/** POST generate + обновление списка потоков. */
export function useGenerateFlows(subjectId: string | number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => createFlowsShedules(subjectId!),
    onSuccess: async () => {
      if (subjectId != null) {
        await queryClient.invalidateQueries({
          queryKey: streamsKeys.flowInfo(subjectId),
        });
      }
      toast.success('Потоки сгенерированы');
    },
    onError: (error) => {
      toast.error('Не удалось сгенерировать потоки', {
        description: getHttpErrorMessage(error),
      });
    },
  });
}

export function useDeleteStream(subjectId: string | number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (flowId: number) => deleteStream(flowId),
    onSuccess: async () => {
      if (subjectId != null) {
        await queryClient.invalidateQueries({
          queryKey: streamsKeys.flowInfo(subjectId),
        });
      }
      toast.success('Поток удалён');
    },
    onError: (error) => {
      toast.error('Не удалось удалить поток', {
        description: getHttpErrorMessage(error),
      });
    },
  });
}

export function useSelectEmployees(departmentId: number | null) {
  return useQuery({
    queryKey: streamsKeys.employees(departmentId),
    queryFn: () => getTeachersInDepartment(departmentId!),
    enabled: departmentId != null && departmentId > 0,
    staleTime: 5 * 60 * 1000,
  });
}
