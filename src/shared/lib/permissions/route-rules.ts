import { matchPath } from 'react-router-dom';
import {
  EDUCATION_DEPARTMENT_PERMISSIONS,
  IT_DEPARTMENT_PERMISSION,
  KPI_REPORTS_PERMISSION,
  type AppPermission,
} from './keys';
import { hasPermission } from './check';

/** Одно право или «любое из списка». */
export type RouteRule =
  | { pathPattern: string; permission: AppPermission }
  | { pathPattern: string; anyOf: readonly AppPermission[] };

export type RouteAccessRequirement =
  | { kind: 'one'; permission: AppPermission }
  | { kind: 'anyOf'; permissions: readonly AppPermission[] }
  | undefined;

/**
 * Порядок важен: более специфичные шаблоны выше.
 * Не перечисленные пути — любой авторизованный.
 */
export const ROUTE_PERMISSION_RULES: RouteRule[] = [
  { pathPattern: '/education/department-disciplines', permission: 'discipline_department' },
  { pathPattern: '/education/workload', permission: 'education_department:workload' },
  { pathPattern: '/education/streams', permission: 'streams' },
  { pathPattern: '/education/stream/*', permission: 'streams' },
  { pathPattern: '/education/curriculum/*', permission: 'work_plan' },
  { pathPattern: '/education/curriculum', permission: 'work_plan' },
  { pathPattern: '/report-syllabus/*', permission: 'work_plan' },
  { pathPattern: '/education-management', anyOf: EDUCATION_DEPARTMENT_PERMISSIONS },
  { pathPattern: '/structure/it-department', permission: IT_DEPARTMENT_PERMISSION },
  { pathPattern: '/kpi-reports', permission: KPI_REPORTS_PERMISSION },
];

export function getRequiredPermissionForPath(pathname: string): RouteAccessRequirement {
  const normalized =
    pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;

  for (const rule of ROUTE_PERMISSION_RULES) {
    const m = matchPath({ path: rule.pathPattern, end: false }, normalized);
    if (m) {
      if ('anyOf' in rule) {
        return { kind: 'anyOf', permissions: rule.anyOf };
      }
      return { kind: 'one', permission: rule.permission };
    }
  }
  return undefined;
}

export function canAccessPath(
  pathname: string,
  userPermissions: readonly string[] | undefined
): boolean {
  const req = getRequiredPermissionForPath(pathname);
  if (!req) return true;
  if (req.kind === 'anyOf') {
    return hasPermission(userPermissions, req.permissions, 'any');
  }
  return hasPermission(userPermissions, req.permission);
}
