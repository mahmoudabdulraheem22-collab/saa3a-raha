import { HeaderBar } from "@/components/header-bar";
import { getDictionary } from "@/i18n/get-dictionary";
import { getActiveCities } from "@/lib/catalog";
import { isLocale, type Locale } from "@/lib/locale";
import { pick } from "@/lib/format";

export async function SiteHeader({ lang }: { lang: string }) {
  const locale: Locale = isLocale(lang) ? lang : "ar";
  const [dict, cities] = await Promise.all([Promise.resolve(getDictionary(locale)), getActiveCities()]);
  return (
    <HeaderBar
      locale={locale}
      name={dict.brand.name}
      latin={dict.brand.latin}
      labels={dict.nav}
      cities={cities.map((city) => ({ slug: city.slug, label: pick(locale, city.nameAr, city.nameEn) }))}
    />
  );
}
