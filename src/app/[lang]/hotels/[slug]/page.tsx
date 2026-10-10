import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { whatsappHref } from "@/components/hotel-card";
import { JsonLd } from "@/components/json-ld";
import { MapView } from "@/components/map-view";
import { cardClass, goldButtonClass, quietButtonClass } from "@/components/ui";
import { getDictionary } from "@/i18n/get-dictionary";
import { getHotelBySlug, getLandmarks } from "@/lib/catalog";
import { durationOrder, firstParam, formatMeters, formatSar, pick } from "@/lib/format";
import { isLocale, withLocale } from "@/lib/locale";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const hotel = await getHotelBySlug(slug);
  if (!hotel) return {};
  const dict = getDictionary(lang);
  const name = pick(lang, hotel.nameAr, hotel.nameEn);
  const district = pick(lang, hotel.districtNameAr, hotel.districtNameEn);
  return pageMeta(lang, name, `${name} — ${district}. ${dict.hotel.offerBy}`, `/hotels/${slug}`);
}

export default function HotelPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-16 text-muted">…</div>}>
      <HotelScreen params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function HotelScreen({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const hotel = await getHotelBySlug(slug);
  if (!hotel) notFound();
  const dict = getDictionary(lang);
  const query = await searchParams;
  const stay = new URLSearchParams();
  for (const key of ["date", "time", "duration", "guests"] as const) {
    const value = firstParam(query[key]);
    if (value) stay.set(key === "time" ? "time" : key, value);
  }
  const name = pick(lang, hotel.nameAr, hotel.nameEn);
  const photos = hotel.photos.filter((photo) => photo.verified);
  const landmarks = await getLandmarks();
  const landmark = landmarks.find((item) => item.citySlug === hotel.citySlug);
  const points = [
    ...(landmark ? [{ lat: landmark.lat, lng: landmark.lng, label: pick(lang, landmark.nameAr, landmark.nameEn), kind: "landmark" as const }] : []),
    ...(hotel.lat != null && hotel.lng != null ? [{ lat: hotel.lat, lng: hotel.lng, label: name, kind: "hotel" as const }] : []),
  ];
  const wa = whatsappHref(hotel.whatsapp, `${dict.card.request}: ${name}`);
  const requestHref = withLocale(lang, `/booking/request?hotel=${hotel.slug}${stay.toString() ? `&${stay}` : ""}`);

  return (
    <article className="mx-auto grid max-w-6xl gap-8 px-4 py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Hotel",
          name,
          description: pick(lang, hotel.descriptionAr, hotel.descriptionEn) || dict.hotel.offerBy,
          address: {
            "@type": "PostalAddress",
            addressLocality: pick(lang, hotel.districtNameAr, hotel.districtNameEn),
            addressRegion: pick(lang, hotel.cityNameAr, hotel.cityNameEn),
            addressCountry: "SA",
          },
          ...(hotel.lat != null && hotel.lng != null ? { geo: { "@type": "GeoCoordinates", latitude: hotel.lat, longitude: hotel.lng } } : {}),
        }}
      />
      <header className="grid gap-3">
        <p className="text-sm text-muted">
          <Link href={withLocale(lang, `/${hotel.citySlug}`)}>{pick(lang, hotel.cityNameAr, hotel.cityNameEn)}</Link>
          {" / "}
          <Link href={withLocale(lang, `/${hotel.citySlug}/${hotel.districtSlug}`)}>{pick(lang, hotel.districtNameAr, hotel.districtNameEn)}</Link>
        </p>
        <h1 className="text-4xl font-semibold">{name}</h1>
        {hotel.classification ? <p className="text-sm text-gold-deep">{hotel.classification}</p> : null}
        <p className="max-w-3xl leading-8 text-muted">{dict.hotel.offerBy}</p>
        <p className="text-sm text-pine">{hotel.bookingModel === "instant" && hotel.liveInventory ? dict.card.instant : dict.card.requestModel}</p>
      </header>
      {photos.length ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {photos.map((photo) => (
            <div key={photo.url} className="relative h-64 overflow-hidden rounded-3xl">
              <Image src={photo.url} alt={pick(lang, photo.altAr, photo.altEn) || name} fill className="object-cover" sizes="(min-width: 640px) 50vw, 100vw" />
              <span className="absolute start-3 top-3 rounded-full bg-paper/95 px-3 py-1 text-xs font-semibold text-pine">{dict.card.verified}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className={`${cardClass} p-8 text-muted`}>{dict.card.noPhoto}</div>
      )}
      <div className="flex flex-wrap gap-3">
        <a className={quietButtonClass} href="#rooms">{dict.card.check}</a>
        <Link className={goldButtonClass} href={requestHref}>{dict.card.request}</Link>
        {wa ? <a className={quietButtonClass} href={wa} target="_blank" rel="noreferrer">{dict.card.whatsapp}</a> : null}
      </div>
      {pick(lang, hotel.descriptionAr, hotel.descriptionEn) ? <p className="max-w-3xl leading-8">{pick(lang, hotel.descriptionAr, hotel.descriptionEn)}</p> : null}
      <section id="rooms" className="grid gap-4">
        <h2 className="text-2xl font-semibold">{dict.hotel.rooms}</h2>
        {hotel.rooms.length === 0 ? <p className="text-muted">{dict.hotel.noRooms}</p> : null}
        {hotel.rooms.map((room) => (
          <article key={room.id} className={`${cardClass} grid gap-3 p-5`}>
            <h3 className="text-xl font-semibold">{pick(lang, room.nameAr, room.nameEn)}</h3>
            <p className="text-sm text-muted">
              {dict.hotel.capacity}: {room.capacity} · {room.privateBath ? dict.hotel.privateBath : dict.hotel.sharedBath}
              {room.roomType ? ` · ${dict.filters.roomTypes[room.roomType as keyof typeof dict.filters.roomTypes] ?? room.roomType}` : ""}
            </p>
            <ul className="grid gap-2">
              {durationOrder.filter((id) => room.durations.some((duration) => duration.id === id)).map((id) => {
                const offer = room.durations.find((duration) => duration.id === id);
                return (
                  <li key={id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-ivory px-4 py-3">
                    <span>{dict.search.durations[id]}</span>
                    <span className="font-semibold">{offer?.amountHalalas != null ? formatSar(offer.amountHalalas, lang) : dict.card.priceOnRequest}</span>
                    <Link className="text-sm font-semibold text-gold-deep" href={withLocale(lang, `/booking/request?hotel=${hotel.slug}&room=${room.id}&duration=${id}${stay.toString() ? `&${stay}` : ""}`)}>
                      {dict.card.request}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <p className="text-sm text-muted">{hotel.liveInventory ? dict.hotel.live : dict.hotel.subject}</p>
          </article>
        ))}
      </section>
      <section>
        <h2 className="text-2xl font-semibold">{dict.hotel.amenities}</h2>
        <ul className="mt-3 flex flex-wrap gap-2 text-sm">
          {hotel.wifi ? <li className="rounded-full border border-line px-3 py-1">{dict.filters.wifi}</li> : null}
          {hotel.parking ? <li className="rounded-full border border-line px-3 py-1">{dict.filters.parking}</li> : null}
          {hotel.accessibility ? <li className="rounded-full border border-line px-3 py-1">{dict.filters.accessibility}</li> : null}
          {hotel.luggageStorage ? <li className="rounded-full border border-line px-3 py-1">{dict.filters.luggage}</li> : null}
        </ul>
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold">{dict.hotel.distance}</h2>
          {hotel.distances.length === 0 ? <p className="mt-3 text-muted">{dict.hotel.distanceEmpty}</p> : (
            <ul className="mt-3 grid gap-2">
              {hotel.distances.map((distance) => (
                <li key={distance.landmarkSlug} className={`${cardClass} p-4 text-sm`}>
                  <p className="font-semibold">{pick(lang, distance.nameAr, distance.nameEn)} · {formatMeters(distance.meters, lang)}</p>
                  <p className="text-muted">{dict.hotel.verifiedOn} {distance.verifiedOn}</p>
                  <p className="text-muted">{distance.sourceNote}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          {hotel.lat != null && hotel.lng != null ? <MapView points={points} emptyLabel={dict.hotel.locationEmpty} /> : <p className="text-muted">{dict.hotel.locationEmpty}</p>}
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <Policy title={dict.hotel.policies} body={pick(lang, hotel.policiesAr, hotel.policiesEn)} />
        <Policy title={dict.hotel.checkin} body={pick(lang, hotel.checkInAr, hotel.checkInEn)} />
        <Policy title={dict.hotel.cancellation} body={pick(lang, hotel.cancellationAr, hotel.cancellationEn)} />
      </section>
    </article>
  );
}

function Policy({ title, body }: { title: string; body: string }) {
  return (
    <div className={`${cardClass} p-5`}>
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted">{body || "—"}</p>
    </div>
  );
}
