// it-department/model/queries/index.ts

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchEmployeeDetail,
  fetchEmployees,
  fetchPermissionSelectOptions,
  resetEmployeePassword,
  syncUserPermissions,
} from "../api";
import {
  EmployeeDetail,
  EmployeeFilters,
  EmployeesResponse,
  ID,
} from "../types";


const KEYS = {
  list: (f: EmployeeFilters) =>
    ["it-dept", "employees", f.page ?? 1, f.size ?? 15, f.search ?? ""] as const,
  permissionOptions: () => ["it-dept", "permission-options"] as const,
  employeeDetail: (userId: ID | null) =>
    ["it-dept", "employee-detail", userId ?? "none"] as const,
};
/** Получение списка сотрудников */

export function useEmployees(filters: EmployeeFilters) {
  return useQuery<EmployeesResponse>({
    queryKey: KEYS.list(filters),
    queryFn: () => fetchEmployees(filters),
    placeholderData: keepPreviousData, // <-- вместо keepPreviousData: true
  });
}

export function useEmployeeDetail(userId: ID | null) {
  return useQuery<EmployeeDetail>({
    queryKey: KEYS.employeeDetail(userId),
    queryFn: () => fetchEmployeeDetail(userId as ID),
    enabled: userId != null,
  });
}

export function useResetPassword(filters: EmployeeFilters) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: ID) => resetEmployeePassword(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS.list(filters) }),
  });
}

export function usePermissionSelectOptions(enabled = true) {
  return useQuery({
    queryKey: KEYS.permissionOptions(),
    queryFn: fetchPermissionSelectOptions,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateUserPermissions(userId: ID | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      previous: string[];
      next: string[];
    }) => syncUserPermissions(userId!, payload.previous, payload.next),
    onSuccess: () => {
      if (userId != null) {
        void qc.invalidateQueries({ queryKey: KEYS.employeeDetail(userId) });
      }
    },
  });
}
