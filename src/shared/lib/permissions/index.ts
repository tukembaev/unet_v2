export type { AppPermission } from './keys';
export {
  APP_PERMISSIONS,
  ABITURIENT_COMMISSION_PERMISSIONS,
  ADM_COS_SERVICE_PERMISSION,
  ADM_HR_SERVICE_PERMISSION,
  ADM_PERMISSIONS_ADMIN,
  ADM_SUPPORT_SERVICE_PERMISSION,
  ANTIPLAG_PERMISSION,
  EDUCATION_DEPARTMENT_PERMISSIONS,
  HR_DEPARTMENT_PERMISSION,
  IT_DEPARTMENT_PERMISSION,
  KPI_REPORTS_PERMISSION,
  isAppPermission,
} from './keys';
export { hasPermission, type PermissionCheck } from './check';
export {
  ROUTE_PERMISSION_RULES,
  getRequiredPermissionForPath,
  canAccessPath,
  type RouteRule,
  type RouteAccessRequirement,
} from './route-rules';
