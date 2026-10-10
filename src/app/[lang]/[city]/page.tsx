import Link from "next/link";
import { notFound } from "next/navigation";
import { HotelCard } from "@/components/hotel-card";
import { JsonLd } from "@/components/json-ld";
import { cardClass } from "@/components/ui";
import { getDictionary } from "@/i18n/get-dictionary";
import { getCity, getDistricts, getPublishedHotels } from "@/lib/catalog";
import { pick } from "@/lib/format";
import { isLocale, withLocale, type Locale } from "@/lib/locale";
import { pageMeta } from "@/lib/seo";

export async function generateStaticParams() {
  return [
    { lang: "ar", city: "makkah" },
    { lang: "en", city: "makkah" },
    { lang: "ar", city: "madinah" },
    { lang: "en", city: "madinah" },
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; city: string }> }) {
  const { lang, city: citySlug } = await params;
  if (!isLocale(lang)) return {};
  const city = await getCity(citySlug);
  if (!city) return {};
  const name = pick(lang, city.nameAr, city.nameEn);
  return pageMeta(lang, pick(lang, `فنادق ${city.nameAr}`, `Hotels in ${city.nameEn}`), pick(lang, city.summaryAr, city.summaryEn), `/${city.slug}`);
}

export default async function CityPage({ params }: { params: Promise<{ lang: string; city: string }> }) {
  const { lang, city: citySlug } = await params;
  if (!isLocale(lang)) notFound();
  const city = await getCity(citySlug);
  if (!city) notFound();
  const dict = getDictionary(lang);
  const districts = (await getDistricts()).filter((district) => district.citySlug === city.slug);
  const hotels = (await getPublishedHotels()).filter((hotel) => hotel.citySlug === city.slug);
  const name = pick(lang, city.nameAr, city.nameEn);

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: pick(lang, `فنادق ${city.nameAr}`, `Hotels in ${city.nameEn}`),
          description: pick(lang, city.summaryAr, city.summaryEn),
          about: { "@type": "City", name },
        }}
      />
      <header className="max-w-3xl">
        <p className="text-sm text-gold-deep">{dict.brand.name}</p>
        <h1 className="mt-2 text-4xl font-semibold">{pick(lang, `فنادق ${city.nameAr}`, `Hotels in ${city.nameEn}`)}</h1>
        <p className="mt-4 leading-8 text-muted">{pick(lang, city.summaryAr, city.summaryEn)}</p>
      </header>
      <section>
        <h2 className="text-2xl font-semibold">{dict.search.district}</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {districts.map((district) => (
            <li key={district.slug}>
              <Link className={`${cardClass} block p-4 hover:border-gold`} href={withLocale(lang, `/${city.slug}/${district.slug}`)}>
                <span className="font-semibold">{pick(lang, district.nameAr, district.nameEn)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <HotelList lang={lang} dict={dict} hotels={hotels} />
    </div>
  );
}

function HotelList({
  lang,
  dict,
  hotels,
}: {
  lang: Locale;
  dict: ReturnType<typeof getDictionary>;
  hotels: Awaited<ReturnType<typeof getPublishedHotels>>;
}) {
  if (!hotels.length) {
    return (
      <div className={`${cardClass} p-8`}>
        <h2 className="text-xl font-semibold">{dict.empty.title}</h2>
        <p className="mt-3 leading-8 text-muted">{dict.empty.body}</p>
        <Link className="mt-4 inline-flex font-semibold text-gold-deep" href={withLocale(lang, "/partners")}>
          {dict.empty.cta}
        </Link>
      </div>
    );
  }
  return (
    <div className="grid gap-4">
      {hotels.map((hotel) => (
        <HotelCard key={hotel.slug} hotel={hotel} locale={lang} dict={dict} query={{}} />
      ))}
    </div>
  );
}
