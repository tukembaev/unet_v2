/** Query-параметры `start` / `end` для KPI API (значения по умолчанию или из env). */
const DEFAULT_START = "2024-09-01";
const DEFAULT_END = "2026-09-01";

export function getKpiReportPeriod(): { start: string; end: string } {
  return {
    start: import.meta.env.VITE_KPI_REPORT_START?.trim() || DEFAULT_START,
    end: import.meta.env.VITE_KPI_REPORT_END?.trim() || DEFAULT_END,
  };
}
