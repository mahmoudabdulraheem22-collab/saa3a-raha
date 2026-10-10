"use client";

import { useActionState, useMemo, useState } from "react";
import type { Dictionary } from "@/i18n/ar";
import { submitPartner } from "@/lib/actions";
import { controlClass, goldButtonClass } from "@/components/ui";
import type { Locale } from "@/lib/locale";
import type { PublicCity, PublicDistrict } from "@/lib/types";

export function PartnerForm({
  locale,
  dict,
  cities,
  districts,
}: {
  locale: Locale;
  dict: Dictionary;
  cities: PublicCity[];
  districts: PublicDistrict[];
}) {
  const [state, action, pending] = useActionState(submitPartner, null);
  const [city, setCity] = useState(cities[0]?.slug ?? "");
  const visible = useMemo(() => districts.filter((item) => item.citySlug === city), [city, districts]);

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="locale" value={locale} />
      <input className="hidden" tabIndex={-1} autoComplete="off" name="company_website" aria-hidden />
      {state?.ok === false ? <p className="rounded-2xl bg-[#f8ece8] px-4 py-3 text-sm">{dict.booking.missing}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          {dict.partner.fields.hotelName}
          <input className={controlClass} name="hotelName" required />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          {dict.partner.fields.commercialName}
          <input className={controlClass} name="commercialName" required />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          {dict.partner.fields.city}
          <select className={controlClass} name="citySlug" value={city} onChange={(event) => setCity(event.target.value)}>
            {cities.map((item) => (
              <option key={item.slug} value={item.slug}>
                {locale === "ar" ? item.nameAr : item.nameEn}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          {dict.partner.fields.district}
          <select key={city} className={controlClass} name="districtSlug" defaultValue={visible[0]?.slug}>
            {visible.map((item) => (
              <option key={item.slug} value={item.slug}>
                {locale === "ar" ? item.nameAr : item.nameEn}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium sm:col-span-2">
          {dict.partner.fields.classification}
          <input className={controlClass} name="classification" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          {dict.partner.fields.contact}
          <input className={controlClass} name="contactName" required />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          {dict.partner.fields.mobile}
          <input className={controlClass} name="mobile" inputMode="tel" required />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          {dict.partner.fields.whatsapp}
          <input className={controlClass} name="whatsapp" inputMode="tel" required />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          {dict.partner.fields.email}
          <input className={controlClass} type="email" name="email" required />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          {dict.partner.fields.rooms}
          <input className={controlClass} type="number" min={1} name="roomCount" required />
        </label>
      </div>
      <fieldset className="grid gap-2 text-sm font-medium">
        <legend>{dict.partner.fields.shortStay}</legend>
        <div className="flex gap-4 font-normal">
          <label><input type="radio" name="shortStay" value="yes" required /> {dict.partner.yes}</label>
          <label><input type="radio" name="shortStay" value="no" /> {dict.partner.no}</label>
        </div>
      </fieldset>
      <fieldset className="grid gap-2 text-sm font-medium">
        <legend>{dict.partner.fields.fullNight}</legend>
        <div className="flex gap-4 font-normal">
          <label><input type="radio" name="fullNight" value="yes" required /> {dict.partner.yes}</label>
          <label><input type="radio" name="fullNight" value="no" /> {dict.partner.no}</label>
        </div>
      </fieldset>
      <label className="grid gap-2 text-sm font-medium">
        {dict.partner.fields.message}
        <textarea className={`${controlClass} h-28 py-3`} name="message" />
      </label>
      <button className={goldButtonClass} type="submit" disabled={pending}>
        {dict.partner.cta}
      </button>
    </form>
  );
}
