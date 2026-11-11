import { permissionLabel } from "./permission-labels";

type PermissionRef = { slug: string; label: string };

/** Нормализует активные права из GET /employees/{id}. */
export function parseEmployeePermissionSlugs(raw: unknown): string[] {
  if (!raw) return [];

  if (Array.isArray(raw)) {
    return [
      ...new Set(
        raw
          .map((item) => {
            if (typeof item === "string") return item.trim();
            if (item && typeof item === "object") {
              const row = item as Record<string, unknown>;
              return String(
                row.slug ??
                  row.permission_slug ??
                  row.code ??
                  row.name ??
                  row.label ??
                  row.title ??
                  ""
              ).trim();
            }
            return "";
          })
          .filter(Boolean)
      ),
    ];
  }

  if (typeof raw === "object") {
    const row = raw as Record<string, unknown>;
    return parseEmployeePermissionSlugs(
      row.permissions ??
        row.permission_slugs ??
        row.active_permissions ??
        row.permission_list
    );
  }

  return [];
}

/** Сопоставляет slug или русское название с элементом справочника. */
export function normalizePermissionSlugs(
  rawValues: readonly string[],
  catalog: readonly PermissionRef[]
): string[] {
  const bySlug = new Map(
    catalog.map((item) => [item.slug.trim().toLowerCase(), item.slug])
  );
  const byLabel = new Map(
    catalog.map((item) => [item.label.trim().toLowerCase(), item.slug])
  );

  const normalized: string[] = [];

  for (const raw of rawValues) {
    const value = raw.trim();
    if (!value) continue;

    const lower = value.toLowerCase();
    const bySlugHit = bySlug.get(lower);
    if (bySlugHit) {
      normalized.push(bySlugHit);
      continue;
    }

    const byLabelHit = byLabel.get(lower);
    if (byLabelHit) {
      normalized.push(byLabelHit);
      continue;
    }

    // Неизвестное право — оставляем как slug (если бэк отдал кастомный код).
    normalized.push(value);
  }

  return [...new Set(normalized)];
}

/** Только права из справочника; без дублей по label. */
export function sortPermissionOptions(
  catalog: readonly PermissionRef[]
): PermissionRef[] {
  return [...catalog].sort((a, b) => a.label.localeCompare(b.label, "ru"));
}

/** Label для slug вне справочника. */
export function permissionOptionLabel(
  slug: string,
  catalog: readonly PermissionRef[]
): string {
  return catalog.find((item) => item.slug === slug)?.label ?? permissionLabel(slug);
}
