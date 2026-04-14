import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import type { AvgKpiParams, EmployeeReportParams } from "../api";
import type {
  KpiDepartmentsReport,
  KpiDivisionItem,
  KpiInstituteReport,
  KpiReportTableRow,
} from "../types";
import type { AvgKpiNormalizedResponse } from "../../lib/normalize-avg-kpi";
import {
  getAvgKpiPage,
  getEmployeeReportPage,
  getKpiDepartmentsByInstitute,
  getKpiDivisionsList,
  getKpiInstitutes,
} from "../api";

export function useKpiInstitutionReport() {
  return useQuery<KpiInstituteReport[]>({
    queryKey: ["kpi-report", "institutes"],
    queryFn: getKpiInstitutes,
    staleTime: 2 * 60 * 1000,
  });
}

export function useDepartmentsKpi(
  instituteId: number | null
): UseQueryResult<KpiDepartmentsReport[], Error> {
  return useQuery<KpiDepartmentsReport[], Error>({
    queryKey: ["kpi-report", "departments", instituteId],
    queryFn: () => getKpiDepartmentsByInstitute(instituteId!),
    enabled: instituteId != null && instituteId > 0,
    staleTime: 2 * 60 * 1000,
  });
}

type PagedRows = { items: KpiReportTableRow[]; count: number };

export function useEmployeeReport(params: EmployeeReportParams) {
  return useQuery<PagedRows>({
    queryKey: ["kpi-report", "employee-report", params],
    queryFn: () => getEmployeeReportPage(params),
    placeholderData: (prev) => prev,
  });
}

export function useAvgKpiReport(params: AvgKpiParams) {
  return useQuery<AvgKpiNormalizedResponse>({
    queryKey: ["kpi-report", "avg-kpi", params],
    queryFn: () => getAvgKpiPage(params),
    enabled: Boolean(params.position?.trim()),
    placeholderData: (prev) => prev,
  });
}

export function useKpiDivisionsList() {
  return useQuery<KpiDivisionItem[]>({
    queryKey: ["kpi-report", "divisions"],
    queryFn: getKpiDivisionsList,
    staleTime: 10 * 60 * 1000,
  });
}

export type { EmployeeReportParams, AvgKpiParams } from "../api";
