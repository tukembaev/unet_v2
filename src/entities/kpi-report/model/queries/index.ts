import { useQuery } from "@tanstack/react-query";
import { fetchDepartmentsKpi, KpiInstitutions } from "../api";

export function useKpiInstitutionReport() {
  return useQuery({
    queryKey: ['institutions-kpi-report'],
    queryFn: KpiInstitutions,
  });
}
export function useDepartmentsKpi(id: number) {
  return useQuery({
    queryKey: ['departments-kpi-report', id],
    queryFn: fetchDepartmentsKpi.bind(null, id),
    enabled: !!id,
  });
}