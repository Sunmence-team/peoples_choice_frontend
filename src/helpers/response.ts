export type Dict = Record<string, unknown>;

export const asDict = (value: unknown): Dict | null =>
  typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Dict)
    : null;

export const unwrap = <T = unknown>(body: unknown): T => {
  const dict = asDict(body);
  if (dict && "data" in dict && dict.data !== undefined && dict.data !== null) {
    return dict.data as T;
  }
  return body as T;
};

export const pickString = (...values: unknown[]): string => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number") return String(value);
  }
  return "";
};

export const pickNumber = (...values: unknown[]): number => {
  for (const value of values) {
    if (typeof value === "number" && !Number.isNaN(value)) return value;
    if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) {
      return Number(value);
    }
  }
  return 0;
};

export interface Paged<T> {
  items: T[];
  total: number;
  currentPage: number;
  totalPages: number;
  perPage: number;
}

const findArray = (value: unknown): unknown[] | null => {
  if (Array.isArray(value)) return value;
  const dict = asDict(value);
  if (dict && "data" in dict) return findArray(dict.data);
  return null;
};

export const toArray = (value: unknown): unknown[] => findArray(value) ?? [];

const findMeta = (value: unknown): Dict | null => {
  const dict = asDict(value);
  if (!dict) return null;
  if (asDict(dict.meta)) return asDict(dict.meta);
  if ("total" in dict || "current_page" in dict || "last_page" in dict) return dict;
  if ("data" in dict) return findMeta(dict.data);
  return null;
};

export const toPaged = <T>(body: unknown, fallbackPerPage = 10): Paged<T> => {
  const items = (findArray(body) ?? []) as T[];
  const meta = findMeta(body);
  const total = meta ? pickNumber(meta.total) || items.length : items.length;
  const currentPage = meta ? pickNumber(meta.current_page, meta.page, meta.currentPage) || 1 : 1;
  const perPage = meta ? pickNumber(meta.per_page, meta.pageSize, meta.perPage) || fallbackPerPage : fallbackPerPage;
  const totalPages = meta
    ? pickNumber(meta.last_page, meta.total_pages, meta.totalPages) ||
      Math.max(1, Math.ceil(total / perPage))
    : Math.max(1, Math.ceil(total / perPage));

  return { items, total, currentPage, totalPages, perPage: perPage || fallbackPerPage };
};
