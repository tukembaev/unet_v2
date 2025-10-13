import { apiClient } from 'shared/config/axios';
import { Direction, Discipline, SelectOptions, WorkPlanItem } from '../types';

export const getUsers = async (): Promise<Direction[]> => {
  const { data } = await apiClient.get('api/kind');
  return data;
};

export const getDisciplineTemplates = async (
  levelEducation: string,
  kind: number
): Promise<Discipline[]> => {
  const { data } = await apiClient.get('discipline-templates/', {
    params: {
      level_education: levelEducation,
      kind: kind
    }
  });
  return data;
};
export const getFaculties = async (): Promise<SelectOptions[]> => {
  const { data } = await apiClient.get('faculties/');
  return data;
};
export const getDepartments = async (value: number): Promise<SelectOptions[]> => {
  const { data } = await apiClient.get(`departments/${value}/`);
  return data;
};

export const getSyllabuses = async (value: number): Promise<SelectOptions[]> => {
  const { data } = await apiClient.get(`syllabuses/caphedra/${value}/`);
  return data;
};
export const getSemesters = async (value: number): Promise<SelectOptions[]> => {
  const { data } = await apiClient.get(`semesters/${value}/`);
  return data;
};
export const getWorkPlanBySemester = async (syllabus: number, semester: number): Promise<WorkPlanItem[]> => {
  const { data } = await apiClient.get(`semesters/by-work-plan/${syllabus}/`, {
    params: {
      semester: semester
    }
  });
  return data;
};
