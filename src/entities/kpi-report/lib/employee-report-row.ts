import type { KpiReportTableRow } from "../model/types";

const NESTED_ROW_KEYS = ["employee", "user", "profile", "staff", "person"] as const;

const NAME_KEYS = [
  "full_name",
  "fio",
  "name",
  "employee_name",
  "user_name",
  "fullname",
  "fullName",
  "short_name",
  "display_name",
  "label",
  "title",
] as const;

const AVATAR_KEYS = ["avatar_url", "avatar", "photo", "image", "img", "picture"] as const;

const POSITION_KEYS = [
  "division",
  "structure",
  "position",
  "job_title",
  "dolzhnost",
  "post",
  "staff_position",
  "job",
  "title_position",
] as const;

/** Для итоговых баллов (дробь), не путать с объектом `scores` по критериям. */
const SCORE_KEYS = ["score", "scores", "ball", "points", "total_scores", "total_score"] as const;

/** Минимум колонок критериев в таблице (B-1 … B-5), как в макете. */
export const KPI_CRITERION_COLUMNS_MIN = 5;

/** Ключи полей, не показываемые как метрики B-* */
const META_KEY_REGEX =
  /^(id|pk|uuid|email|phone|username|department|departament|faculty|institute|organization|created|updated|password)/i;

function pickStr(row: KpiReportTableRow, ...keys: string[]): string {
  for (const k of keys) {
    const v = row[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

/** Контекст строки: вложенные объекты сотрудника + сама строка (приоритет у корня). */
export function mergeEmployeeRowContext(row: KpiReportTableRow): KpiReportTableRow {
  const nested: Record<string, unknown>[] = [];
  for (const k of NESTED_ROW_KEYS) {
    const v = row[k];
    if (v && typeof v === "object" && !Array.isArray(v)) {
      nested.push(v as Record<string, unknown>);
    }
  }
  return Object.assign({}, ...nested, row);
}

export function getEmployeeDisplayName(row: KpiReportTableRow): string {
  const ctx = mergeEmployeeRowContext(row);
  for (const k of NAME_KEYS) {
    const v = ctx[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  const ln = pickStr(ctx, "last_name", "lastname", "family_name", "surname", "фамилия");
  const fn = pickStr(ctx, "first_name", "firstname", "given_name", "имя");
  const mn = pickStr(ctx, "middle_name", "patronymic", "patronymic_name", "отчество");
  if (ln || fn) {
    const composed = [ln, fn, mn].filter(Boolean).join(" ").trim();
    if (composed) return composed;
  }
  return "—";
}

export function getEmployeeAvatarUrl(row: KpiReportTableRow): string | undefined {
  const ctx = mergeEmployeeRowContext(row);
  for (const k of AVATAR_KEYS) {
    const v = ctx[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
}

export function getEmployeePosition(row: KpiReportTableRow): string {
  const ctx = mergeEmployeeRowContext(row);
  for (const k of POSITION_KEYS) {
    const v = ctx[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "—";
}

/** Только набранные баллы: из «a/b» берётся «a», без «потенциала». */
export function formatEarnedOnly(value: unknown): string {
  if (value == null || value === "") return "0";
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "—";
  if (typeof value === "object") return "—";
  const s = String(value).trim();
  if (!s) return "0";
  const slash = s.indexOf("/");
  if (slash !== -1) {
    const left = s.slice(0, slash).trim();
    return left || "0";
  }
  return s;
}

/** Итоговые баллы по строке (только набранное). */
export function getEarnedScoreDisplay(row: KpiReportTableRow): string {
  const ctx = mergeEmployeeRowContext(row);
  const obt = pickStr(ctx, "score_obtained", "points_obtained", "obtained", "earned");
  if (obt) return formatEarnedOnly(obt);

  for (const k of SCORE_KEYS) {
    const raw = row[k] ?? ctx[k];
    if (raw == null || typeof raw === "object") continue;
    const s = String(raw).trim();
    if (s) return formatEarnedOnly(raw);
  }
  return "—";
}

function metricIndexFromKey(key: string): number | null {
  const k = key.trim();
  const patterns = [
    /^b[_-]?(\d+)$/i,
    /^kpi[_-]?(\d+)$/i,
    /^criterion[_-]?(\d+)$/i,
    /^criteria[_-]?(\d+)$/i,
    /^crit[_-]?(\d+)$/i,
    /^crit(\d+)$/i,
    /^c[_-](\d+)$/i,
    /^c(\d+)$/i,
    /^cat[_-]?(\d+)$/i,
    /^metric[_-]?(\d+)$/i,
  ];
  for (const re of patterns) {
    const m = k.match(re);
    if (m) return parseInt(m[1], 10);
  }
  if (/^\d+$/.test(k)) {
    const n = parseInt(k, 10);
    if (n >= 1 && n <= 99) return n;
  }
  return null;
}

/** Плоский вид строки для поиска колонок-критериев (в т.ч. внутри `scores`). */
export function flatMetricsSource(row: KpiReportTableRow): KpiReportTableRow {
  const base = mergeEmployeeRowContext(row);
  const out: KpiReportTableRow = { ...base };

  const mergeNested = (obj: unknown) => {
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return;
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      if (!(k in out) || out[k] == null || out[k] === "") {
        out[k] = v;
      }
    }
  };

  mergeNested(row.scores);
  mergeNested(row.criteria_scores);
  mergeNested(row.criterion_scores);
  mergeNested(row.kpi_scores);
  mergeNested(row.criteria);

  return out;
}

export function getMetricCellValue(row: KpiReportTableRow, key: string): unknown {
  const vTop = row[key];
  if (vTop != null && vTop !== "") return vTop;

  const sc = row.scores;
  if (sc && typeof sc === "object" && !Array.isArray(sc) && key in sc) {
    return (sc as Record<string, unknown>)[key];
  }
  for (const nestKey of ["criteria_scores", "criterion_scores", "kpi_scores", "criteria"] as const) {
    const o = row[nestKey];
    if (o && typeof o === "object" && !Array.isArray(o) && key in o) {
      return (o as Record<string, unknown>)[key];
    }
  }

  const ctx = mergeEmployeeRowContext(row);
  const vCtx = ctx[key];
  if (vCtx != null && vCtx !== "") return vCtx;

  return undefined;
}

export function pickBKpiColumnKeys(rows: KpiReportTableRow[]): string[] {
  const keys = new Set<string>();
  for (const row of rows) {
    const src = flatMetricsSource(row);
    for (const k of Object.keys(src)) {
      if (META_KEY_REGEX.test(k)) continue;
      if (metricIndexFromKey(k) != null) keys.add(k);
    }
  }

  const byIndex = new Map<number, string>();
  for (const k of keys) {
    const n = metricIndexFromKey(k);
    if (n != null && !byIndex.has(n)) byIndex.set(n, k);
  }

  let maxN = KPI_CRITERION_COLUMNS_MIN;
  for (const n of byIndex.keys()) {
    if (n > maxN) maxN = n;
  }

  const result: string[] = [];
  for (let n = 1; n <= maxN; n++) {
    result.push(byIndex.get(n) ?? `b_${n}`);
  }
  return result;
}

export function formatCriterionColumnHeader(key: string): string {
  const n = metricIndexFromKey(key);
  return n != null ? `B-${n}` : key.toUpperCase();
}

export function formatMetricCell(value: unknown): string {
  if (value == null || value === "") return "0";
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "—";
  if (typeof value === "object") return "—";
  return String(value);
}

/** Балл по критерию в ячейке — без максимума из дроби. */
export function formatCriterionCell(value: unknown): string {
  return formatEarnedOnly(value);
}
