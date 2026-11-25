import { ROUTES } from 'app/providers/routes';
import {
  BookMarked,
  Building2,
  ClipboardList,
  QrCode,
  Shield,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';
import type { ProfileContext } from 'shared/lib/auth-context';
import type { AppPermission } from 'shared/lib/permissions';
import {
  ABITURIENT_COMMISSION_PERMISSIONS,
  ADM_HR_SERVICE_PERMISSION,
  ADM_PERMISSIONS_ADMIN,
  hasPermission,
} from 'shared/lib/permissions';

export type LauncherAppId =
  | 'admissions'
  | 'hr'
  | 'adm-admin'
  | 'dormitory'
  | 'qr'
  | 'lms';

export type LauncherAppConfig = {
  id: LauncherAppId;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  /** Цвет плитки иконки */
  tone: string;
  /** Если не задано — видно всем авторизованным */
  permission?: AppPermission | readonly AppPermission[];
  permissionMode?: 'all' | 'any';
  /** Показывать студентам */
  student?: boolean;
  /** Показывать сотрудникам */
  employee?: boolean;
};

/** Отдел кадров: `adm:hr:service` или админ ADM `adm:permissions`. */
const HR_ACCESS_PERMISSIONS = [
  ADM_HR_SERVICE_PERMISSION,
  ADM_PERMISSIONS_ADMIN,
] as const;

/** Приёмная комиссия: права abiturient:* или админ ADM. */
const ADMISSIONS_ACCESS_PERMISSIONS = [
  ...ABITURIENT_COMMISSION_PERMISSIONS,
  ADM_PERMISSIONS_ADMIN,
] as const;

export const LAUNCHER_APPS: LauncherAppConfig[] = [
  {
    id: 'admissions',
    title: 'Приёмная комиссия',
    description: 'Онлайн-сервис приёмной комиссии',
    href: ROUTES.ABITURIENT_COMMISSION,
    icon: ClipboardList,
    tone: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
    permission: ADMISSIONS_ACCESS_PERMISSIONS,
    permissionMode: 'any',
    employee: true,
  },
  {
    id: 'hr',
    title: 'Отдел кадров',
    description: 'Кадровый учёт (adm.kstu.kg)',
    href: ROUTES.HR_DEPARTMENT,
    icon: UsersRound,
    tone: 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
    permission: HR_ACCESS_PERMISSIONS,
    permissionMode: 'any',
    employee: true,
  },
  {
    id: 'adm-admin',
    title: 'Администратор',
    description: 'Админ-панель ADM',
    href: ROUTES.ADM_PORTAL,
    icon: Shield,
    tone: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
    permission: ADM_PERMISSIONS_ADMIN,
    employee: true,
  },
  {
    id: 'dormitory',
    title: 'Общежитие',
    description: 'Портал общежития uPortal',
    href: ROUTES.DORMITORY,
    icon: Building2,
    tone: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    student: true,
    employee: true,
  },
  {
    id: 'qr',
    title: 'Аудитории',
    description: 'QR-сервис аудиторий',
    href: ROUTES.QR_AUDITORIUMS,
    icon: QrCode,
    tone: 'bg-teal-500/15 text-teal-600 dark:text-teal-400',
    student: true,
    employee: true,
  },
  {
    id: 'lms',
    title: 'LMS',
    description: 'Moodle KSTU',
    href: ROUTES.LMS,
    icon: BookMarked,
    tone: 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
    student: true,
    employee: true,
  },
];

export function filterLauncherApps(
  context: ProfileContext | null,
  permissions: readonly string[] | undefined
): LauncherAppConfig[] {
  return LAUNCHER_APPS.filter((app) => {
    if (context === 'student') {
      if (!app.student) return false;
    } else if (app.employee === false) {
      return false;
    }

    if (app.permission === undefined) return true;
    return hasPermission(
      permissions,
      app.permission,
      app.permissionMode ?? 'any'
    );
  });
}
