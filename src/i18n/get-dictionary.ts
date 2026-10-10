import { ar, type Dictionary } from "@/i18n/ar";
import { en } from "@/i18n/en";
import { isLocale, type Locale } from "@/lib/locale";

const dictionaries: Record<Locale, Dictionary> = { ar, en };

export function getDictionary(locale: string): Dictionary {
  return isLocale(locale) ? dictionaries[locale] : ar;
}

export type { Dictionary };
