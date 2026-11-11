import { apiClient } from 'shared/config';
import type {
  EducationSelectOption,
  FlowInfo,
  FlowSelectOption,
  FlowSemesterOption,
  FlowSubject,
  FlowSubjectsParams,
  FlowSubjectsResponse,
  StreamsEmployee,
} from '../types';
import { toast } from 'sonner';

function normalizeSelectOptions(raw: unknown): FlowSelectOption[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((row) => {
      const item = row as Record<string, unknown>;
      const value = Number(item.value ?? item.id);
      const label = String(
        item.label ?? item.name ?? item.direction ?? item.title ?? value
      );
      return { value, label };
    })
    .filter((item) => Number.isFinite(item.value));
}

function normalizeSubjectsPage(
  data: unknown,
  page: number
): FlowSubjectsResponse {
  if (Array.isArray(data)) {
    return {
      count: data.length,
      next: null,
      previous: null,
      results: data as FlowSubject[],
      page,
    };
  }

  const payload = (data ?? {}) as Record<string, unknown>;
  const results = Array.isArray(payload.results)
    ? (payload.results as FlowSubject[])
    : Array.isArray(payload.data)
      ? (payload.data as FlowSubject[])
      : [];

  return {
    count: Number(payload.count ?? results.length),
    next: typeof payload.next === 'string' ? payload.next : null,
    previous: typeof payload.previous === 'string' ? payload.previous : null,
    results,
    page,
  };
}

function asList(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === 'object' && Array.isArray((raw as { results?: unknown }).results)) {
    return (raw as { results: unknown[] }).results;
  }
  return [];
}

function normalizeEducationOptions(raw: unknown): EducationSelectOption[] {
  return asList(raw).flatMap((row) => {
    if (typeof row === 'string' || typeof row === 'number') {
      const text = String(row).trim();
      return text ? [{ value: text, label: text }] : [];
    }
    if (!row || typeof row !== 'object') return [];
    const item = row as Record<string, unknown>;
    const label = String(item.label ?? item.title ?? item.name ?? '').trim();
    const value = String(item.value ?? item.id ?? label).trim();
    if (!value && !label) return [];
    return [{ value: value || label, label: label || value }];
  });
}

/** GET /level-education-select/ */
export async function getLevelEducationOptions(): Promise<EducationSelectOption[]> {
  const { data } = await apiClient.get<unknown>('level-education-select/');
  return normalizeEducationOptions(data);
}

/** GET /form-education-select/ */
export async function getFormEducationOptions(): Promise<EducationSelectOption[]> {
  const { data } = await apiClient.get<unknown>('form-education-select/');
  return normalizeEducationOptions(data);
}

/**
 * GET /workplan-select/?form_education=&level_education=
 * В query уходят подписи, как их ждёт API: «Очная», «Бакалавр».
 */
export async function getWorkPlanInDepartment(params: {
  formEducation: string;
  levelEducation: string;
}): Promise<FlowSelectOption[]> {
  const { data } = await apiClient.get<unknown>('workplan-select/', {
    params: {
      form_education: params.formEducation,
      level_education: params.levelEducation,
    },
  });
  return normalizeSelectOptions(data);
}

/** GET /syllabuses/{id}/semesters/ — селект семестров по РУП */
export async function getSyllabusSemesters(
  syllabusId: number
): Promise<FlowSelectOption[]> {
  const { data } = await apiClient.get<unknown>(
    `syllabuses/${syllabusId}/semesters/`
  );

  if (!Array.isArray(data)) return [];

  return data
    .map((row) => {
      const item = row as FlowSemesterOption & Record<string, unknown>;
      const value = Number(item.id ?? item.value);
      const label = String(
        item.name_semester ?? item.label ?? item.name ?? value
      );
      return { value, label };
    })
    .filter((item) => Number.isFinite(item.value));
}

/** GET /subjects-stream/?syllabus=&semester=&page=&search= */
export async function getSubjectsInDepartments(
  params: FlowSubjectsParams
): Promise<FlowSubjectsResponse> {
  const page = params.page ?? 1;
  const search = params.search?.trim();
  const { data } = await apiClient.get<unknown>('subjects-stream/', {
    params: {
      ...(params.syllabus != null ? { syllabus: params.syllabus } : {}),
      ...(params.semester != null ? { semester: params.semester } : {}),
      ...(search ? { search } : {}),
      page,
    },
  });
  return normalizeSubjectsPage(data, page);
}

/** POST /subjects-stream/{id}/streams/generate/ */
export async function createFlowsShedules(id: number | string) {
  try {
    const response = await apiClient.post(
      `subjects-stream/${id}/streams/generate/`
    );
    return response;
  } catch (error: unknown) {
    const status =
      (error as { response?: { status?: number } })?.response?.status ||
      'неизвестная ошибка';
    toast.error(`Ошибка при создании расписания потоков (${status})`);
    throw error;
  }
}

/** GET /subjects-stream/{id}/streams/ */
export async function getFlowsShedules(
  id: number | string
): Promise<FlowInfo[]> {
  const { data } = await apiClient.get<unknown>(
    `subjects-stream/${id}/streams/`
  );
  return Array.isArray(data) ? (data as FlowInfo[]) : [];
}

export async function patchTeachers(
  flowId: number,
  body: { teacher: number }
) {
  const response = await apiClient.patch(`streams/${flowId}/`, body);
  return response;
}

/** DELETE /streams/{id}/ */
export async function deleteStream(flowId: number | string): Promise<void> {
  await apiClient.delete(`streams/${flowId}/`);
}

export async function getTeachersInDepartment(
  departmentId: number
): Promise<StreamsEmployee[]> {
  const { data } = await apiClient.get<unknown>(
    `department/${departmentId}/employees/`
  );
  if (!Array.isArray(data)) return [];

  return data.map((item) => {
    const row = item as Record<string, unknown>;
    return {
      employee_id: Number(row.employee_id ?? row.value),
      is_active: Boolean(row.is_active ?? true),
      label: String(row.label ?? ''),
      value: Number(row.employee_id ?? row.value),
    };
  });
}
