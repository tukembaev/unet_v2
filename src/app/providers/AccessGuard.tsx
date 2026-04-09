import { useCurrentUser } from 'entities/user/model/queries';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from 'app/providers/routes';
import { canAccessPath } from 'shared/lib/permissions';
import { Skeleton } from 'shared/ui';

/**
 * Ограничение дочерних маршрутов по `permissions` (см. `src/shared/lib/permissions/route-rules.ts`).
 */
export function AccessGuard() {
  const location = useLocation();
  const { data: user, isLoading, isError } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="space-y-3 p-6">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (isError || !user) {
    return <Navigate to={ROUTES.AUTH} replace state={{ from: location.pathname }} />;
  }

  if (!canAccessPath(location.pathname, user.permissions)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <Outlet />;
}
