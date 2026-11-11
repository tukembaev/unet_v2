import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getHttpErrorMessage } from 'shared/lib/http-error';
import { tabelApi } from '../api';
import type { AbsenceWritePayload, TabelReportParams } from '../types';

export const tabelKeys = {
  all: ['tabel-report'] as const,
  unitTypes: () => [...tabelKeys.all, 'unit-types'] as const,
  organizations: (unitType: string | null) =>
    [...tabelKeys.all, 'organizations', unitType] as const,
  report: (params: TabelReportParams | null) =>
    [...tabelKeys.all, 'matrix', params] as const,
  absenceTypes: () => [...tabelKeys.all, 'absence-types'] as const,
  absence: (id: number | null) => [...tabelKeys.all, 'absence', id] as const,
};

export function useStructureUnitTypes() {
  return useQuery({
    queryKey: tabelKeys.unitTypes(),
    queryFn: () => tabelApi.getUnitTypes(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useTabelOrganizations(unitType: string | null) {
  return useQuery({
    queryKey: tabelKeys.organizations(unitType),
    queryFn: () => tabelApi.getOrganizations(unitType!),
    enabled: Boolean(unitType),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTabelReport(params: TabelReportParams | null) {
  return useQuery({
    queryKey: tabelKeys.report(params),
    queryFn: () => tabelApi.getReport(params!),
    enabled:
      params != null &&
      params.divisionId !== '' &&
      params.month >= 1 &&
      params.month <= 12 &&
      params.year > 2000,
  });
}

export function useAbsenceTypes(enabled = true) {
  return useQuery({
    queryKey: tabelKeys.absenceTypes(),
    queryFn: () => tabelApi.getAbsenceTypes(),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAbsence(id: number | null) {
  return useQuery({
    queryKey: tabelKeys.absence(id),
    queryFn: () => tabelApi.getAbsence(id!),
    enabled: id != null,
  });
}

function useInvalidateTabelReport() {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({
      queryKey: [...tabelKeys.all, 'matrix'],
    });
}

export function useCreateAbsence() {
  const invalidate = useInvalidateTabelReport();
  return useMutation({
    mutationFn: (payload: AbsenceWritePayload) => tabelApi.createAbsence(payload),
    onSuccess: async () => {
      await invalidate();
      toast.success('Пропуск сохранён');
    },
    onError: (error) => {
      toast.error('Не удалось сохранить пропуск', {
        description: getHttpErrorMessage(error),
      });
    },
  });
}

export function useUpdateAbsence() {
  const invalidate = useInvalidateTabelReport();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<AbsenceWritePayload>;
    }) => tabelApi.updateAbsence(id, payload),
    onSuccess: async () => {
      await invalidate();
      toast.success('Пропуск обновлён');
    },
    onError: (error) => {
      toast.error('Не удалось сохранить пропуск', {
        description: getHttpErrorMessage(error),
      });
    },
  });
}

export function useDeleteAbsence() {
  const invalidate = useInvalidateTabelReport();
  return useMutation({
    mutationFn: (id: number) => tabelApi.deleteAbsence(id),
    onSuccess: async () => {
      await invalidate();
      toast.success('Пропуск удалён');
    },
    onError: (error) => {
      toast.error('Не удалось удалить пропуск', {
        description: getHttpErrorMessage(error),
      });
    },
  });
}
