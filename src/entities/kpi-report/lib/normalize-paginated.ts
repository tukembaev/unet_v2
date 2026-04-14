/** Ответы DRF: `{ results, count }` или просто массив. */
export type PaginatedPayload<T> = {
  results?: T[];
  count?: number;
  next?: string | null;
  previous?: string | null;
};

export function normalizePaginated<T>(data: unknown): { items: T[]; count: number } {
  if (Array.isArray(data)) {
    return { items: data as T[], count: data.length };
  }
  if (data && typeof data === "object") {
    const d = data as PaginatedPayload<T>;
    if (Array.isArray(d.results)) {
      return { items: d.results, count: d.count ?? d.results.length };
    }
  }
  return { items: [], count: 0 };
}
