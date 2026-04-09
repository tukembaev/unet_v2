/**
 * Слаги с бэкенда (`GET users/me` → `permissions: string[]`).
 */

/** Вкладки раздела «Учебное управление» */
export const EDUCATION_DEPARTMENT_PERMISSIONS = [
  'education_department:kinds',
  'education_department:disciplines',
  'education_department:reports',
  'education_department:dispatch',
  'education_department:workload',
] as const;

/** Раздел «Структура» — IT */
export const IT_DEPARTMENT_PERMISSION = 'it:department' as const;
/** Раздел «Структура» — KPI */
export const KPI_REPORTS_PERMISSION = 'kpi:reports' as const;

/**
 * Учебный процесс (РУП, потоки, кафедра) и прочие модули.
 * Нагрузка в меню ведёт на тот же контент, что вкладка — право `education_department:workload`.
 */
export const APP_PERMISSIONS = [
  ...EDUCATION_DEPARTMENT_PERMISSIONS,
  IT_DEPARTMENT_PERMISSION,
  KPI_REPORTS_PERMISSION,
  'work_plan',
  'streams',
  'discipline_department',
] as const;

export type AppPermission = (typeof APP_PERMISSIONS)[number];

export function isAppPermission(value: string): value is AppPermission {
  return (APP_PERMISSIONS as readonly string[]).includes(value);
}
