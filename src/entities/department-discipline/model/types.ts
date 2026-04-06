import type { SelectOptions } from 'entities/education-management/model/types';

export type { SelectOptions };

/** Строка таблицы дисциплин кафедры (GET select-discipline/) */
export interface DepartmentDisciplineRow {
  id: number;
  title: string;
  title_en?: string | null;
  title_ky?: string | null;
  credit: number;
  credit_part_time?: number | null;
  level_education?: string | null;
  level_education_name?: string | null;
  directions_names?: string[] | null;
  prerequisites_names?: string[] | null;
  /** Если бэкенд отдаёт id — используем для предзаполнения формы */
  prerequisites?: number[] | null;
  directions?: number[] | null;
}

export type DepartmentDisciplinePayload = {
  prerequisites?: number[];
  title: string;
  title_en?: string;
  title_ky?: string;
  credit_part_time?: number | null;
  level_education?: string;
  credit: number;
  directions?: number[];
};
