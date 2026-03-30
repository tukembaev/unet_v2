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
}

export type Directions = DirectionItem[];

/**
 * POST /new-syllabus/ — как в legacy StudyPlanForm
 * (name_direction, template, года строками).
 */
export interface CreateSyllabusPayload {
  name_direction: number;
  template: number;
  start_year: string;
  end_year: string;
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
