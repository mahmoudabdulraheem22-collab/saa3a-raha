"use client";

import { useMemo, useState } from "react";
import type { Dictionary } from "@/i18n/ar";
import { controlClass, goldButtonClass } from "@/components/ui";
import { withLocale, type Locale } from "@/lib/locale";
import type { PublicCity, PublicDistrict } from "@/lib/types";

export function SearchForm({
  locale,
  dict,
  cities,
  districts,
  initial,
}: {
  locale: Locale;
  dict: Dictionary;
  cities: PublicCity[];
  districts: PublicDistrict[];
  initial?: { city?: string; district?: string; date?: string; time?: string; duration?: string; guests?: string };
}) {
  const [city, setCity] = useState(initial?.city ?? "");
  const [district, setDistrict] = useState(initial?.district ?? "");
  const visible = useMemo(
    () => districts.filter((item) => !city || item.citySlug === city),
    [city, districts],
  );
  const times = Array.from({ length: 48 }, (_, index) => {
    const hour = String(Math.floor(index / 2)).padStart(2, "0");
    const minute = index % 2 === 0 ? "00" : "30";
    return `${hour}:${minute}`;
  });

  return (
    <form action={withLocale(locale, "/search")} className="grid gap-3 rounded-3xl border border-line bg-paper p-4 shadow-[0_24px_60px_rgba(23,21,18,0.08)] sm:p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          {dict.search.city}
          <select
            name="city"
            className={controlClass}
            value={city}
            onChange={(event) => {
              const next = event.target.value;
              setCity(next);
              if (district && !districts.some((item) => item.citySlug === next && item.slug === district)) setDistrict("");
            }}
          >
            <option value="">{dict.search.anyCity}</option>
            {cities.map((item) => (
              <option key={item.slug} value={item.slug}>
                {locale === "ar" ? item.nameAr : item.nameEn}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          {dict.search.district}
          <select name="district" className={controlClass} value={district} onChange={(event) => setDistrict(event.target.value)}>
            <option value="">{dict.search.allDistricts}</option>
            {visible.map((item) => (
              <option key={`${item.citySlug}-${item.slug}`} value={item.slug}>
                {locale === "ar" ? item.nameAr : item.nameEn}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          {dict.search.date}
          <input className={controlClass} type="date" name="date" defaultValue={initial?.date} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          {dict.search.time}
          <select className={controlClass} name="time" defaultValue={initial?.time ?? ""}>
            <option value="" />
            {times.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          {dict.search.duration}
          <select className={controlClass} name="duration" defaultValue={initial?.duration ?? ""}>
            <option value="">{dict.search.anyDuration}</option>
            {Object.entries(dict.search.durations).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          {dict.search.guests}
          <input className={controlClass} type="number" min={1} max={12} name="guests" defaultValue={initial?.guests} />
        </label>
      </div>
      <button className={`${goldButtonClass} w-full text-base`} type="submit">
        {dict.search.cta}
      </button>
      <p className="text-xs leading-6 text-muted">{dict.durationNote}</p>
    </form>
  );
}
