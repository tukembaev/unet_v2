import { useInfiniteQuery, useQuery, type InfiniteData } from '@tanstack/react-query';
import {
  getUsers,
  getDisciplineTemplates,
  getFaculties,
  getReports,
  getWorkPlanBySemester,
  getWorkLoadBySemester,
  getFamilyDirection,
  getDirections,
  getSyllabusReport,
  getAllDisciplinePage,
  getProfilesInDirections,
  ALL_DISCIPLINE_PAGE_SIZE,
  type AllDisciplinePageResult,
  type DisciplineOption,
} from '../api';

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

export function useSyllabusReport(syllabusId: number | undefined, profileId: number | undefined) {
  return useQuery({
    queryKey: ['syllabus-report', syllabusId, profileId],
    queryFn: () => getSyllabusReport(syllabusId!, profileId!),
    enabled: !!syllabusId && !!profileId,
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
