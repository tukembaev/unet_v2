import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  type InfiniteData,
} from '@tanstack/react-query';
import {
  getUsers,
  getDisciplineTemplates,
  getFaculties,
  getDepartments,
  getSyllabuses,
  getSemesters,
  getReports,
  getWorkPlanBySemester,
  getWorkLoadBySemester,
  getWorkloadYears,
  getFamilyDirection,
  getDirections,
  getSyllabusReport,
  getAllDisciplinePage,
  getProfilesInDirections,
  getScheduleCampuses,
  getScheduleKorpuses,
  getScheduleAudits,
  getTeacherEmployment,
  getAudienceOccupancy,
  postSchedules,
  ALL_DISCIPLINE_PAGE_SIZE,
  type AllDisciplinePageResult,
  type DisciplineOption,
  type InstitutesSyllabusesParams,
} from '../api';
import type { CreateScheduleSlot } from '../types';

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

export function useDepartments(instituteId: number | null) {
  return useQuery({
    queryKey: ['departments', instituteId],
    queryFn: () => getDepartments(instituteId!),
    enabled: instituteId != null && instituteId > 0,
  });
}

export function useSyllabusesByDepartment(departmentId: number | null) {
  return useQuery({
    queryKey: ['syllabuses-caphedra', departmentId],
    queryFn: () => getSyllabuses(departmentId!),
    enabled: departmentId != null && departmentId > 0,
  });
}

export function useSemestersBySyllabus(syllabusId: number | null) {
  return useQuery({
    queryKey: ['semesters', syllabusId],
    queryFn: () => getSemesters(syllabusId!),
    enabled: syllabusId != null && syllabusId > 0,
  });
}

export function useReports(params?: InstitutesSyllabusesParams) {
  return useQuery({
    queryKey: ['reports', params ?? {}],
    queryFn: () => getReports(params),
  });
}

export function useWorkPlanBySemester(
  syllabus: number | null,
  semester: number | string | null
) {
  return useQuery({
    queryKey: ['work-plan', syllabus, semester],
    queryFn: () => getWorkPlanBySemester(syllabus!, semester!),
    enabled: syllabus != null && syllabus > 0 && semester != null && semester !== '',
  });
}

export function useScheduleCampuses() {
  return useQuery({
    queryKey: ['schedule-campuses'],
    queryFn: getScheduleCampuses,
  });
}

export function useScheduleKorpuses(campusId: string | null) {
  return useQuery({
    queryKey: ['schedule-korpuses', campusId],
    queryFn: () => getScheduleKorpuses(campusId!),
    enabled: Boolean(campusId),
  });
}

export function useScheduleAudits(korpusId: string | null) {
  return useQuery({
    queryKey: ['schedule-audits', korpusId],
    queryFn: () => getScheduleAudits(korpusId!),
    enabled: Boolean(korpusId),
  });
}

export function useTeacherEmployment(teacherId: number | null) {
  return useQuery({
    queryKey: ['teacher-employment', teacherId],
    queryFn: () => getTeacherEmployment(teacherId!),
    enabled: teacherId != null && teacherId > 0,
  });
}

export function useAudienceOccupancy(auditoriumId: string | null) {
  return useQuery({
    queryKey: ['audience-occupancy', auditoriumId],
    queryFn: () => getAudienceOccupancy(auditoriumId!),
    enabled: Boolean(auditoriumId),
  });
}

export function useCreateSchedules() {
  return useMutation({
    mutationFn: (schedules: CreateScheduleSlot[]) => postSchedules(schedules),
  });
}

export function useWorkloadYears() {
  return useQuery({
    queryKey: ['workload-years'],
    queryFn: getWorkloadYears,
    staleTime: 10 * 60 * 1000,
  });
}

export function useWorkLoadBySemester(year: string, department_id: number, report_type: string, semester_type: string) {
  return useQuery({
    queryKey: ['work-load', year, department_id, report_type, semester_type],
    queryFn: () => getWorkLoadBySemester(year, department_id, report_type, semester_type),
    enabled: !!year && !!department_id && !!report_type && !!semester_type, 
  });
}

export function useSyllabusReport(syllabusId: number | undefined, profileId: number | undefined) {
  return useQuery({
    queryKey: ['syllabus-report', syllabusId, profileId],
    queryFn: () => getSyllabusReport(syllabusId!,),
    enabled: !!syllabusId,
  });
}

export function flattenAllDisciplinePages(
  data: InfiniteData<AllDisciplinePageResult> | undefined
): DisciplineOption[] {
  if (!data?.pages?.length) return [];
  const byValue = new Map<number, DisciplineOption>();
  for (const page of data.pages) {
    for (const item of page.items) {
      byValue.set(item.value, item);
    }
  }
  return [...byValue.values()];
}

/** Порционная загрузка справочника дисциплин (limit/offset, search на бэке) для селектов РУП */
export function useAllDisciplineInfinite(search: string) {
  const trimmed = search.trim();
  return useInfiniteQuery({
    queryKey: ['all-discipline', 'infinite', trimmed],
    queryFn: ({ pageParam }) =>
      getAllDisciplinePage({
        limit: ALL_DISCIPLINE_PAGE_SIZE,
        offset: pageParam as number,
        search: trimmed || undefined,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (!lastPage.hasMore) return undefined;
      return (lastPageParam as number) + lastPage.items.length;
    },
  });
}

export function useProfilesInDirections(directionId: number | undefined) {
  return useQuery({
    queryKey: ['profiles-in-directions', directionId],
    queryFn: () => getProfilesInDirections(directionId!),
    enabled: !!directionId,
  });
}
