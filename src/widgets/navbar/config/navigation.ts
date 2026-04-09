import { ROUTES } from 'app/providers/routes';
import {
  BarChart3,
  BookOpen,
  CheckSquare,
  Clock,
  GraduationCap,
  Laptop,
  List,
  MessageSquare,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { AppPermission } from 'shared/lib/permissions';
import {
  EDUCATION_DEPARTMENT_PERMISSIONS,
  hasPermission,
  IT_DEPARTMENT_PERMISSION,
  KPI_REPORTS_PERMISSION,
} from 'shared/lib/permissions';

export type NavItemConfig = {
  title: string;
  href: string;
  description?: string;
  icon: LucideIcon;
  permission?: AppPermission | readonly AppPermission[];
  permissionMode?: 'all' | 'any';
};

export type NavSectionConfig = {
  title: string;
  items: NavItemConfig[];
};

export const NAVIGATION_SECTIONS: NavSectionConfig[] = [
  {
    title: 'Структура',
    items: [
      {
        title: 'Учебное управление',
        href: ROUTES.EDUCATION_MANAGEMENT,
        description: 'Управление учебным процессом',
        icon: GraduationCap,
        permission: EDUCATION_DEPARTMENT_PERMISSIONS,
        permissionMode: 'any',
      },
      {
        title: 'IT департамент',
        href: ROUTES.IT_DEPARTMENT,
        description: 'Информационные технологии',
        icon: Laptop,
        permission: IT_DEPARTMENT_PERMISSION,
      },
      {
        title: 'Отчеты KPI',
        href: ROUTES.KPI_REPORTS,
        description: 'Ключевые показатели эффективности',
        icon: BarChart3,
        permission: KPI_REPORTS_PERMISSION,
      },
    ],
  },
  {
    title: 'Документооборот',
    items: [
      {
        title: 'Документы',
        href: ROUTES.APPLICATIONS,
        description: 'Входящие документы',
        icon: MessageSquare,
      },
      {
        title: 'Задачи',
        href: ROUTES.TASK,
        description: 'Управление задачами',
        icon: CheckSquare,
      },
    ],
  },
  {
    title: 'Учебный процесс',
    items: [
      {
        title: 'РУП',
        href: ROUTES.CURRICULUM,
        description: 'Рабочие учебные планы',
        icon: BookOpen,
        permission: 'work_plan',
      },
      {
        title: 'Дисциплины кафедры',
        href: ROUTES.DEPARTMENTDISCIPLINES,
        description: 'Дисциплины кафедры',
        icon: List,
        permission: 'discipline_department',
      },
      {
        title: 'Потоки',
        href: ROUTES.STREAMS,
        description: 'Учебные потоки',
        icon: Users,
        permission: 'streams',
      },
      {
        title: 'Нагрузка',
        href: ROUTES.WORKLOAD,
        description: 'Учебная нагрузка',
        icon: Clock,
        permission: 'education_department:workload',
      },
    ],
  },
  {
    title: 'Отчетность',
    items: [
      {
        title: 'Аудиторный фонд',
        href: ROUTES.AUDITORIUM_FUND,
        description: 'Аудитории и спецификации',
        icon: BookOpen,
      },
      {
        title: 'Задачи',
        href: ROUTES.TASK_REPORTS,
        description: 'Сформировать отчеты по задачам',
        icon: BarChart3,
      },
    ],
  },
];

function navItemVisible(
  permissions: readonly string[] | undefined,
  item: NavItemConfig
): boolean {
  if (item.permission === undefined) return true;
  if (Array.isArray(item.permission)) {
    return hasPermission(
      permissions,
      item.permission,
      item.permissionMode ?? 'any'
    );
  }
  return hasPermission(permissions, item.permission);
}

export function filterNavigationForPermissions(
  permissions: readonly string[] | undefined
): NavSectionConfig[] {
  return NAVIGATION_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => navItemVisible(permissions, item)),
  })).filter((section) => section.items.length > 0);
}
