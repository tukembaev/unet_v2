import { apiClient } from 'shared/config/axios';
import { Direction, Discipline, FamilyDirection, FamilyDirectionItem, Reports, SelectOptions, WorkLoad, WorkPlanItem } from '../types';

export const getUsers = async (): Promise<Direction[]> => {
  const { data } = await apiClient.get('api/kind');
  return data;
};

export const getDirections = async (): Promise<FamilyDirectionItem[]> => {
  const { data } = await apiClient.get('directions/');
  return data;
};

export const getFamilyDirection = async (kind: number): Promise<FamilyDirection> => {
  const { data } = await apiClient.get(`kind/${kind}/`);
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

export const getWorkPlanBySemester = async (syllabus: number, semester: number|string): Promise<WorkPlanItem[]> => {
  const { data } = await apiClient.get(`streams/by-work-plan/${syllabus}/`, {
    params: {
      semester: semester ? semester : ''
    }
  });
  return data;
};

export const getWorkLoadBySemester = async (year: number, department_id: number, report_type: string, semester_type: string): Promise<WorkLoad> => {
  const { data } = await apiClient.get(`v1/workload/`, {
    params: {
      year: year ? year : '',
      department_id: department_id ? department_id : '',
      report_type: report_type ? report_type : '',
      semester_type: semester_type ? semester_type : ''
    }
  });
  return data;
};

export const getReports = async (): Promise<Reports[]> => {
  const { data } = await apiClient.get('institutes-syllabuses/');
  return data;
};