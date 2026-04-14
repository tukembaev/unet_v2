import type { KpiReportTableRow } from "../model/types";

/** Строка ответа `GET /avg-kpi/` (как в предыдущем фронте). */
export function normalizeAvgKpiRow(raw: unknown): KpiReportTableRow {
  if (!raw || typeof raw !== "object") return {};
  const r = raw as Record<string, unknown>;

  const out: KpiReportTableRow = {
    id: r.user_id ?? r.id,
    full_name: r.label,
    name: r.label,
    avatar_url: r.photo,
    division: r.division,
    staff_position: r.division,
  };

  if (r.score != null) out.score = r.score;

  const crit = r.criteria;
  if (Array.isArray(crit)) {
    crit.forEach((v, i) => {
      out[`b_${i + 1}`] = v;
    });
  }

  return out;
}

export type AvgKpiNormalizedResponse = {
  items: KpiReportTableRow[];
  count: number;
  avgScore: number | null;
};

export function normalizeAvgKpiResponse(data: unknown): AvgKpiNormalizedResponse {
  let avgScore: number | null = null;
  let count = 0;
  let results: unknown[] = [];

  if (Array.isArray(data)) {
    results = data;
    count = data.length;
  } else if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    const av = d.avg_score;
    if (typeof av === "number" && Number.isFinite(av)) avgScore = av;
    else if (typeof av === "string" && av.trim()) {
      const n = parseFloat(av);
      if (!Number.isNaN(n)) avgScore = n;
    }

    if (Array.isArray(d.results)) {
      results = d.results;
      count = typeof d.count === "number" ? d.count : results.length;
    } else if (typeof d.count === "number") {
      count = d.count;
    }
  }

  const items = results.map(normalizeAvgKpiRow);
  if (!count) count = items.length;

  return { items, count, avgScore };
}
