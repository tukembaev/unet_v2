export interface KpiInstituteReport {
  abbreviation_faculty: string;
  failure_points: number;
  id: number;
  no_passed: string;
  no_passed_percent: string;
  passed: string;
  passed_percent: string;
  phone_number: string | null;
  /** Баллы (приоритет для отображения, если есть с бэка). */
  score?: string | number;
  scores: string;
  title_faculty: string;
}

export interface KpiDepartmentsReport {
  departament_name: string;
  failure_points: number;
  id: number;
  no_passed: string;
  no_passed_percent: string;
  passed: string;
  passed_percent: string;
  phone_number: string | null;
  /** Баллы кафедры (основное поле с бэка). */
  score?: string | number;
  scores: string;
  title_faculty: string;
}

/** Элемент подразделения для фильтров (`GET /divisions/`). */
export type KpiDivisionItem = {
  id: number | string;
  title?: string;
  name?: string;
  division_name?: string;
  [key: string]: unknown;
};

/** Строка табличных отчётов — поля с бэка могут отличаться. */
export type KpiReportTableRow = Record<string, unknown>;
