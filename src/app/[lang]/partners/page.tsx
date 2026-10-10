import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PartnerForm } from "@/components/partner-form";
import { cardClass } from "@/components/ui";
import { getDictionary } from "@/i18n/get-dictionary";
import { getActiveCities, getDistricts } from "@/lib/catalog";
import { firstParam } from "@/lib/format";
import { isLocale } from "@/lib/locale";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  return pageMeta(lang, dict.partner.title, dict.partner.headline, "/partners");
}

export default function PartnersPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-16 text-muted">…</div>}>
      <PartnersScreen params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function PartnersScreen({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const sent = firstParam((await searchParams).sent);
  const [cities, districts] = await Promise.all([getActiveCities(), getDistricts()]);

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[.9fr_1.1fr]">
      <header>
        <p className="text-sm font-semibold text-gold-deep">{dict.partner.kicker}</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight">{dict.partner.headline}</h1>
        <p className="mt-4 leading-8 text-muted">{dict.partner.body}</p>
        <p className="mt-4 leading-8 text-muted">{dict.partner.models}</p>
        <ul className="mt-6 grid gap-2 text-sm">
          {dict.desk.modules.map((item) => (
            <li key={item} className="rounded-2xl border border-line bg-paper px-4 py-3">{item}</li>
          ))}
        </ul>
      </header>
      <div className={`${cardClass} p-5 sm:p-7`}>
        {sent ? (
          <div className="mb-5 rounded-2xl bg-pine-soft px-4 py-4 text-sm leading-7 text-pine">
            <p>{dict.partner.success}</p>
            {sent !== "1" ? <p className="mt-2 font-semibold">{dict.partner.reference}: {sent}</p> : null}
          </div>
        ) : null}
        <PartnerForm locale={lang} dict={dict} cities={cities} districts={districts} />
      </div>
    </div>
  );
}
