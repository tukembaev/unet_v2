import { apiUserClient } from "shared/config";
import { EmployeeDetail, EmployeeFilters, EmployeesResponse, ID } from "../types";
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
  const { data } = await apiUserClient.get<EmployeeDetail>(`employees/${userId}`);
  return data;
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
