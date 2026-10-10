import { notFound } from "next/navigation";
import { legalDocuments, legalSlugs, legalUpdated } from "@/content/legal";
import { getDictionary } from "@/i18n/get-dictionary";
import { isLocale } from "@/lib/locale";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return ["ar", "en"].flatMap((lang) => legalSlugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const document = legalDocuments[slug];
  if (!document) return {};
  return pageMeta(lang, document[lang].title, document[lang].sections[0]?.paragraphs[0] ?? document[lang].title, `/legal/${slug}`);
}

export default async function LegalPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const document = legalDocuments[slug]?.[lang];
  if (!document) notFound();
  const dict = getDictionary(lang);

  return (
    <article className="mx-auto grid max-w-3xl gap-8 px-4 py-12">
      <header>
        <h1 className="text-4xl font-semibold">{document.title}</h1>
        <p className="mt-3 text-sm text-muted">
          {dict.legal.updated}: {legalUpdated[lang]}
        </p>
      </header>
      {document.sections.map((section) => (
        <section key={section.heading}>
          <h2 className="text-2xl font-semibold">{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-3 leading-8 text-muted">
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </article>
  );
}
