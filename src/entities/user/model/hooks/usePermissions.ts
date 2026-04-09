import { useCallback, useMemo } from 'react';
import { useCurrentUser } from '../queries';
import { hasPermission, canAccessPath, type PermissionCheck } from 'shared/lib/permissions';
import type { AppPermission } from 'shared/lib/permissions';

const EMPTY: readonly string[] = [];

/**
 * Права из `GET users/me` → `permissions` для UI и проверок.
 */
export function usePermissions() {
  const { data: user, isLoading, isError } = useCurrentUser();

  const permissions = user?.permissions ?? EMPTY;

  const can = useCallback(
    (required: PermissionCheck, mode?: 'all' | 'any') =>
      hasPermission(permissions, required, mode),
    [permissions]
  );

  const canAccessRoute = useCallback(
    (pathname: string) => canAccessPath(pathname, permissions),
    [permissions]
  );

  const permissionSet = useMemo(
    () => new Set(permissions),
    [permissions]
  );

  return {
    user,
    permissions,
    permissionSet,
    isLoading,
    isError,
    can,
    canAccessRoute,
    has: (p: AppPermission) => permissionSet.has(p),
  };
}
