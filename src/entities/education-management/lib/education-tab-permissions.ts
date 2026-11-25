import type { AppPermission } from 'shared/lib/permissions';

/** Вкладка → право из `permissions` */
export const EDUCATION_TAB_PERMISSIONS = {
  families: 'education_department:kinds',
  disciplines: 'education_department:disciplines',
  reports: 'education_department:reports',
  dispatcher: 'education_department:dispatch',
  workload: 'education_department:workload',
} as const satisfies Record<string, AppPermission>;

export type EducationTabId = keyof typeof EDUCATION_TAB_PERMISSIONS;

/** Порядок вкладок; reports первым — основной экран учебного управления. */
export const EDUCATION_TAB_ORDER: EducationTabId[] = [
  'reports',
  'disciplines',
  'dispatcher',
  'workload',
  'families',
];

/** Временно скрыты в UI (права и код остаются). */
const HIDDEN_EDUCATION_TABS = new Set<EducationTabId>(['families']);

const LABELS: Record<EducationTabId, string> = {
  families: 'Семейства',
  disciplines: 'Дисциплины',
  reports: 'Отчеты',
  dispatcher: 'Диспетчерская',
  workload: 'Нагрузка',
};

export function getEducationTabLabel(id: EducationTabId): string {
  return LABELS[id];
}

/**
 * Первая доступная вкладка; если передан `prefer` и он разрешён — он приоритетнее.
 */
export function getVisibleEducationTabIds(
  userPermissions: readonly string[] | undefined
): EducationTabId[] {
  const list = userPermissions ?? [];
  return EDUCATION_TAB_ORDER.filter(
    (id) =>
      !HIDDEN_EDUCATION_TABS.has(id) &&
      list.includes(EDUCATION_TAB_PERMISSIONS[id])
  );
}

export function getFirstAccessibleEducationTab(
  userPermissions: readonly string[] | undefined,
  prefer?: EducationTabId
): EducationTabId | undefined {
  const list = userPermissions ?? [];
  const has = (id: EducationTabId) =>
    list.includes(EDUCATION_TAB_PERMISSIONS[id]);

  if (prefer && has(prefer)) return prefer;
  for (const id of EDUCATION_TAB_ORDER) {
    if (has(id)) return id;
  }
  return undefined;
}
