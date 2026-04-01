
import { apiClient } from "shared/config";
import { EmployeeFilters, EmployeesResponse, EmployeeUpdatePayload, ID } from "../types";
import { toast } from "sonner";

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
  try {
    const response = await apiClient.patch(`/employees/detail/${id}/`, payload);
    toast.success('Данные сотрудника успешно обновлены');
    return response;
  } catch (error: any) {
    const status = error?.response?.status || 'неизвестная ошибка';
    toast.error(`Ошибка при обновлении данных сотрудника (${status})`);
    throw error;
  }
}

/** Деактивировать (is_active: false) */
export async function deactivateEmployee(id: ID) {
  try {
    const response = await apiClient.patch(`/employees/detail/${id}/`, { is_active: false });
    toast.success('Сотрудник успешно деактивирован');
    return response;
  } catch (error: any) {
    const status = error?.response?.status || 'неизвестная ошибка';
    toast.error(`Ошибка при деактивации сотрудника (${status})`);
    throw error;
  }
}

/** Активировать (is_active: true) */
export async function activateEmployee(id: ID) {
  try {
    const response = await apiClient.patch(`/employees/detail/${id}/`, { is_active: true });
    toast.success('Сотрудник успешно активирован');
    return response;
  } catch (error: any) {
    const status = error?.response?.status || 'неизвестная ошибка';
    toast.error(`Ошибка при активации сотрудника (${status})`);
    throw error;
  }
}

/** Сбросить пароль */
export async function resetEmployeePassword(id: ID) {
  try {
    const response = await apiClient.patch(`/employees/detail/${id}/`, { reset_password: true });
    toast.success('Пароль сотрудника успешно сброшен');
    return response;
  } catch (error: any) {
    const status = error?.response?.status || 'неизвестная ошибка';
    toast.error(`Ошибка при сбросе пароля (${status})`);
    throw error;
  }
}

/** Сбросить ПИН */
export async function resetEmployeePin(id: ID) {
  try {
    const response = await apiClient.patch(`/employees/detail/${id}/`, { reset_pin: true });
    toast.success('ПИН сотрудника успешно сброшен');
    return response;
  } catch (error: any) {
    const status = error?.response?.status || 'неизвестная ошибка';
    toast.error(`Ошибка при сбросе ПИН (${status})`);
    throw error;
  }
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
