/** Коды уровня образования для POST/PATCH РУП и дисциплин кафедры */
export const LEVEL_EDUCATION_OPTIONS = [
  { value: "bachelor", label: "Бакалавр" },
  { value: "master", label: "Магистр" },
  { value: "phd", label: "PhD" },
  { value: "specialist", label: "Специалист" },
  { value: "technic", label: "СПО(техник)" },
] as const;

export type LevelEducationValue =
  (typeof LEVEL_EDUCATION_OPTIONS)[number]["value"];

export function normalizeLevelEducationValue(
  raw: string | null | undefined
): LevelEducationValue | "" {
  const normalized = (raw ?? "").trim().toLowerCase();
  if (!normalized) return "";

  const byValue = LEVEL_EDUCATION_OPTIONS.find(
    (o) => o.value.toLowerCase() === normalized
  );
  if (byValue) return byValue.value;

  const byLabel = LEVEL_EDUCATION_OPTIONS.find(
    (o) => o.label.toLowerCase() === normalized
  );
  if (byLabel) return byLabel.value;

  if (normalized.includes("бакалавр")) return "bachelor";
  if (normalized.includes("магистр") || normalized.includes("магистратур")) {
    return "master";
  }
  if (normalized.includes("phd") || normalized.includes("аспирант")) {
    return "phd";
  }
  if (normalized.includes("специалист") || normalized.includes("специалитет")) {
    return "specialist";
  }
  if (
    normalized.includes("техник") ||
    normalized.includes("спо") ||
    normalized.includes("среднее профессиональн")
  ) {
    return "technic";
  }

  return "";
}

/** Код уровня для POST/PATCH: bachelor | master | phd | specialist | technic */
export function levelEducationPayloadValue(value: string): string {
  const normalized = normalizeLevelEducationValue(value);
  return normalized || value;
}
