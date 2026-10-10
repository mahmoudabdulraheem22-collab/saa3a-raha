import Link from "next/link";
import type { Dictionary } from "@/i18n/ar";
import { withLocale, type Locale } from "@/lib/locale";

const legal = [
  ["terms", "terms"],
  ["privacy", "privacy"],
  ["cancellation", "cancellation"],
  ["partner-terms", "partnerTerms"],
  ["booking-terms", "bookingTerms"],
] as const;

export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <footer className="mt-16 border-t border-line bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.3fr_.7fr_.7fr]">
        <div>
          <p className="text-lg font-semibold">{dict.brand.name}</p>
          <p className="mt-1 text-sm text-gold">{dict.brand.latin}</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/75">{dict.footer.blurb}</p>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/75">{dict.trust.body}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-gold">{dict.footer.legal}</p>
          <ul className="mt-3 grid gap-2 text-sm">
            {legal.map(([slug, key]) => (
              <li key={slug}>
                <Link href={withLocale(locale, `/legal/${slug}`)} className="text-white/80 hover:text-white">
                  {dict.legal[key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-gold">{dict.nav.partners}</p>
          <ul className="mt-3 grid gap-2 text-sm">
            <li>
              <Link href={withLocale(locale, "/partners")} className="text-white/80 hover:text-white">
                {dict.partner.cta}
              </Link>
            </li>
            <li>
              <Link href={withLocale(locale, "/partner")} className="text-white/80 hover:text-white">
                {dict.footer.partnerDesk}
              </Link>
            </li>
            <li>
              <Link href={withLocale(locale, "/admin")} className="text-white/80 hover:text-white">
                {dict.footer.operations}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/60">
        © 2026 {dict.brand.name}. {dict.footer.rights}.
      </div>
    </footer>
  );
}
