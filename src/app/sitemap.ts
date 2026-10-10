import type { MetadataRoute } from "next";
import { legalSlugs } from "@/content/legal";
import { getActiveCities, getDistricts, getPublishedHotels } from "@/lib/catalog";
import { absoluteUrl, withLocale, type Locale } from "@/lib/locale";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cities, districts, hotels] = await Promise.all([getActiveCities(), getDistricts(), getPublishedHotels()]);
  const paths = [
    "/",
    "/search",
    "/partners",
    ...legalSlugs.map((slug) => `/legal/${slug}`),
    ...cities.map((city) => `/${city.slug}`),
    ...districts.map((district) => `/${district.citySlug}/${district.slug}`),
    ...hotels.map((hotel) => `/hotels/${hotel.slug}`),
  ];
  const locales: Locale[] = ["ar", "en"];

  return paths.map((path) => ({
    url: absoluteUrl(withLocale("ar", path)),
    alternates: {
      languages: Object.fromEntries(locales.map((locale) => [locale, absoluteUrl(withLocale(locale, path))])),
    },
  }));
}
