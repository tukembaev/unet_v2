// it-department/model/queries/index.ts

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchEmployeeDetail, fetchEmployees, resetEmployeePassword } from "../api";
import { EmployeeDetail, EmployeeFilters, EmployeesResponse, ID } from "../types";


const KEYS = {
  list: (f: EmployeeFilters) =>
    ["it-dept", "employees", f.page ?? 1, f.size ?? 15, f.search ?? ""] as const,
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
    queryKey: ["it-dept", "employee-detail", userId],
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
