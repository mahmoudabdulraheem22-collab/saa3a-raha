"use client";

import { useActionState, useMemo, useState } from "react";
import type { Dictionary } from "@/i18n/ar";
import { submitBooking } from "@/lib/actions";
import { controlClass, goldButtonClass, quietButtonClass } from "@/components/ui";
import { formatSar, pick } from "@/lib/format";
import type { Locale } from "@/lib/locale";
import type { PublicHotel } from "@/lib/types";

export function BookingWizard({
  locale,
  dict,
  hotels,
  initial,
}: {
  locale: Locale;
  dict: Dictionary;
  hotels: PublicHotel[];
  initial: { hotel?: string; room?: string; duration?: string; date?: string; time?: string; guests?: string };
}) {
  const [state, action, pending] = useActionState(submitBooking, null);
  const [step, setStep] = useState(0);
  const [hotelSlug, setHotelSlug] = useState(initial.hotel ?? hotels[0]?.slug ?? "");
  const hotel = hotels.find((item) => item.slug === hotelSlug) ?? hotels[0];
  const [roomId, setRoomId] = useState(initial.room ?? hotel?.rooms[0]?.id ?? "");
  const room = hotel?.rooms.find((item) => item.id === roomId) ?? hotel?.rooms[0];
  const [durationId, setDurationId] = useState(initial.duration ?? room?.durations[0]?.id ?? "");
  const duration = room?.durations.find((item) => item.id === durationId);
  const times = useMemo(
    () => Array.from({ length: 48 }, (_, index) => `${String(Math.floor(index / 2)).padStart(2, "0")}:${index % 2 ? "30" : "00"}`),
    [],
  );
  const error =
    state?.error === "unavailable" ? dict.booking.unavailable : state?.error === "datePast" ? dict.booking.datePast : state?.error ? dict.booking.missing : "";

  if (!hotel || !room) {
    return <p className="rounded-3xl border border-line bg-paper p-6 text-muted">{dict.booking.noHotels}</p>;
  }

  const canInstant = hotel.bookingModel === "instant" && hotel.liveInventory;

  return (
    <form
      action={action}
      className="grid gap-5 rounded-3xl border border-line bg-paper p-5"
      onSubmit={(event) => {
        if (step < 2) event.preventDefault();
      }}
    >
      <input type="hidden" name="locale" value={locale} />
      <input className="hidden" tabIndex={-1} autoComplete="off" name="company_website" aria-hidden />
      <ol className="grid gap-2 text-sm sm:grid-cols-3">
        {[dict.booking.stepStay, dict.booking.stepGuest, dict.booking.stepSummary].map((label, index) => (
          <li key={label} className={`rounded-full px-3 py-2 text-center ${step === index ? "bg-ink text-paper" : "bg-ivory text-muted"}`}>
            {index + 1}. {label}
          </li>
        ))}
      </ol>
      {error ? <p className="rounded-2xl bg-[#f8ece8] px-4 py-3 text-sm">{error}</p> : null}
      <div className={step === 0 ? "grid gap-4" : "hidden"}>
        <label className="grid gap-2 text-sm font-medium">
          {dict.search.city}
          <select
            className={controlClass}
            name="hotelSlug"
            value={hotel.slug}
            onChange={(event) => {
              const next = hotels.find((item) => item.slug === event.target.value);
              setHotelSlug(event.target.value);
              setRoomId(next?.rooms[0]?.id ?? "");
              setDurationId(next?.rooms[0]?.durations[0]?.id ?? "");
            }}
          >
            {hotels.map((item) => (
              <option key={item.slug} value={item.slug}>
                {pick(locale, item.nameAr, item.nameEn)}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          {dict.hotel.rooms}
          <select className={controlClass} name="roomId" value={room.id} onChange={(event) => setRoomId(event.target.value)}>
            {hotel.rooms.map((item) => (
              <option key={item.id} value={item.id}>
                {pick(locale, item.nameAr, item.nameEn)} · {item.capacity}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          {dict.search.duration}
          <select className={controlClass} name="durationId" value={duration?.id ?? ""} onChange={(event) => setDurationId(event.target.value)}>
            {room.durations.map((item) => (
              <option key={item.id} value={item.id}>
                {dict.search.durations[item.id as keyof typeof dict.search.durations]}
                {item.amountHalalas != null ? ` · ${formatSar(item.amountHalalas, locale)}` : ""}
              </option>
            ))}
          </select>
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="grid gap-2 text-sm font-medium">
            {dict.search.date}
            <input className={controlClass} type="date" name="date" defaultValue={initial.date} required />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            {dict.search.time}
            <select className={controlClass} name="arrivalTime" defaultValue={initial.time || "15:00"} required>
              {times.map((time) => (
                <option key={time}>{time}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium">
            {dict.search.guests}
            <input className={controlClass} type="number" name="guests" min={1} max={room.capacity} defaultValue={initial.guests || "1"} required />
          </label>
        </div>
        <button className={goldButtonClass} type="button" onClick={() => setStep(1)}>
          {dict.booking.next}
        </button>
      </div>
      <div className={step === 1 ? "grid gap-4" : "hidden"}>
        <label className="grid gap-2 text-sm font-medium">
          {dict.booking.name}
          <input className={controlClass} name="guestName" required />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          {dict.booking.mobile}
          <input className={controlClass} name="mobile" inputMode="tel" required />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          {dict.booking.email}
          <input className={controlClass} type="email" name="email" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          {dict.booking.notes}
          <textarea className={`${controlClass} h-28 py-3`} name="notes" />
        </label>
        <div className="flex gap-3">
          <button className={quietButtonClass} type="button" onClick={() => setStep(0)}>{dict.booking.back}</button>
          <button className={goldButtonClass} type="button" onClick={() => setStep(2)}>{dict.booking.next}</button>
        </div>
      </div>
      <div className={step === 2 ? "grid gap-4" : "hidden"}>
        <div className="rounded-2xl bg-ivory p-4 text-sm leading-7">
          <p className="font-semibold">{dict.booking.summary}</p>
          <p>{pick(locale, hotel.nameAr, hotel.nameEn)}</p>
          <p>{pick(locale, room.nameAr, room.nameEn)}</p>
          <p>{duration ? dict.search.durations[duration.id as keyof typeof dict.search.durations] : ""}</p>
          <p>{duration?.amountHalalas != null ? formatSar(duration.amountHalalas, locale) : dict.card.priceOnRequest}</p>
          <p>{dict.hotel.offerBy}</p>
          <p>{canInstant ? dict.hotel.live : dict.hotel.subject}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className={quietButtonClass} type="button" onClick={() => setStep(1)}>{dict.booking.back}</button>
          <button className={goldButtonClass} name="mode" value="request" disabled={pending}>{dict.booking.submitRequest}</button>
          {canInstant ? (
            <button className={inkButton} name="mode" value="instant" disabled={pending}>{dict.booking.submitInstant}</button>
          ) : null}
        </div>
      </div>
    </form>
  );
}

const inkButton = "inline-flex h-12 items-center justify-center rounded-2xl bg-ink px-5 text-sm font-semibold text-paper disabled:opacity-60";
