// Define route paths as constants for type safety
export const ROUTES = {
  HOME: '/home',
  ABOUT: '/about',
  TASK: '/task',
  TASK_DETAILS: '/task-details',


  AUTH: '/',
  PERSONAL_CARD: '/profile-card',
  // Структура
  EDUCATION_MANAGEMENT: '/education-management',

  IT_DEPARTMENT: '/structure/it-department',
  KPI_REPORTS: '/structure/kpi-reports',
  
  REPORT_SYLLABUS: 'report-syllabus',
  // Документооборот
  APPLICATIONS: '/documents/applications',
  ORDERS: '/documents/orders',
  DOCUMENT_DETAILS: '/documents/applications/:id',
  ORDER_DETAILS: '/documents/orders/:id',
  
  // Учебный процесс
  CURRICULUM: '/education/curriculum',
  STREAMS: '/education/streams',
  WORKLOAD: '/education/workload',
  STREAM_DETAILS: '/education/stream',
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

