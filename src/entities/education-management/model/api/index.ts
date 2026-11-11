
import axios from 'axios';
import { apiClient } from 'shared/config';
import type {
  CreateScheduleSlot,
  Direction,
  Discipline,
  FamilyDirection,
  FamilyDirectionItem,
  GeoSelectOption,
  Reports,
  SelectOptions,
  SyllabusRoot,
  WeeklyScheduleMap,
  WorkLoad,
  WorkPlanItem,
} from '../types';

function normalizeSelectOptions(raw: unknown): SelectOptions[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((row) => {
      const item = row as Record<string, unknown>;
      const value = Number(item.value ?? item.id);
      const label = String(
        item.label ?? item.name ?? item.title ?? item.direction ?? value
      );
      return { value, label };
    })
    .filter((item) => Number.isFinite(item.value));
}

function normalizeGeoOptions(raw: unknown): GeoSelectOption[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((row) => {
      const item = row as Record<string, unknown>;
      const value = String(
        item.value ??
          item.qr_id ??
          item.campus_qr_id ??
          item.korpus_qr_id ??
          item.audit_qr_id ??
          item.id ??
          ''
      ).trim();
      const label = String(
        item.label ??
          item.name ??
          item.title ??
          item.cumpus ??
          item.campus ??
          item.korpus ??
          item.audit ??
          item.num_audit ??
          value
      ).trim();
      if (!value) return null;
      return { value, label: label || value };
    })
    .filter((item): item is GeoSelectOption => item != null);
}

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


export const getSyllabusReport = async (
  syllabus: number,
): Promise<SyllabusRoot> => {
  const { data } = await apiClient.get(`courses/${syllabus}`);
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
  return normalizeSelectOptions(data);
};
export const getKindDirections = async (kind: number): Promise<Direction> => {
  const { data } = await apiClient.get(`kind/${kind}/`);
  return data;
};
export const getDepartments = async (value: number): Promise<SelectOptions[]> => {
  const { data } = await apiClient.get(`departments/${value}/`);
  return normalizeSelectOptions(data);
};

export const getSyllabuses = async (value: number): Promise<SelectOptions[]> => {
  const { data } = await apiClient.get(`syllabuses/caphedra/${value}/`);
  return normalizeSelectOptions(data);
};
export const getSemesters = async (value: number): Promise<SelectOptions[]> => {
  const { data } = await apiClient.get(`semesters/${value}/`);
  return normalizeSelectOptions(data);
};

export const getWorkPlanBySemester = async (
  syllabus: number,
  semester: number | string
): Promise<WorkPlanItem[]> => {
  const { data } = await apiClient.get(`streams/by-work-plan/${syllabus}/`, {
    params: {
      semester: semester ? semester : '',
    },
  });
  return Array.isArray(data) ? (data as WorkPlanItem[]) : [];
};

const qrClient = axios.create({
  baseURL: 'https://qr.kstu.kg/api',
  timeout: 20000,
  headers: { Accept: 'application/json' },
});

/** GET qr /campuses/?form=select */
export const getScheduleCampuses = async (): Promise<GeoSelectOption[]> => {
  const { data } = await qrClient.get('campuses/', {
    params: { form: 'select' },
  });
  return normalizeGeoOptions(data);
};

/** GET qr /korpuses/?form=select&campus= */
export const getScheduleKorpuses = async (
  campusId: string
): Promise<GeoSelectOption[]> => {
  const { data } = await qrClient.get('korpuses/', {
    params: { form: 'select', campus: campusId },
  });
  return normalizeGeoOptions(data);
};

/** GET qr /audit/?form=select&korpus=&kind=study */
export const getScheduleAudits = async (
  korpusId: string
): Promise<GeoSelectOption[]> => {
  const { data } = await qrClient.get('audit/', {
    params: { form: 'select', korpus: korpusId, kind: 'study' },
  });
  return normalizeGeoOptions(data);
};

/** GET /teacher/{id}/schedule/ */
export const getTeacherEmployment = async (
  teacherId: number
): Promise<WeeklyScheduleMap> => {
  const { data } = await apiClient.get(`teacher/${teacherId}/schedule/`);
  return (data ?? {}) as WeeklyScheduleMap;
};

/** GET /auditorium/{id}/schedule/ */
export const getAudienceOccupancy = async (
  auditoriumId: string
): Promise<WeeklyScheduleMap> => {
  const { data } = await apiClient.get(`auditorium/${auditoriumId}/schedule/`);
  return (data ?? {}) as WeeklyScheduleMap;
};

/** POST /schedules/ — тело: массив слотов */
export const postSchedules = async (
  schedules: CreateScheduleSlot[]
): Promise<unknown> => {
  const { data } = await apiClient.post('schedules/', schedules);
  return data;
};

/** GET /v1/workload-years/ — учебные годы для селекта нагрузки. */
export const getWorkloadYears = async (): Promise<{ value: string; label: string }[]> => {
  const { data } = await apiClient.get<unknown>('v1/workload-years/');
  if (!Array.isArray(data)) return [];
  return data.flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    const row = item as Record<string, unknown>;
    const value = String(row.value ?? '').trim();
    const label = String(row.label ?? value).trim();
    if (!value) return [];
    return [{ value, label: label || value }];
  });
};

export const getWorkLoadBySemester = async (year: string, department_id: number, report_type: string, semester_type: string): Promise<WorkLoad> => {
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

export type CreateCoursePayload = {
  semester: number;
  profile?: number | null;
  discipline?: number;
  department?: number;
  cipher_direction?: string[];
  discipline_type?: string;
  code?: string | null;
  name_subject: string;
  dep: string;
  cycle?: string | null;
  course_type?: string;
  control_form?: string;
  control_type?: string;
  credit?: number;
  credit_part_time?: number;
  amount_hours?: number;
  lecture_hours?: number;
  practice_hours?: number;
  lab_hours?: number;
  /** Обязательный предмет (не «Курс по выбору») — null; для электива — строковый id группы */
  group?: string | null;
};

export const createCourse = async (payload: CreateCoursePayload) => {
  const { data } = await apiClient.post('new-create-course/', payload);
  return data;
};

export type UpdateCoursePayload = Partial<CreateCoursePayload>;

export const updateCourse = async (
  courseId: number,
  payload: UpdateCoursePayload
) => {
  const endpoints = [
    `course/${courseId}/`,
    `courses/${courseId}/`,
    `new-create-course/${courseId}/`,
  ];

  let lastError: unknown = null;
  for (const endpoint of endpoints) {
    try {
      const { data } = await apiClient.patch(endpoint, payload);
      return data;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
};

export const deleteCourse = async (
  courseId: number,
  payload?: UpdateCoursePayload
) => {
  const endpoints = [
    `course/${courseId}/`,
    `courses/${courseId}/`,
    `new-create-course/${courseId}/`,
  ];

  let lastError: unknown = null;
  for (const endpoint of endpoints) {
    try {
      const { data } = await apiClient.delete(endpoint, payload ? { data: payload } : undefined);
      return data;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
};

export type DisciplineOption = {
  value: number;
  label: string;
  cipher_direction?: string[];
  discipline_type?: string;
  depart_id?: number;
  dep?: string;
  code?: string;
  cycle?: string;
  course_type?: string;
  control_form?: string;
  credit?: number;
  credit_part_time?: number;
  lecture_hours?: number;
  practice_hours?: number;
  lab_hours?: number;
  group?: string | null;
  control_type?: string;
};

/** Размер страницы для GET all-discipline/?limit=&offset= */
export const ALL_DISCIPLINE_PAGE_SIZE = 50;

export type AllDisciplinePageResult = {
  items: DisciplineOption[];
  hasMore: boolean;
};

function parseAllDisciplineResponse(
  data: unknown,
  limit: number,
  offset: number
): AllDisciplinePageResult {
  if (Array.isArray(data)) {
    const items = data as DisciplineOption[];
    return {
      items,
      hasMore: items.length >= limit,
    };
  }
  if (
    data &&
    typeof data === 'object' &&
    'results' in data &&
    Array.isArray((data as { results: unknown }).results)
  ) {
    const { results, count, next } = data as {
      results: DisciplineOption[];
      count?: number;
      next?: string | null;
    };
    const items = results;
    let hasMore = false;
    if (next) hasMore = true;
    else if (typeof count === 'number') hasMore = offset + items.length < count;
    else hasMore = items.length >= limit;
    return { items, hasMore };
  }
  return { items: [], hasMore: false };
}

export async function getAllDisciplinePage(params: {
  offset: number;
  limit?: number;
  /** Поиск на бэке (query `search`) */
  search?: string;
}): Promise<AllDisciplinePageResult> {
  const limit = params.limit ?? ALL_DISCIPLINE_PAGE_SIZE;
  const q = params.search?.trim();
  const { data } = await apiClient.get<unknown>('all-discipline/', {
    params: {
      limit,
      offset: params.offset,
      ...(q ? { search: q } : {}),
    },
  });
  return parseAllDisciplineResponse(data, limit, params.offset);
}

export const getProfilesInDirections = async (
  directionId: number
): Promise<SelectOptions[]> => {
  const { data } = await apiClient.get(`profiles/${directionId}/`);
  if (!Array.isArray(data)) return [];

  return data
    .map((row: Record<string, unknown>) => {
      const value = Number(row.value ?? row.id ?? row.profile_id);
      const label = String(row.label ?? row.title ?? row.profile ?? value);
      return { value, label };
    })
    .filter((item) => Number.isFinite(item.value));
};

export const addProfiles = async (
  semesterId: number,
  payload: { profiles?: number[]; profile_to_remove?: number }
) => {
  const { data } = await apiClient.patch(`semester/${semesterId}/`, payload);
  return data;
};