import { apiClient } from 'shared/config';
import type {
  DepartmentDisciplinePayload,
  DepartmentDisciplineRow,
  SelectOptions,
} from './types';

export const getKafDiscipline = async (search: string): Promise<DepartmentDisciplineRow[]> => {
  const { data } = await apiClient.get<DepartmentDisciplineRow[]>('select-discipline/', {
    params: { search: search ?? '' },
  });
  return Array.isArray(data) ? data : [];
};

export const getAllDisciplineForPrerequisite = async (): Promise<SelectOptions[]> => {
  const { data } = await apiClient.get<SelectOptions[]>('select-all-discipline/');
  return Array.isArray(data) ? data : [];
};

export const getSelectorDirections = async (): Promise<SelectOptions[]> => {
  const { data } = await apiClient.get<SelectOptions[]>('select-directions/');
  return Array.isArray(data) ? data : [];
};

export const postKafDiscipline = async (payload: DepartmentDisciplinePayload) => {
  const { data } = await apiClient.post('select-discipline/', payload);
  return data;
};

export const patchKafDiscipline = async (id: number, payload: DepartmentDisciplinePayload) => {
  const { data } = await apiClient.patch(`discipline/${id}/`, payload);
  return data;
};

export const deleteDepartmentDiscipline = async (id: number) => {
  await apiClient.delete(`discipline/${id}/`);
};
