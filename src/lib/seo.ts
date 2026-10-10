import type { Metadata } from "next";
import { absoluteUrl, withLocale, type Locale } from "@/lib/locale";

export function pageMeta(locale: Locale, title: string, description: string, path: string): Metadata {
  const arabic = withLocale("ar", path);
  const english = withLocale("en", path);
  const canonical = withLocale(locale, path);
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { ar: arabic, en: english, "x-default": arabic },
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(canonical),
      locale: locale === "ar" ? "ar_SA" : "en_US",
      type: "website",
      siteName: locale === "ar" ? "ساعة راحة" : "Saa3a Raha",
    },
  };
}
