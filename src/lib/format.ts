import type { Locale } from "@/lib/locale";

export function pick(locale: Locale, ar: string, en: string) {
  return locale === "ar" ? ar : en;
}

export function formatSar(halalas: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-SA", {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: halalas % 100 === 0 ? 0 : 2,
  }).format(halalas / 100);
}

export function formatMeters(meters: number, locale: Locale) {
  if (meters < 1000) {
    return locale === "ar" ? `${meters.toLocaleString("ar-SA")} م` : `${meters.toLocaleString("en-SA")} m`;
  }
  const km = meters / 1000;
  const value = km.toLocaleString(locale === "ar" ? "ar-SA" : "en-SA", { maximumFractionDigits: 1 });
  return locale === "ar" ? `${value} كم` : `${value} km`;
}

export function riyadhToday() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Riyadh" }).format(new Date());
}

export function makeReference(prefix: string) {
  const date = riyadhToday().replace(/-/g, "");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let token = "";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  for (const byte of bytes) token += alphabet[byte % alphabet.length];
  return `${prefix}-${date}-${token}`;
}

export function slugify(input: string) {
  const base = input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return base || `hotel-${crypto.randomUUID().slice(0, 8)}`;
}

export function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export const durationOrder = ["1h", "3h", "6h", "12h", "night"] as const;
export type DurationId = (typeof durationOrder)[number];

export function isDuration(value: string | undefined): value is DurationId {
  return !!value && (durationOrder as readonly string[]).includes(value);
}

export function durationRank(id: string) {
  const index = durationOrder.indexOf(id as DurationId);
  return index === -1 ? 99 : index;
}
