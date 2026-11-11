export const FORM_EDUCATION_OPTIONS = [
  { value: "full_time", label: "Очная" },
  { value: "dual", label: "Очная (Дуальная)" },
  { value: "part_time", label: "Заочная" },
] as const;

export type FormEducationValue = (typeof FORM_EDUCATION_OPTIONS)[number]["value"];

export function normalizeFormEducationValue(
  raw: string | null | undefined
): FormEducationValue | "" {
  const normalized = (raw ?? "").trim().toLowerCase();
  if (!normalized) return "";

  const byValue = FORM_EDUCATION_OPTIONS.find(
    (o) => o.value.toLowerCase() === normalized
  );
  if (byValue) return byValue.value;

  const byLabel = FORM_EDUCATION_OPTIONS.find(
    (o) => o.label.toLowerCase() === normalized
  );
  if (byLabel) return byLabel.value;

  if (normalized.includes("дуальн") || normalized === "full_time_dual") {
    return "dual";
  }
  if (normalized.includes("заоч")) return "part_time";
  if (normalized.includes("очн")) return "full_time";

  return "";
}

export function formEducationLabelByValue(value: string): string {
  return (
    FORM_EDUCATION_OPTIONS.find((o) => o.value === value)?.label ?? value
  );
}

/** Код формы обучения для POST/PATCH: full_time | dual | part_time */
export function formEducationPayloadValue(value: string): string {
  const normalized = normalizeFormEducationValue(value);
  return normalized || value;
}
