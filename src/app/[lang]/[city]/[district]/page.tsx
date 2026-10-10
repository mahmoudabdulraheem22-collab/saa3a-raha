import Link from "next/link";
import { notFound } from "next/navigation";
import { HotelCard } from "@/components/hotel-card";
import { JsonLd } from "@/components/json-ld";
import { cardClass } from "@/components/ui";
import { getDictionary } from "@/i18n/get-dictionary";
import { getCity, getDistrict, getDistricts, getPublishedHotels } from "@/lib/catalog";
import { pick } from "@/lib/format";
import { isLocale, withLocale } from "@/lib/locale";
import { pageMeta } from "@/lib/seo";

export async function generateStaticParams() {
  const districts = await getDistricts();
  return ["ar", "en"].flatMap((lang) =>
    districts.map((district) => ({ lang, city: district.citySlug, district: district.slug })),
  );
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; city: string; district: string }> }) {
  const { lang, city: citySlug, district: districtSlug } = await params;
  if (!isLocale(lang)) return {};
  const district = await getDistrict(citySlug, districtSlug);
  const city = await getCity(citySlug);
  if (!district || !city) return {};
  const title = pick(lang, `فنادق ${district.nameAr}`, `Hotels in ${district.nameEn}, ${city.nameEn}`);
  return pageMeta(lang, title, pick(lang, district.summaryAr, district.summaryEn), `/${city.slug}/${district.slug}`);
}

export default async function DistrictPage({ params }: { params: Promise<{ lang: string; city: string; district: string }> }) {
  const { lang, city: citySlug, district: districtSlug } = await params;
  if (!isLocale(lang)) notFound();
  const [city, district] = await Promise.all([getCity(citySlug), getDistrict(citySlug, districtSlug)]);
  if (!city || !district) notFound();
  const dict = getDictionary(lang);
  const hotels = (await getPublishedHotels()).filter((hotel) => hotel.citySlug === city.slug && hotel.districtSlug === district.slug);
  const title = pick(lang, `فنادق ${district.nameAr}`, `Hotels in ${district.nameEn}`);

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: dict.nav.home, item: withLocale(lang, "/") },
            { "@type": "ListItem", position: 2, name: pick(lang, city.nameAr, city.nameEn), item: withLocale(lang, `/${city.slug}`) },
            { "@type": "ListItem", position: 3, name: pick(lang, district.nameAr, district.nameEn) },
          ],
        }}
      />
      <header className="max-w-3xl">
        <p className="text-sm text-muted">
          <Link href={withLocale(lang, "/")}>{dict.nav.home}</Link>
          {" / "}
          <Link href={withLocale(lang, `/${city.slug}`)}>{pick(lang, city.nameAr, city.nameEn)}</Link>
        </p>
        <h1 className="mt-3 text-4xl font-semibold">{title}</h1>
        <p className="mt-4 leading-8 text-muted">{pick(lang, district.summaryAr, district.summaryEn)}</p>
        <Link className="mt-4 inline-flex font-semibold text-gold-deep" href={withLocale(lang, `/search?city=${city.slug}&district=${district.slug}`)}>
          {dict.search.cta}
        </Link>
      </header>
      {hotels.length === 0 ? (
        <div className={`${cardClass} p-8`}>
          <h2 className="text-xl font-semibold">{dict.empty.title}</h2>
          <p className="mt-3 leading-8 text-muted">{dict.empty.body}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.slug} hotel={hotel} locale={lang} dict={dict} query={{ city: city.slug, district: district.slug }} />
          ))}
        </div>
      )}
    </div>
  );
}
