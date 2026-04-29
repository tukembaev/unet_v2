/** Элемент списка РУП (GET /all-syllabus/) */
export interface DirectionItem {
  id: number;
  direction: string;
  semester_count: number;
  subjects_count: number;
  creator_id: number | null;
  /** Уровень образования (поле с бэкенда, напр. Бакалавр / Магистратура) */
  level_education: string | null;
  start_year: string | null;
  end_year: string | null;
  form_education: string | null;
}

export type Directions = DirectionItem[];

/** РУП из GET /all-syllabus/{id}/ */
export interface SyllabusListItemDetail {
  id: number;
  name_direction: number;
  direction: string;
  form_education: string | null;
  level_education: string | null;
  creator_id: number | null;
  start_year: string | null;
  end_year: string | null;
}

export interface UpdateSyllabusPayload {
  name_direction?: number;
  form_education?: string;
  level_education?: string;
  creator_id?: number | null;
  start_year?: string;
  end_year?: string;
}

/**
 * POST /new-syllabus/
 */
export interface CreateSyllabusPayload {
  name_direction: number;
  start_year: string;
  end_year: string;
  /** Форма обучения: full_time | part_time | distance */
  form_education: string;
  /** Уровень: bachelor | master | phd | specialist */
  level_education: string;
}

/** Опция направления (GET select-directions/) */
export interface SyllabusDirectionOption {
  value: number;
  label: string;
}

/** Опция шаблона (GET discipline-templates/?direction=) */
export interface SyllabusTemplateOption {
  id: number;
  label: string;
}

/** Детальный ответ плана (совпадает с типом в education-management). */
export type { SyllabusRoot } from 'entities/education-management/model/types';
