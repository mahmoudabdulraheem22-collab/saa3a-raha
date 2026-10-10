import Link from "next/link";
import { SearchForm } from "@/components/search-form";
import { JsonLd } from "@/components/json-ld";
import { cardClass, goldButtonClass } from "@/components/ui";
import { getDictionary } from "@/i18n/get-dictionary";
import { getActiveCities, getDistricts } from "@/lib/catalog";
import { pick } from "@/lib/format";
import { isLocale, siteUrl, withLocale } from "@/lib/locale";
import { pageMeta } from "@/lib/seo";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = getDictionary(lang);
  return pageMeta(lang, dict.brand.tagline, dict.meta.description, "/");
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const [cities, districts] = await Promise.all([getActiveCities(), getDistricts()]);
  const base = siteUrl();

  return (
    <div>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Saa3a Raha",
          alternateName: "ساعة راحة",
          url: base,
          description: dict.trust.body,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: dict.brand.name,
          url: base,
          potentialAction: {
            "@type": "SearchAction",
            target: `${base}${withLocale(lang, "/search")}?city={city}`,
            "query-input": "required name=city",
          },
        }}
      />
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 lg:grid-cols-[1.05fr_.95fr] lg:py-20">
        <div className="relative">
          <svg aria-hidden className="pointer-events-none absolute -top-8 end-0 hidden w-56 opacity-80 sm:block" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="72" fill="none" stroke="#d4af37" strokeWidth="1" />
            <circle cx="100" cy="100" r="46" fill="none" stroke="#1f6b45" strokeWidth="1" opacity="0.7" />
            <path d="M100 24v18M100 158v18M24 100h18M158 100h18" stroke="#d4af37" strokeWidth="1" />
          </svg>
          <p className="text-sm font-semibold tracking-[0.16em] text-gold-deep">{dict.hero.kicker}</p>
          <p className="mt-4 text-sm font-semibold text-muted">
            {dict.brand.name} · {dict.brand.latin}
          </p>
          <h1 className="mt-3 max-w-xl text-4xl font-semibold leading-[1.25] text-ink sm:text-5xl">{dict.brand.tagline}</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted">{dict.brand.secondary}</p>
        </div>
        <SearchForm locale={lang} dict={dict} cities={cities} districts={districts} />
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <div className={`${cardClass} grid gap-4 p-6 md:grid-cols-[.7fr_1.3fr] md:items-center`}>
          <h2 className="text-2xl font-semibold">{dict.trust.title}</h2>
          <p className="leading-8 text-muted">{dict.trust.body}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-3xl font-semibold">{dict.cities.title}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {cities.map((city) => (
            <article key={city.slug} className={`${cardClass} p-6`}>
              <h3 className="text-2xl font-semibold">{pick(lang, city.nameAr, city.nameEn)}</h3>
              <p className="mt-3 leading-8 text-muted">{pick(lang, city.summaryAr, city.summaryEn)}</p>
              <p className="mt-3 text-sm text-muted">
                {districts.filter((district) => district.citySlug === city.slug).length} {lang === "ar" ? "حيًا" : "districts"}
              </p>
              <Link className={`${goldButtonClass} mt-5`} href={withLocale(lang, `/${city.slug}`)}>
                {dict.cities.view}
              </Link>
            </article>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">{dict.cities.future}</p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-4">
        <h2 className="text-3xl font-semibold">{dict.journey.title}</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-4">
          {dict.journey.steps.map((step, index) => (
            <li key={step.title} className={`${cardClass} p-5`}>
              <span className="text-sm font-semibold text-gold-deep">0{index + 1}</span>
              <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="rounded-[2rem] bg-ink px-6 py-10 text-paper sm:px-10">
          <p className="text-sm font-semibold text-gold">{dict.partnerStrip.kicker}</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight">{dict.partnerStrip.title}</h2>
          <p className="mt-4 max-w-2xl leading-8 text-white/75">{dict.partnerStrip.body}</p>
          <Link className={`${goldButtonClass} mt-6`} href={withLocale(lang, "/partners")}>
            {dict.partnerStrip.cta}
          </Link>
        </div>
      </section>
    </div>
  );
}
