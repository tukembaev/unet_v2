// Breadcrumb mapping configuration
// Maps URL segments to display names for breadcrumbs
export const BREADCRUMB_MAPPING: Record<string, string> = {
  // Main sections
  'home': 'Главная',
  'about': 'О нас',
  
  // Structure section
  'structure': 'Структура',
  'education-management': 'Учебное управление',
  'it-department': 'IT департамент',
  'kpi-reports': 'Отчеты KPI',
  
  // Documents section
  'documents': 'Документооборот',
  'applications': 'Обращения',
  'orders': 'Приказы',
  'tasks': 'Задачи',
  
  // Education section
  'education': 'Учебный процесс',
  'curriculum': 'РУП',
  'streams': 'Потоки',
  'workload': 'Нагрузка',
};

// Helper function to get breadcrumb label
export const getBreadcrumbLabel = (segment: string): string => {
  return BREADCRUMB_MAPPING[segment] || segment;
};

// Helper function to capitalize first letter
export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Helper function to format segment for display
export const formatBreadcrumbSegment = (segment: string): string => {
  // First try to get from mapping
  const mapped = getBreadcrumbLabel(segment);
  if (mapped !== segment) {
    return mapped;
  }
  
  // If not found in mapping, format the segment
  return segment
    .split('-')
    .map(word => capitalizeFirst(word))
    .join(' ');
};
