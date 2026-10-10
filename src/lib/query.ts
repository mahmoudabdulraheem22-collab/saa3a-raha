import { firstParam } from "@/lib/format";
import { withLocale, type Locale } from "@/lib/locale";
import type { SearchQuery } from "@/lib/types";

const keys = [
  "city",
  "district",
  "date",
  "time",
  "duration",
  "guests",
  "priceMin",
  "priceMax",
  "distance",
  "classification",
  "roomType",
  "privateBath",
  "wifi",
  "parking",
  "accessibility",
  "luggage",
  "shortStay",
  "fullNight",
  "sort",
  "compare",
] as const;

export function toQuery(input: Record<string, string | string[] | undefined>): SearchQuery {
  const query: SearchQuery = {};
  for (const key of keys) {
    const value = firstParam(input[key]);
    if (value) query[key] = value;
  }
  return query;
}

export function searchHref(locale: Locale, query: SearchQuery) {
  const params = new URLSearchParams();
  for (const key of keys) {
    const value = query[key];
    if (value) params.set(key, value);
  }
  const qs = params.toString();
  return withLocale(locale, `/search${qs ? `?${qs}` : ""}`);
}

export function compareHref(locale: Locale, query: SearchQuery, slug: string) {
  const current = (query.compare ?? "").split(",").map((item) => item.trim()).filter(Boolean);
  const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug].slice(0, 3);
  return searchHref(locale, { ...query, compare: next.join(",") || undefined });
}
