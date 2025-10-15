import { useQuery } from '@tanstack/react-query';
import { getUsers, getDisciplineTemplates, getFaculties, getReports, getWorkPlanBySemester, getWorkLoadBySemester, getFamilyDirection, getDirections } from '../api';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers, 
  });
}

export function useFamilyDirection(kind: number) {
  return useQuery({
    queryKey: ['family-direction', kind],
    queryFn: () => getFamilyDirection(kind),
    enabled: !!kind,
  });
}

export function useDirections() {
  return useQuery({
    queryKey: ['directions'],
    queryFn: getDirections,
  });
}

export function useDisciplineTemplates(levelEducation: string, kind: number) {
  return useQuery({
    queryKey: ['discipline-templates', levelEducation, kind],
    queryFn: () => getDisciplineTemplates(levelEducation, kind),
    enabled: !!levelEducation && !!kind,
  });
}
export function useFaculties() {
  return useQuery({
    queryKey: ['faculties'],
    queryFn: getFaculties,
  });
}

export function useReports() {
  return useQuery({
    queryKey: ['reports'],
    queryFn: getReports,
  });
}

export function useWorkPlanBySemester(syllabus: number, semester: number|string) {
  return useQuery({
    queryKey: ['work-plan', syllabus, semester],
    queryFn: () => getWorkPlanBySemester(syllabus, semester),
    enabled: !!syllabus || !!semester,
  });
}

export function useWorkLoadBySemester(year: number, department_id: number, report_type: string, semester_type: string) {
  return useQuery({
    queryKey: ['work-load', year, department_id, report_type, semester_type],
    queryFn: () => getWorkLoadBySemester(year, department_id, report_type, semester_type),
    enabled: !!year && !!department_id && !!report_type && !!semester_type, 
  });
}