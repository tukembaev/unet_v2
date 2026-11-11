/** Человекочитаемые названия slug-ов прав (fallback, если бэк не отдал label). */
export const PERMISSION_LABELS: Record<string, string> = {
  work_plan: 'РУП',
  streams: 'Потоки',
  discipline_department: 'Дисциплины кафедры',
  udoc: 'UDOC — рассылка приказов',
  'it:department': 'IT департамент',
  'kpi:reports': 'Отчёты KPI',
  'education_department:kinds': 'Учебное управление — семейства',
  'education_department:disciplines': 'Учебное управление — дисциплины',
  'education_department:reports': 'Учебное управление — отчёты',
  'education_department:dispatch': 'Учебное управление — диспетчерская',
  'education_department:workload': 'Учебное управление — нагрузка',
  'abiturient:atestat_commission': 'Приёмная комиссия — аттестат',
  'abiturient:secretary_report': 'Приёмная комиссия — секретарь',
  'abiturient:appeal_commission': 'Приёмная комиссия — апелляция',
  'abiturient:tech_commission': 'Приёмная комиссия — тех. комиссия',
  'abiturient:subject_commission': 'Приёмная комиссия — предметная комиссия',
  'abiturient:chairman': 'Приёмная комиссия — председатель',
  'abiturient:deputy_chairman': 'Приёмная комиссия — зам. председателя',
};

export function permissionLabel(slug: string, apiLabel?: string): string {
  if (apiLabel?.trim()) return apiLabel.trim();
  return PERMISSION_LABELS[slug] ?? slug;
}
