// it-department/model/queries/index.ts

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { activateEmployee, deactivateEmployee, fetchEmployees, resetEmployeePassword, resetEmployeePin, updateEmployee } from "../api";
import { EmployeeFilters, EmployeeUpdatePayload, EmployeesResponse, ID } from "../types";


const KEYS = {
  list: (f: EmployeeFilters) =>
    ["it-dept", "employees", f.page ?? 1, f.search ?? "", f.before_age, f.after_age, f.gender, f.position_id, f.citizen, f.stavka, f.national] as const,
};
/** Получение списка сотрудников */

export function useEmployees(filters: EmployeeFilters) {
  return useQuery<EmployeesResponse>({
    queryKey: KEYS.list(filters),
    queryFn: () => fetchEmployees(filters),
    placeholderData: keepPreviousData, // <-- вместо keepPreviousData: true
  });
}
/** Обновление контактов */
export function useUpdateEmployee(filters: EmployeeFilters) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: ID; payload: EmployeeUpdatePayload }) =>
      updateEmployee(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.list(filters) }),
  });
}

export function useDeactivateEmployee(filters: EmployeeFilters) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: ID) => deactivateEmployee(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.list(filters) }),
  });
}

export function useActivateEmployee(filters: EmployeeFilters) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: ID) => activateEmployee(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.list(filters) }),
  });
}

export function useResetPassword(filters: EmployeeFilters) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: ID) => resetEmployeePassword(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.list(filters) }),
  });
}

export function useResetPin(filters: EmployeeFilters) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: ID) => resetEmployeePin(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.list(filters) }),
  });
}
