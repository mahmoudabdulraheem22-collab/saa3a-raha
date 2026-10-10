import Link from "next/link";
import { withLocale, type Locale } from "@/lib/locale";

export function Logo({ locale, name, latin }: { locale: Locale; name: string; latin: string }) {
  return (
    <Link href={withLocale(locale, "/")} className="flex items-center gap-3">
      <svg viewBox="0 0 40 40" className="h-10 w-10 shrink-0" aria-hidden>
        <rect width="40" height="40" rx="12" fill="#171512" />
        <circle cx="20" cy="20" r="10" fill="none" stroke="#D4AF37" strokeWidth="1.6" />
        <path d="M20 8v4M20 28v4M8 20h4M28 20h4" stroke="#D4AF37" strokeWidth="1.4" />
      </svg>
      <span className="grid leading-tight">
        <span className="text-base font-semibold">{name}</span>
        <span className="text-xs text-muted">{latin}</span>
      </span>
    </Link>
  );
}
