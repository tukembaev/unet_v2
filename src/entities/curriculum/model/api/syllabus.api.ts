import { apiClient } from 'shared/config';
import type { SyllabusRoot } from 'entities/education-management/model/types';
import type {
  CreateSyllabusPayload,
  DirectionItem,
  SyllabusDirectionOption,
  SyllabusTemplateOption,
} from '../types';

/** GET /all-syllabus/ — список РУП */
export async function fetchSyllabusList(): Promise<DirectionItem[]> {
  const { data } = await apiClient.get<DirectionItem[]>('all-syllabus/');
  return data;
}

/**
 * GET /select-directions/ — направления для формы создания РУП.
 * Ответ бэкенда нормализуем к { value, label }.
 */
export async function fetchSyllabusDirectionOptions(): Promise<
  SyllabusDirectionOption[]
> {
  const { data } = await apiClient.get<unknown>('select-directions/');
  return normalizeDirectionOptions(data);
}

/**
 * GET /discipline-templates/?direction={id} — шаблоны по выбранному направлению.
 */
export async function fetchSyllabusTemplatesByDirection(
  directionId: number
): Promise<SyllabusTemplateOption[]> {
  const { data } = await apiClient.get<unknown>('discipline-templates/', {
    params: { direction: directionId },
  });
  return normalizeTemplateOptions(data);
}

function normalizeDirectionOptions(raw: unknown): SyllabusDirectionOption[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((row: Record<string, unknown>) => {
    const value = Number(
      row.value ?? row.id ?? row.name_direction ?? row.kind
    );
    const label = String(
      row.label ??
        row.direction_name ??
        row.direction ??
        row.title ??
        row.name ??
        value
    );
    return { value, label };
  }).filter((o) => !Number.isNaN(o.value));
}

function normalizeTemplateOptions(raw: unknown): SyllabusTemplateOption[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((row: Record<string, unknown>) => {
    const id = Number(row.id ?? row.pk);
    const label = String(
      row.year ??
        row.label ??
        row.name ??
        row.title ??
        (Number.isFinite(id) ? `Шаблон ${id}` : '')
    );
    return { id, label };
  }).filter((o) => Number.isFinite(o.id));
}

/**
 * GET /courses/{id}/ или /courses/{id}/{profile_id}/
 * Без profile — базовый план; с profile — вариант по профилю.
 */
export async function fetchSyllabusCourse(
  id: number,
  options?: { profileId?: number; language?: string }
): Promise<SyllabusRoot> {
  const path =
    options?.profileId != null
      ? `courses/${id}/${options.profileId}/`
      : `courses/${id}/`;
  const { data } = await apiClient.get<SyllabusRoot>(path, {
    headers: options?.language
      ? { 'Accept-Language': options.language }
      : undefined,
  });
  return data;
}

/** POST /new-syllabus/ — создание РУП */
export async function createSyllabus(
  payload: CreateSyllabusPayload
): Promise<unknown> {
  const { data } = await apiClient.post('new-syllabus/', payload);
  return data;
}
