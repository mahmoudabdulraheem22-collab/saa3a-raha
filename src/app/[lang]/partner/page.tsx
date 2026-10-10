import { notFound } from "next/navigation";
import { Suspense } from "react";
import { cardClass } from "@/components/ui";
import { getDictionary } from "@/i18n/get-dictionary";
import { prisma } from "@/lib/db";
import { firstParam, pick } from "@/lib/format";
import { isLocale, withLocale } from "@/lib/locale";

export const metadata = { robots: { index: false, follow: false } };

export default function PartnerDeskPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-16 text-muted">…</div>}>
      <Desk params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function Desk({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const reference = firstParam((await searchParams).reference)?.trim();
  const application = reference
    ? await prisma.hotelPartner.findUnique({ where: { reference } })
    : null;

  return (
    <div className="mx-auto grid max-w-3xl gap-6 px-4 py-12">
      <header>
        <h1 className="text-4xl font-semibold">{dict.desk.title}</h1>
        <p className="mt-4 leading-8 text-muted">{dict.desk.body}</p>
      </header>
      <ul className="grid gap-2 sm:grid-cols-2">
        {dict.desk.modules.map((item) => (
          <li key={item} className={`${cardClass} p-4 text-sm font-medium`}>{item}</li>
        ))}
      </ul>
      <form className={`${cardClass} grid gap-3 p-5`} action={withLocale(lang, "/partner")}>
        <label className="grid gap-2 text-sm font-medium">
          {dict.desk.lookup}
          <input className="h-12 rounded-2xl border border-line px-4" name="reference" defaultValue={reference} />
        </label>
        <button className="h-12 rounded-2xl bg-ink text-sm font-semibold text-paper" type="submit">{dict.desk.lookupCta}</button>
        {reference && !application ? <p className="text-sm text-muted">{dict.desk.missing}</p> : null}
        {application ? (
          <p className="text-sm leading-7">
            {application.reference} · {pick(lang, application.hotelName, application.commercialName)} · {application.status}
          </p>
        ) : null}
      </form>
    </div>
  );
}
