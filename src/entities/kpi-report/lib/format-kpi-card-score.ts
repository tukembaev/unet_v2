/** Текст баллов для карточек институтов / кафедр (`score` приоритетнее `scores`). */
export function formatKpiCardScore(score: unknown, scoresFallback: unknown): string {
  const raw = score != null && score !== "" ? score : scoresFallback;
  if (raw == null || raw === "") return "—";
  const s = String(raw).trim();
  if (s.toLowerCase() === "none") return "0";
  return s;
}
