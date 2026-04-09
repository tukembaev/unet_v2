import type { AppPermission } from './keys';

export type PermissionCheck =
  | AppPermission
  | readonly AppPermission[]
  | undefined;

/**
 * Полный доступ (если бэкенд когда-нибудь отдаст wildcard).
 */
function hasWildcard(permissions: readonly string[]): boolean {
  return permissions.some((p) => p === '*' || p === 'all' || p === 'superuser');
}

/**
 * Проверка одного или нескольких прав.
 * @param mode `any` — достаточно одного из списка; `all` — нужны все (для массива).
 */
export function hasPermission(
  userPermissions: readonly string[] | undefined,
  required: PermissionCheck,
  mode: 'all' | 'any' = 'all'
): boolean {
  const list = userPermissions ?? [];
  if (!required) return true;
  if (hasWildcard(list)) return true;

  if (typeof required === 'string') {
    return list.includes(required);
  }

  if (required.length === 0) return true;

  if (mode === 'any') {
    return required.some((p) => list.includes(p));
  }
  return required.every((p) => list.includes(p));
}
