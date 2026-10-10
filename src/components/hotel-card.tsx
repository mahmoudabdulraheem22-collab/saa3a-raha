import Image from "next/image";
import Link from "next/link";
import type { Dictionary } from "@/i18n/ar";
import { cardClass, goldButtonClass, quietButtonClass } from "@/components/ui";
import { durationOrder, formatSar, pick } from "@/lib/format";
import { compareHref } from "@/lib/query";
import { withLocale, type Locale } from "@/lib/locale";
import type { PublicHotel, SearchQuery } from "@/lib/types";

function lowest(hotel: PublicHotel) {
  const amounts = hotel.rooms.flatMap((room) => room.durations.map((duration) => duration.amountHalalas)).filter((amount): amount is number => amount != null);
  return amounts.length ? Math.min(...amounts) : null;
}

function maxGuests(hotel: PublicHotel) {
  return hotel.rooms.reduce((max, room) => Math.max(max, room.capacity), 0);
}

export function whatsappHref(phone: string, text: string) {
  const digits = phone.replace(/[^\d]/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function HotelCard({
  hotel,
  locale,
  dict,
  query,
}: {
  hotel: PublicHotel;
  locale: Locale;
  dict: Dictionary;
  query: SearchQuery;
}) {
  const name = pick(locale, hotel.nameAr, hotel.nameEn);
  const district = pick(locale, hotel.districtNameAr, hotel.districtNameEn);
  const city = pick(locale, hotel.cityNameAr, hotel.cityNameEn);
  const photo = hotel.photos.find((item) => item.verified);
  const price = lowest(hotel);
  const guests = maxGuests(hotel);
  const durations = durationOrder.filter((id) => hotel.rooms.some((room) => room.durations.some((duration) => duration.id === id)));
  const stay = new URLSearchParams();
  if (query.date) stay.set("date", query.date);
  if (query.time) stay.set("time", query.time);
  if (query.duration) stay.set("duration", query.duration);
  if (query.guests) stay.set("guests", query.guests);
  const suffix = stay.toString() ? `?${stay}` : "";
  const href = withLocale(locale, `/hotels/${hotel.slug}${suffix}`);
  const request = withLocale(locale, `/booking/request?hotel=${hotel.slug}${stay.toString() ? `&${stay}` : ""}`);
  const wa = whatsappHref(hotel.whatsapp, `${dict.card.request}: ${name}`);

  return (
    <article className={`${cardClass} overflow-hidden`}>
      <div className="grid md:grid-cols-[240px_1fr]">
        <div className="relative min-h-48 bg-[#f6f1e4]">
          {photo ? (
            <Image src={photo.url} alt={pick(locale, photo.altAr, photo.altEn) || name} fill className="object-cover" sizes="(min-width: 768px) 240px, 100vw" />
          ) : (
            <div className="flex h-full items-end p-4 text-sm text-muted">{dict.card.noPhoto}</div>
          )}
          {photo?.verified ? <span className="absolute start-3 top-3 rounded-full bg-paper/95 px-3 py-1 text-xs font-semibold text-pine">{dict.card.verified}</span> : null}
        </div>
        <div className="grid gap-4 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">{name}</h2>
              <p className="mt-1 text-sm text-muted">
                {district} · {city}
              </p>
            </div>
            {hotel.sponsored ? <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold-deep">{dict.card.sponsored}</span> : null}
          </div>
          <p className="text-sm text-pine">{dict.card.byHotel}</p>
          <div className="flex flex-wrap gap-2">
            {durations.map((id) => (
              <span key={id} className="rounded-full border border-line px-3 py-1 text-xs">
                {dict.search.durations[id]}
              </span>
            ))}
            {hotel.classification ? <span className="rounded-full border border-line px-3 py-1 text-xs">{hotel.classification}</span> : null}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm">
              {price != null ? (
                <>
                  <span className="text-muted">{dict.card.from} </span>
                  <span className="text-lg font-semibold">{formatSar(price, locale)}</span>
                </>
              ) : (
                <span className="text-muted">{dict.card.priceOnRequest}</span>
              )}
              {guests > 0 ? <span className="mt-1 block text-muted">{dict.card.guests} {guests} {dict.card.guestUnit}</span> : null}
            </p>
            <p className="text-xs text-muted">{hotel.bookingModel === "instant" && hotel.liveInventory ? dict.card.instant : dict.card.requestModel}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <Link className={inkish} href={href}>{dict.card.view}</Link>
            <Link className={quietButtonClass} href={`${href}#rooms`}>{dict.card.check}</Link>
            {wa ? (
              <a className={goldButtonClass} href={wa} target="_blank" rel="noreferrer">{dict.card.whatsapp}</a>
            ) : (
              <Link className={goldButtonClass} href={request}>{dict.card.request}</Link>
            )}
          </div>
          {wa ? (
            <Link href={request} className="text-sm font-semibold text-gold-deep">
              {dict.card.request}
            </Link>
          ) : null}
          <Link href={compareHref(locale, query, hotel.slug)} className="text-sm text-muted" aria-pressed={(query.compare ?? "").split(",").includes(hotel.slug)}>
            {dict.card.compare}
          </Link>
        </div>
      </div>
    </article>
  );
}

const inkish = "inline-flex h-12 items-center justify-center rounded-2xl bg-ink px-5 text-sm font-semibold text-paper";
