import { apiUserClient } from "shared/config";
import {
  EmployeeDetail,
  EmployeeFilters,
  EmployeesResponse,
  ID,
  PermissionOption,
  UpdateUserPermissionsPayload,
  UserPermissionsResponse,
} from "../types";
import { permissionLabel } from "../../lib/permission-labels";
import { parseEmployeePermissionSlugs } from "../../lib/parse-employee-permissions";
import { toast } from "sonner";

/** Приводим фильтры к axios params */
function toParams(filters: EmployeeFilters) {
  const { search = "", page = 1, size = 15 } = filters;
  return {
    page,
    size,
    search,
  };
}

/** Все сотрудники IT Department (`GET /api/v1/employees/`). */
export async function fetchEmployees(filters: EmployeeFilters): Promise<EmployeesResponse> {
  const { data } = await apiUserClient.get<EmployeesResponse>("employees/", {
    params: toParams(filters),
  });
  return data;
}

/** Детальный профиль сотрудника (`GET /api/v1/employees/{user_id}`). */
export async function fetchEmployeeDetail(userId: ID): Promise<EmployeeDetail> {
  const { data } = await apiUserClient.get<Record<string, unknown>>(
    `employees/${userId}`
  );
  const permissions = parseEmployeePermissionSlugs(data);
  return { ...(data as unknown as EmployeeDetail), permissions };
}

/** Сброс пароля (`POST /api/v1/users/{user_id}/reset-password`). */
export async function resetEmployeePassword(id: ID) {
  try {
    const response = await apiUserClient.post(`users/${id}/reset-password`, {});
    toast.success("Новый пароль отправлен сотруднику");
    return response;
  } catch (error: any) {
    const status = error?.response?.status || "неизвестная ошибка";
    toast.error(`Ошибка при сбросе пароля (${status})`);
    throw error;
  }
}

function normalizePermissionOptions(raw: unknown): PermissionOption[] {
  const rows = Array.isArray(raw)
    ? raw
    : raw &&
        typeof raw === "object" &&
        "results" in raw &&
        Array.isArray((raw as { results: unknown }).results)
      ? (raw as { results: unknown[] }).results
      : [];

  return rows
    .map((row: Record<string, unknown>) => {
      const slug = String(row.slug ?? row.value ?? row.id ?? "").trim();
      if (!slug) return null;
      const label = permissionLabel(
        slug,
        String(row.label ?? row.name ?? row.title ?? "")
      );
      return { slug, label };
    })
    .filter((item): item is PermissionOption => item != null);
}

/** Справочник прав для выдачи (`GET /users/permissions/select`). */
export async function fetchPermissionSelectOptions(): Promise<PermissionOption[]> {
  const { data } = await apiUserClient.get<unknown>("users/permissions/select");
  return normalizePermissionOptions(data);
}

/** Выдать права пользователю (`POST /users/{user_id}/permissions`). */
export async function addUserPermissions(
  userId: ID,
  payload: UpdateUserPermissionsPayload
): Promise<UserPermissionsResponse> {
  const { data } = await apiUserClient.post<UserPermissionsResponse>(
    `users/${userId}/permissions`,
    payload
  );
  return {
    permission_slugs: Array.isArray(data?.permission_slugs)
      ? data.permission_slugs.map(String)
      : payload.permission_slugs,
  };
}

/** Снять права пользователя (`DELETE /users/{user_id}/permissions`). */
export async function removeUserPermissions(
  userId: ID,
  payload: UpdateUserPermissionsPayload
): Promise<UserPermissionsResponse> {
  const { data } = await apiUserClient.delete<UserPermissionsResponse>(
    `users/${userId}/permissions`,
    { data: payload }
  );
  return {
    permission_slugs: Array.isArray(data?.permission_slugs)
      ? data.permission_slugs.map(String)
      : payload.permission_slugs,
  };
}

/** Синхронизирует права: POST для новых, DELETE для снятых. */
export async function syncUserPermissions(
  userId: ID,
  previousSlugs: readonly string[],
  nextSlugs: readonly string[]
): Promise<void> {
  const previous = new Set(previousSlugs);
  const next = new Set(nextSlugs);

  const toAdd = nextSlugs.filter((slug) => !previous.has(slug));
  const toRemove = previousSlugs.filter((slug) => !next.has(slug));

  const requests: Promise<unknown>[] = [];

  if (toAdd.length > 0) {
    requests.push(addUserPermissions(userId, { permission_slugs: [...toAdd] }));
  }

  if (toRemove.length > 0) {
    requests.push(
      removeUserPermissions(userId, { permission_slugs: [...toRemove] })
    );
  }

  await Promise.all(requests);
}
