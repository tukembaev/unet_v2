// Define route paths as constants for type safety
export const ROUTES = {
  HOME: '/home',
  ABOUT: '/about',
  TASK: '/task',
  TASK_DETAILS: '/task-details',
  /** Расписание (студент / общий доступ) */
  SCHEDULE: '/schedule',
  /** Регистрация на дисциплины */
  STUDENT_REGISTRATION: '/student/registration',
  /** Мои дисциплины */
  MY_DISCIPLINES: '/student/disciplines',
  /** Студенческий билет */
  STUDENT_TICKET: '/student/ticket',
  /** Обращения (публично, без входа) */
  SUPPORT: '/support',


  AUTH: '/',
  PERSONAL_CARD: '/profile-card',
  // Структура
  EDUCATION_MANAGEMENT: '/education-management',
  /** Составление расписания для потока (диспетчерская) */
  DISPATCHER_STREAM: '/education-management/dispatcher/:streamId',

  IT_DEPARTMENT: '/structure/it-department',
  /** Обращения сотрудников (inbox) */
  APPEALS: '/structure/appeals',
  KPI_REPORTS: '/kpi-reports',
  /** Приёмная комиссия (внешний сервис) */
  ABITURIENT_COMMISSION: 'https://abiturient.kstu.kg',
  /** Портал ADM (кадры, администратор и др.) */
  ADM_PORTAL: 'https://adm.kstu.kg/',
  /** Отдел кадров / УЧР (внешний сервис) */
  HR_DEPARTMENT: 'https://adm.kstu.kg/',
  /** Общежитие (uPortal) */
  DORMITORY: 'https://uportal.kstu.kg/',
  /** QR / аудитории */
  QR_AUDITORIUMS: 'https://qr.kstu.kg',
  /** LMS (внешний сервис) */
  LMS: 'https://lms.kstu.kg/',
  KPI_EMPLOYEE: '/kpi-employee',
  
  REPORT_SYLLABUS: 'report-syllabus',
  // Документооборот
  APPLICATIONS: '/documents/applications',

  DOCUMENT_DETAILS: '/documents/applications/:id',
  UDOC: '/documents/udoc',
  UDOC_DETAILS: '/documents/udoc/:id',

  
  // Учебный процесс
  CURRICULUM: '/education/curriculum',
  /** Карточка РУП (GET /courses/:syllabusId/) */
  CURRICULUM_DETAIL: '/education/curriculum/:syllabusId',
  STREAMS: '/education/streams',
  DEPARTMENTDISCIPLINES: '/education/department-disciplines',
  WORKLOAD: '/education/workload',
  STREAM_DETAILS: '/education/stream',
  
  // Отчетность
  TASK_REPORTS: '/reports/tasks',
  AUDITORIUM_FUND: '/reports/auditorium-fund',
  /** Табель — матрица отработанного времени по подразделению */
  TABEL_REPORT: '/reports/tabel',
  /** Анкетирование (управление + результаты) */
  SURVEYS: '/reports/surveys',
  /** Анкетирование для студентов */
  STUDENT_SURVEYS: '/student/surveys',
  /** Публичное прохождение анкеты по share_token */
  SURVEY_PUBLIC: '/s/:token',
} as const;

// Type for route paths
export type RoutePath = typeof ROUTES[keyof typeof ROUTES];

// Type-safe navigation helper
export function getRoute(path: RoutePath, params?: Record<string, string>): string {
  let route = path as string;
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      route = route.replace(`:${key}`, value);
    });
  }
  
  return route;
}

/** Детальный просмотр РУП из отчётов (без profile — GET /courses/{id}/). */
export function getReportSyllabusPath(
  syllabusId: number,
  profileId?: number | null
): string {
  const base = `/${ROUTES.REPORT_SYLLABUS}/${syllabusId}`;
  if (profileId != null && Number.isFinite(profileId) && profileId > 0) {
    return `${base}/${profileId}`;
  }
  return base;
}

/** Экран составления расписания потока в диспетчерской. */
export function getDispatcherStreamPath(streamId: number): string {
  return `/education-management/dispatcher/${streamId}`;
}

