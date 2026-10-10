"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { localizePath, withLocale, type Locale } from "@/lib/locale";

type CityLink = { slug: string; label: string };

export function HeaderBar({
  locale,
  name,
  latin,
  labels,
  cities,
}: {
  locale: Locale;
  name: string;
  latin: string;
  labels: { home: string; search: string; partners: string; menu: string; close: string };
  cities: CityLink[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const other = locale === "ar" ? "en" : "ar";
  const links = [
    { href: withLocale(locale, "/"), label: labels.home },
    { href: withLocale(locale, "/search"), label: labels.search },
    ...cities.map((city) => ({ href: withLocale(locale, `/${city.slug}`), label: city.label })),
    { href: withLocale(locale, "/partners"), label: labels.partners },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Logo locale={locale} name={name} latin={latin} />
        <nav className="hidden items-center gap-6 text-sm font-medium lg:flex" aria-label="Main">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-ink/80 transition hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href={localizePath(pathname, other)}
            hrefLang={other}
            className="inline-flex h-10 items-center rounded-full border border-line px-3 text-sm font-semibold"
          >
            {locale === "ar" ? "English" : "العربية"}
          </Link>
          <button
            type="button"
            className="inline-flex h-10 items-center rounded-full border border-line px-3 text-sm font-semibold lg:hidden"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? labels.close : labels.menu}
          </button>
        </div>
      </div>
      {open ? (
        <nav className="grid gap-1 border-t border-line px-4 py-3 lg:hidden" aria-label="Mobile">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-2xl px-3 py-3 text-base hover:bg-ivory" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
