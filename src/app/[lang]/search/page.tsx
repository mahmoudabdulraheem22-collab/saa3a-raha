import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { HotelCard } from "@/components/hotel-card";
import { JsonLd } from "@/components/json-ld";
import { MapView, type MapPoint } from "@/components/map-view";
import { SearchForm } from "@/components/search-form";
import { ViewToggle } from "@/components/view-toggle";
import { cardClass, quietButtonClass } from "@/components/ui";
import { getDictionary } from "@/i18n/get-dictionary";
import { getActiveCities, getDistricts, getLandmarks, getPublishedHotels } from "@/lib/catalog";
import { pick } from "@/lib/format";
import { isLocale, withLocale } from "@/lib/locale";
import { compareSlugs, filterHotels } from "@/lib/search";
import { searchHref, toQuery } from "@/lib/query";
import { pageMeta } from "@/lib/seo";
import type { SearchQuery } from "@/lib/types";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  return pageMeta(lang, dict.search.cta, dict.meta.description, "/search");
}

export default function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-16 text-muted">…</div>}>
      <SearchScreen params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function SearchScreen({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const query = toQuery(await searchParams);
  const [cities, districts, hotels, landmarks] = await Promise.all([
    getActiveCities(),
    getDistricts(),
    getPublishedHotels(),
    getLandmarks(),
  ]);
  const { sponsored, organic } = filterHotels(hotels, query);
  const selected = compareSlugs(query).map((slug) => hotels.find((hotel) => hotel.slug === slug)).filter((hotel) => hotel != null);
  const points: MapPoint[] = [
    ...landmarks.map((item) => ({ lat: item.lat, lng: item.lng, label: pick(lang, item.nameAr, item.nameEn), kind: "landmark" as const })),
    ...organic.flatMap((hotel) =>
      hotel.lat != null && hotel.lng != null ? [{ lat: hotel.lat, lng: hotel.lng, label: pick(lang, hotel.nameAr, hotel.nameEn), kind: "hotel" as const }] : [],
    ),
  ];
  const unlocated = organic.filter((hotel) => hotel.lat == null || hotel.lng == null);

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[280px_1fr]">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "SearchResultsPage", name: dict.search.cta }} />
      <aside className="grid content-start gap-4">
        <SearchForm locale={lang} dict={dict} cities={cities} districts={districts} initial={query} />
        <FilterForm locale={lang} dict={dict} query={query} />
      </aside>
      <section className="grid gap-5">
        {query.date || query.time ? (
          <p className="rounded-2xl border border-line bg-paper px-4 py-3 text-sm leading-7 text-muted">{dict.hotel.subject}</p>
        ) : null}
        {selected.length >= 2 ? <CompareTable locale={lang} dict={dict} hotels={selected} /> : null}
        {sponsored.length ? (
          <div>
            <h2 className="text-lg font-semibold">{dict.filters.sponsored}</h2>
            <p className="mb-3 text-sm text-muted">{dict.filters.sponsoredNote}</p>
            <div className="grid gap-4">
              {sponsored.map((hotel) => (
                <HotelCard key={hotel.slug} hotel={hotel} locale={lang} dict={dict} query={query} />
              ))}
            </div>
          </div>
        ) : null}
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-2xl font-semibold">{dict.filters.results}</h2>
          <p className="text-sm text-muted">{organic.length}</p>
        </div>
        <ViewToggle
          listLabel={dict.map.list}
          mapLabel={dict.map.map}
          list={
            organic.length === 0 ? (
              <div className={`${cardClass} p-8`}>
                <h3 className="text-xl font-semibold">{dict.empty.title}</h3>
                <p className="mt-3 max-w-xl leading-8 text-muted">{dict.empty.body}</p>
                <Link className={`${quietButtonClass} mt-5`} href={withLocale(lang, "/partners")}>
                  {dict.empty.cta}
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {organic.map((hotel) => (
                  <HotelCard key={hotel.slug} hotel={hotel} locale={lang} dict={dict} query={query} />
                ))}
              </div>
            )
          }
          map={
            <div className="grid gap-3">
              <MapView points={points} emptyLabel={dict.map.missing} />
              <p className="text-xs text-muted">{dict.map.attribution}</p>
              {unlocated.length ? (
                <p className="text-sm text-muted">
                  {dict.map.missing}: {unlocated.map((hotel) => pick(lang, hotel.nameAr, hotel.nameEn)).join(" · ")}
                </p>
              ) : null}
            </div>
          }
        />
      </section>
    </div>
  );
}

function FilterForm({
  locale,
  dict,
  query,
}: {
  locale: "ar" | "en";
  dict: ReturnType<typeof getDictionary>;
  query: SearchQuery;
}) {
  const checks = [
    ["privateBath", dict.filters.privateBath],
    ["wifi", dict.filters.wifi],
    ["parking", dict.filters.parking],
    ["accessibility", dict.filters.accessibility],
    ["luggage", dict.filters.luggage],
    ["shortStay", dict.filters.shortStay],
    ["fullNight", dict.filters.fullNight],
  ] as const;

  return (
    <form action={withLocale(locale, "/search")} className={`${cardClass} grid gap-3 p-4`}>
      <h2 className="font-semibold">{dict.filters.title}</h2>
      {(["city", "district", "date", "time", "duration", "guests", "compare"] as const).map((key) => (
        <input key={key} type="hidden" name={key} value={query[key] ?? ""} />
      ))}
      <label className="grid gap-1 text-sm">
        {dict.filters.priceMin}
        <input className="h-11 rounded-2xl border border-line px-3" type="number" min={0} name="priceMin" defaultValue={query.priceMin} />
      </label>
      <label className="grid gap-1 text-sm">
        {dict.filters.priceMax}
        <input className="h-11 rounded-2xl border border-line px-3" type="number" min={0} name="priceMax" defaultValue={query.priceMax} />
      </label>
      <label className="grid gap-1 text-sm">
        {dict.filters.distance}
        <select className="h-11 rounded-2xl border border-line px-3" name="distance" defaultValue={query.distance ?? ""}>
          <option value="">{dict.filters.distanceAny}</option>
          <option value="500">500</option>
          <option value="1000">1000</option>
          <option value="2000">2000</option>
          <option value="5000">5000</option>
        </select>
      </label>
      <p className="text-xs leading-6 text-muted">{dict.filters.distanceHint}</p>
      <label className="grid gap-1 text-sm">
        {dict.filters.classification}
        <input className="h-11 rounded-2xl border border-line px-3" name="classification" defaultValue={query.classification} />
      </label>
      <label className="grid gap-1 text-sm">
        {dict.filters.roomType}
        <select className="h-11 rounded-2xl border border-line px-3" name="roomType" defaultValue={query.roomType ?? ""}>
          <option value="" />
          {Object.entries(dict.filters.roomTypes).map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </label>
      {checks.map(([name, label]) => (
        <label key={name} className="flex items-center gap-2 text-sm">
          <input type="checkbox" name={name} value="1" defaultChecked={query[name] === "1"} />
          {label}
        </label>
      ))}
      <label className="grid gap-1 text-sm">
        {dict.filters.sort}
        <select className="h-11 rounded-2xl border border-line px-3" name="sort" defaultValue={query.sort ?? "recommended"}>
          {Object.entries(dict.filters.sorts).map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <button className={quietButtonClass} type="submit">
        {dict.filters.apply}
      </button>
      <Link href={withLocale(locale, "/search")} className="text-center text-sm text-muted">
        {dict.filters.reset}
      </Link>
    </form>
  );
}

function CompareTable({
  locale,
  dict,
  hotels,
}: {
  locale: "ar" | "en";
  dict: ReturnType<typeof getDictionary>;
  hotels: NonNullable<Awaited<ReturnType<typeof getPublishedHotels>>>[number][];
}) {
  return (
    <div className={`${cardClass} overflow-x-auto p-4`}>
      <h2 className="mb-3 font-semibold">{dict.compare.title}</h2>
      <table className="w-full min-w-[640px] text-start text-sm">
        <thead>
          <tr className="border-b border-line">
            <th className="px-2 py-2" />
            {hotels.map((hotel) => (
              <th key={hotel.slug} className="px-2 py-2 font-semibold">
                {pick(locale, hotel.nameAr, hotel.nameEn)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-line">
            <th className="px-2 py-3 font-medium">{dict.search.district}</th>
            {hotels.map((hotel) => (
              <td key={hotel.slug} className="px-2 py-3">{pick(locale, hotel.districtNameAr, hotel.districtNameEn)}</td>
            ))}
          </tr>
          <tr className="border-b border-line">
            <th className="px-2 py-3 font-medium">{dict.compare.duration}</th>
            {hotels.map((hotel) => (
              <td key={hotel.slug} className="px-2 py-3">
                {[...new Set(hotel.rooms.flatMap((room) => room.durations.map((duration) => dict.search.durations[duration.id as keyof typeof dict.search.durations])))].join(" · ") || "—"}
              </td>
            ))}
          </tr>
          <tr>
            <th className="px-2 py-3 font-medium">{dict.compare.model}</th>
            {hotels.map((hotel) => (
              <td key={hotel.slug} className="px-2 py-3">{hotel.bookingModel === "instant" && hotel.liveInventory ? dict.card.instant : dict.card.requestModel}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
