
import { apiClient } from "shared/config";
import { EmployeeFilters, EmployeesResponse, EmployeeUpdatePayload, ID } from "../types";

/** Приводим фильтры к axios params */
function toParams(filters: EmployeeFilters) {
  const {
    search = "",
    page = 1,
    before_age = "",
    after_age = "",
    gender = "",
    position_id = "",
    citizen = "",
    stavka = "",
    national = "",
  } = filters;

  return {
    is_active: "True", // активные сотрудники
    page,
    search,
    before_age,
    after_age,
    gender,
    position_id,
    citizen,
    stavka,
    national,
  };
}

/** Получить активных сотрудников (проксирует старый /employees/is_active-false/?is_active=True...) */
export async function fetchEmployees(filters: EmployeeFilters): Promise<EmployeesResponse> {
  const { data } = await apiClient.get<EmployeesResponse>("/employees/is_active-false/", {
    params: toParams(filters),
  });
  return data;
}

/** Базовый patch сотрудника */
export async function updateEmployee(id: ID, payload: EmployeeUpdatePayload) {
  // старый путь: /employees/detail/${id}/  (обрати внимание на пробел в конце у старого кода — тут его нет)
  return apiClient.patch(`/employees/detail/${id}/`, payload);
}

/** Деактивировать (is_active: false) */
export async function deactivateEmployee(id: ID) {
  return apiClient.patch(`/employees/detail/${id}/`, { is_active: false });
}

/** Активировать (is_active: true) */
export async function activateEmployee(id: ID) {
  return apiClient.patch(`/employees/detail/${id}/`, { is_active: true });
}

/** Сбросить пароль */
export async function resetEmployeePassword(id: ID) {
  return apiClient.patch(`/employees/detail/${id}/`, { reset_password: true });
}

/** Сбросить ПИН */
export async function resetEmployeePin(id: ID) {
  return apiClient.patch(`/employees/detail/${id}/`, { reset_pin: true });
}

/* --- При необходимости быстро расширишь API ниже: --- */

// export async function getDivision() {
//   const { data } = await apiClient.get(`/division/`);
//   return data;
// }

// export async function getInstitute() {
//   const { data } = await apiClient.get(`/institute/`);
//   return data;
// }
