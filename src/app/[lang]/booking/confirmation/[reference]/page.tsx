import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { cardClass } from "@/components/ui";
import { getDictionary } from "@/i18n/get-dictionary";
import { prisma } from "@/lib/db";
import { pick } from "@/lib/format";
import { isLocale, withLocale } from "@/lib/locale";

export const metadata = { robots: { index: false, follow: false } };

export default function ConfirmationPage({ params }: { params: Promise<{ lang: string; reference: string }> }) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-16 text-muted">…</div>}>
      <Confirmation params={params} />
    </Suspense>
  );
}

async function Confirmation({ params }: { params: Promise<{ lang: string; reference: string }> }) {
  const { lang, reference } = await params;
  if (!isLocale(lang)) notFound();
  const request = await prisma.bookingRequest.findUnique({
    where: { reference },
    include: { hotel: true, customer: true, booking: true },
  });
  if (!request) notFound();
  const room = await prisma.room.findUnique({ where: { id: request.roomId } });
  const dict = getDictionary(lang);
  const title = request.status === "confirmed" ? dict.booking.confirmedTitle : request.status === "declined" ? dict.booking.declinedTitle : dict.booking.pendingTitle;
  const body = request.status === "confirmed" ? dict.booking.confirmedBody : request.status === "declined" ? dict.booking.declinedTitle : dict.booking.pendingBody;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <article className={`${cardClass} grid gap-3 p-6 sm:p-8`}>
        <p className="text-sm text-gold-deep">{dict.booking.reference}</p>
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="font-mono text-sm">{request.reference}</p>
        <p className="leading-8 text-muted">{body}</p>
        <p>{pick(lang, request.hotel.nameAr, request.hotel.nameEn)}</p>
        {room ? <p>{pick(lang, room.nameAr, room.nameEn)}</p> : null}
        <p>
          {request.date} · {request.arrivalTime} · {dict.search.durations[request.durationId as keyof typeof dict.search.durations] ?? request.durationId}
        </p>
        <p>{request.customer.name}</p>
        <p className="text-sm text-muted">{dict.hotel.offerBy}</p>
        <Link className="mt-2 font-semibold text-gold-deep" href={withLocale(lang, `/hotels/${request.hotel.slug}`)}>
          {dict.card.view}
        </Link>
      </article>
    </div>
  );
}
