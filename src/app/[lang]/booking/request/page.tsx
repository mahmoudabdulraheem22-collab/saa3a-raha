import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BookingWizard } from "@/components/booking-wizard";
import { getDictionary } from "@/i18n/get-dictionary";
import { getPublishedHotels } from "@/lib/catalog";
import { firstParam } from "@/lib/format";
import { isLocale } from "@/lib/locale";

export const metadata = { robots: { index: false, follow: false } };

export default function BookingRequestPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-16 text-muted">…</div>}>
      <RequestScreen params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function RequestScreen({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const query = await searchParams;
  const hotels = (await getPublishedHotels()).filter((hotel) => hotel.rooms.some((room) => room.durations.length > 0));

  return (
    <div className="mx-auto grid max-w-3xl gap-6 px-4 py-10">
      <header>
        <h1 className="text-4xl font-semibold">{dict.booking.title}</h1>
        <p className="mt-3 leading-8 text-muted">{dict.trust.body}</p>
      </header>
      <BookingWizard
        locale={lang}
        dict={dict}
        hotels={hotels}
        initial={{
          hotel: firstParam(query.hotel),
          room: firstParam(query.room),
          duration: firstParam(query.duration),
          date: firstParam(query.date),
          time: firstParam(query.time),
          guests: firstParam(query.guests),
        }}
      />
    </div>
  );
}
