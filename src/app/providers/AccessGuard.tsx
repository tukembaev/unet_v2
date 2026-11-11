import { useCurrentUser } from 'entities/user/model/queries';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from 'app/providers/routes';
import { canAccessPath } from 'shared/lib/permissions';
import {
  getActiveContext,
  getAppHomePath,
  hasActiveContext,
} from 'shared/lib/auth-context';
import { Skeleton } from 'shared/ui';

/** Пути, доступные в контексте студента. */
const STUDENT_ALLOWED_PREFIXES = [
  ROUTES.SCHEDULE,
  ROUTES.HOME,
  ROUTES.PERSONAL_CARD,
  ROUTES.ABOUT,
  ROUTES.STUDENT_REGISTRATION,
  ROUTES.MY_DISCIPLINES,
  ROUTES.STUDENT_TICKET,
] as const;

function isStudentAllowedPath(pathname: string): boolean {
  const normalized =
    pathname.endsWith('/') && pathname.length > 1
      ? pathname.slice(0, -1)
      : pathname;

  return STUDENT_ALLOWED_PREFIXES.some(
    (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`)
  );
}

/**
 * Ограничение дочерних маршрутов по контексту профиля и `permissions`.
 */
export function AccessGuard() {
  const location = useLocation();
  const { data: user, isLoading, isError } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="space-y-3 p-3 sm:p-6">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (isError || !user) {
    return <Navigate to={ROUTES.AUTH} replace state={{ from: location.pathname }} />;
  }

  if (!hasActiveContext()) {
    return <Navigate to={ROUTES.AUTH} replace state={{ from: location.pathname }} />;
  }

  const context = getActiveContext();

  if (context === 'student') {
    if (location.pathname === ROUTES.HOME) {
      return <Navigate to={ROUTES.SCHEDULE} replace />;
    }
    if (!isStudentAllowedPath(location.pathname)) {
      return <Navigate to={ROUTES.SCHEDULE} replace />;
    }
    return <Outlet />;
  }

  if (!canAccessPath(location.pathname, user.permissions)) {
    return <Navigate to={getAppHomePath('employee')} replace />;
  }

  return <Outlet />;
}
