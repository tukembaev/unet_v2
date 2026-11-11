import { ROUTES } from 'app/providers/routes';
import {
  BarChart3,
  BookMarked,
  BookOpen,
  CalendarDays,
  CheckSquare,
  ClipboardCheck,
  Clock,
  ClipboardList,
  Table2,
  GraduationCap,
  FileStack,
  Laptop,
  LifeBuoy,
  List,
  MessageSquare,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { ProfileContext } from 'shared/lib/auth-context';
import type { AppPermission } from 'shared/lib/permissions';
import {
  ABITURIENT_COMMISSION_PERMISSIONS,
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
  /** Внешняя ссылка (открывается в новой вкладке) */
  external?: boolean;
};

export type NavSectionConfig = {
  title: string;
  items: NavItemConfig[];
};

export const STUDENT_NAVIGATION_SECTIONS: NavSectionConfig[] = [
  {
    title: 'Учёба',
    items: [
      {
        title: 'Расписание',
        href: ROUTES.SCHEDULE,
        description: 'Расписание занятий',
        icon: CalendarDays,
      },
      {
        title: 'Мои дисциплины',
        href: ROUTES.MY_DISCIPLINES,
        description: 'Записанные дисциплины по семестрам',
        icon: BookOpen,
      },
      {
        title: 'Регистрация',
        href: ROUTES.STUDENT_REGISTRATION,
        description: 'Регистрация на дисциплины и потоки',
        icon: ClipboardList,
      },
      {
        title: 'Студенческий билет',
        href: ROUTES.STUDENT_TICKET,
        description: 'Цифровой студенческий билет',
        icon: GraduationCap,
      },
      {
        title: 'Анкетирование',
        href: ROUTES.STUDENT_SURVEYS,
        description: 'Опросы и анкеты для прохождения',
        icon: ClipboardCheck,
      },
      {
        title: 'Обращения',
        href: ROUTES.SUPPORT,
        description: 'Вопросы по приложению, учёбе и сервисам университета',
        icon: LifeBuoy,
      },
      {
        title: 'LMS',
        href: ROUTES.LMS,
        description: 'Moodle KSTU',
        icon: BookMarked,
        external: true,
      },
    ],
  },
];

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
        title: 'Обращения',
        href: ROUTES.APPEALS,
        description: 'Входящие обращения по приложению, учёбе и сервисам',
        icon: MessageSquare,
      },
      {
        title: 'Отчеты KPI',
        href: ROUTES.KPI_REPORTS,
        description: 'Ключевые показатели эффективности',
        icon: BarChart3,
        permission: KPI_REPORTS_PERMISSION,
      },
      {
        title: 'Приёмная комиссия',
        href: ROUTES.ABITURIENT_COMMISSION,
        description: 'Онлайн-сервис приёмной комиссии',
        icon: ClipboardList,
        permission: ABITURIENT_COMMISSION_PERMISSIONS,
        permissionMode: 'any',
        external: true,
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
        title: 'UDOC',
        href: ROUTES.UDOC,
        description: 'Рассылка приказов сотрудникам',
        icon: FileStack,
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
      {
        title: 'LMS',
        href: ROUTES.LMS,
        description: 'Moodle KSTU',
        icon: BookMarked,
        external: true,
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
        title: 'Табель',
        href: ROUTES.TABEL_REPORT,
        description: 'Отработанное время по подразделению',
        icon: Table2,
        permission: 'head_depart:tabel',
      },
      {
        title: 'Задачи',
        href: ROUTES.TASK_REPORTS,
        description: 'Сформировать отчеты по задачам',
        icon: BarChart3,
      },
      {
        title: 'Анкетирование',
        href: ROUTES.SURVEYS,
        description: 'Анкеты, банк вопросов и результаты',
        icon: ClipboardCheck,
      },
    ],
  },
  {
    title: 'Помощь',
    items: [
      {
        title: 'Обращения',
        href: ROUTES.SUPPORT,
        description: 'Вопросы по приложению, учёбе и сервисам университета',
        icon: LifeBuoy,
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

export function filterNavigationForContext(
  context: ProfileContext | null,
  permissions: readonly string[] | undefined
): NavSectionConfig[] {
  if (context === 'student') {
    return STUDENT_NAVIGATION_SECTIONS;
  }
  return filterNavigationForPermissions(permissions);
}
