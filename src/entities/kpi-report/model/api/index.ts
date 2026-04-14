import { apiClient } from "shared/config";
import { normalizeAvgKpiResponse } from "../../lib/normalize-avg-kpi";
import { getKpiReportPeriod } from "../../lib/report-period";
import { normalizePaginated } from "../../lib/normalize-paginated";
import type {
  KpiDepartmentsReport,
  KpiDivisionItem,
  KpiInstituteReport,
  KpiReportTableRow,
} from "../types";

function periodParams() {
  const { start, end } = getKpiReportPeriod();
  return { start, end };
}

/** Институты KPI (`GET /institutes/`). */
export async function getKpiInstitutes(): Promise<KpiInstituteReport[]> {
  const { data } = await apiClient.get<KpiInstituteReport[]>("institutes/");
  return Array.isArray(data) ? data : [];
}

/** Кафедры института (`GET /department/{id}/`). */
export async function getKpiDepartmentsByInstitute(
  instituteId: number
): Promise<KpiDepartmentsReport[]> {
  const { start, end } = periodParams();
  const { data } = await apiClient.get<KpiDepartmentsReport[]>(
    `department/${instituteId}/`,
    { params: { start, end } }
  );
  return Array.isArray(data) ? data : [];
}

export type EmployeeReportParams = {
  page?: number;
  search?: string;
  department?: string;
};

export type KpiEmployeePublicationResponse = Array<{
  id: number;
  title: string;
  category?: Array<{
    id: number;
    title: string;
    kpi?: Array<{
      id: number;
      title?: string;
      status?: string;
      published?: string;
      description?: string;
      rejection_reason?: string | null;
      country?: string;
      link?: string;
      files?: Array<{ id: number; file: string }>;
      kpi_authors?: Array<{ user_id?: number; employee_name?: string; photo?: string }>;
    }>;
  }>;
}>;

/** Все сотрудники — отчёт (`GET /employee-report/`). */
export async function getEmployeeReportPage(
  params: EmployeeReportParams = {}
): Promise<{ items: KpiReportTableRow[]; count: number }> {
  const { start, end } = periodParams();
  const { data } = await apiClient.get<unknown>("employee-report/", {
    params: {
      start,
      end,
      page: params.page ?? 1,
      search: params.search?.trim() || undefined,
      department: params.department?.trim() || undefined,
    },
  });
  return normalizePaginated<KpiReportTableRow>(data);
}

/** Личные KPI-публикации сотрудника (`GET /kpi-employee/{id}/`). */
export async function getKpiEmployeePublications(
  employeeId: number
): Promise<KpiEmployeePublicationResponse> {
  const { data } = await apiClient.get<unknown>(`kpi-employee/${employeeId}/`);
  return Array.isArray(data) ? (data as KpiEmployeePublicationResponse) : [];
}

export type PatchKpiInfoPayload = {
  status: "В ожидании" | "Подтверждено" | "Отказано";
  rejection_reason?: string;
};

/** Обновить статус KPI записи (`PATCH /kpi-info/{id}/`). */
export async function patchKpiInfoStatus(kpiId: number, payload: PatchKpiInfoPayload) {
  const { data } = await apiClient.patch(`kpi-info/${kpiId}/`, payload);
  return data;
}

/** DOCX: сотрудники кафедры (`GET /employee-report/docx/`). */
export async function downloadEmployeeReportDocx(params: {
  departmentId: number;
  search?: string;
}): Promise<Blob> {
  const { start, end } = periodParams();
  const { data } = await apiClient.get<Blob>("employee-report/docx/", {
    params: {
      start,
      end,
      department: params.departmentId,
      search: params.search?.trim() || undefined,
    },
    responseType: "blob",
  });
  return data;
}

export type AvgKpiParams = {
  page?: number;
  search?: string;
  /**
   * Категория для query `p` (как в старом проекте):
   * «Преподаватели», «Старшие преподаватели», «Доценты», «Профессоры».
   */
  position?: string;
};

/** Выше среднего балла (`GET /avg-kpi/`). */
export async function getAvgKpiPage(params: AvgKpiParams = {}) {
  const { start, end } = periodParams();
  const { data } = await apiClient.get<unknown>("avg-kpi/", {
    params: {
      start,
      end,
      page: params.page ?? 1,
      search: params.search?.trim() || undefined,
      p: params.position?.trim() || undefined,
    },
  });
  return normalizeAvgKpiResponse(data);
}

/** Подразделения для фильтров (`GET /divisions/`). */
export async function getKpiDivisionsList(): Promise<KpiDivisionItem[]> {
  const { data } = await apiClient.get<unknown>("divisions/");
  if (Array.isArray(data)) return data as KpiDivisionItem[];
  const norm = normalizePaginated<KpiDivisionItem>(data);
  return norm.items;
}

/** Центры (`GET /centers/`) — для будущих экранов / расширения. */
export async function getKpiCentersList(): Promise<KpiDivisionItem[]> {
  const { data } = await apiClient.get<unknown>("centers/");
  if (Array.isArray(data)) return data as KpiDivisionItem[];
  const norm = normalizePaginated<KpiDivisionItem>(data);
  return norm.items;
}

/** Скачать DOCX: средний балл. */
export async function downloadAvgKpiDocx(params: {
  position?: string;
  search?: string;
}): Promise<Blob> {
  const { start, end } = periodParams();
  const { data } = await apiClient.get<Blob>("avg-kpi/docx/", {
    params: {
      start,
      end,
      page: 1,
      search: params.search?.trim() || undefined,
      p: params.position?.trim() || undefined,
    },
    responseType: "blob",
  });
  return data;
}
