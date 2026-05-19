/** Нормализует profile_id из API или из сегмента URL. */
export function parseSyllabusProfileId(
  value: number | string | null | undefined
): number | undefined {
  if (value == null || value === "undefined" || value === "null") return undefined;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}
