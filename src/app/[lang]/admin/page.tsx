import { notFound } from "next/navigation";
import { Suspense } from "react";
import { cardClass } from "@/components/ui";
import { getDictionary } from "@/i18n/get-dictionary";
import {
  addAvailability,
  addHotelPhoto,
  addRoom,
  addVerifiedDistance,
  createHotelDraft,
  decideRequest,
  loginAdmin,
  logoutAdmin,
  setApplicationStatus,
  setCityActive,
  setHotelStatus,
  updateHotel,
} from "@/lib/actions";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { pick } from "@/lib/format";
import { isLocale } from "@/lib/locale";

export const metadata = { robots: { index: false, follow: false } };

export default function AdminPage({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 py-16 text-muted">…</div>}>
      <AdminScreen params={params} />
    </Suspense>
  );
}

async function AdminScreen({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  if (!(await isAdmin())) {
    return (
      <form action={loginAdmin} className="mx-auto grid max-w-md gap-4 px-4 py-16">
        <h1 className="text-3xl font-semibold">{dict.admin.title}</h1>
        <p className="text-sm text-muted">{dict.admin.locked}</p>
        <input type="hidden" name="locale" value={lang} />
        <input className="h-12 rounded-2xl border border-line px-4" type="password" name="key" placeholder={dict.admin.key} />
        <button className="h-12 rounded-2xl bg-ink text-sm font-semibold text-paper" type="submit">{dict.admin.enter}</button>
      </form>
    );
  }

  const [cities, applications, requests, models, hotels, landmarks] = await Promise.all([
    prisma.city.findMany({ orderBy: { sortOrder: "asc" }, include: { districts: { orderBy: { sortOrder: "asc" } } } }),
    prisma.hotelPartner.findMany({ orderBy: { createdAt: "desc" }, include: { hotel: true } }),
    prisma.bookingRequest.findMany({ include: { hotel: true, customer: true }, orderBy: { createdAt: "desc" }, take: 40 }),
    prisma.commercialModel.findMany({ orderBy: { code: "asc" } }),
    prisma.hotel.findMany({ include: { city: true, district: true, rooms: true }, orderBy: { createdAt: "desc" } }),
    prisma.landmark.findMany({ include: { city: true } }),
  ]);

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-semibold">{dict.admin.title}</h1>
        <form action={logoutAdmin}>
          <input type="hidden" name="locale" value={lang} />
          <button className="h-10 rounded-full border border-line px-4 text-sm" type="submit">{dict.admin.logout}</button>
        </form>
      </header>

      <section>
        <h2 className="text-xl font-semibold">{dict.admin.cities}</h2>
        <ul className="mt-3 grid gap-2">
          {cities.map((city) => (
            <li key={city.id} className={`${cardClass} flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm`}>
              <span>{pick(lang, city.nameAr, city.nameEn)} · {city.active ? "●" : "○"} · {city.districts.length}</span>
              <form action={setCityActive}>
                <input type="hidden" name="slug" value={city.slug} />
                <input type="hidden" name="active" value={city.active ? "0" : "1"} />
                <button className="h-10 rounded-full bg-ivory px-4" type="submit">{city.active ? dict.admin.deactivate : dict.admin.activate}</button>
              </form>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">{dict.admin.models}</h2>
        <ul className="mt-3 grid gap-2">
          {models.map((model) => (
            <li key={model.id} className={`${cardClass} p-4 text-sm`}>
              <p className="font-semibold">{pick(lang, model.nameAr, model.nameEn)}</p>
              <p className="text-muted">{pick(lang, model.descriptionAr, model.descriptionEn)}</p>
              <p className="mt-1 text-muted">{model.publicDisclosure && model.rateBps != null ? model.rateBps : dict.admin.rateHidden}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">{dict.admin.applications}</h2>
        {applications.length === 0 ? <p className="text-sm text-muted">{dict.admin.noData}</p> : null}
        {applications.map((application) => (
          <article key={application.id} className={`${cardClass} grid gap-3 p-4 text-sm`}>
            <p className="font-semibold">{application.reference} · {application.hotelName} · {application.status}</p>
            <p className="text-muted">{application.cityName} · {application.districtName} · {application.contactName} · {application.mobile}</p>
            <div className="flex flex-wrap gap-2">
              {["reviewing", "approved", "declined"].map((status) => (
                <form key={status} action={setApplicationStatus}>
                  <input type="hidden" name="id" value={application.id} />
                  <input type="hidden" name="status" value={status} />
                  <button className="h-10 rounded-full border border-line px-3" type="submit">{status}</button>
                </form>
              ))}
              {!application.hotel ? (
                <form action={createHotelDraft}>
                  <input type="hidden" name="applicationId" value={application.id} />
                  <button className="h-10 rounded-full bg-gold px-3 font-semibold" type="submit">{dict.admin.createHotel}</button>
                </form>
              ) : null}
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-4">
        <h2 className="text-xl font-semibold">{lang === "ar" ? "الفنادق" : "Hotels"}</h2>
        {hotels.length === 0 ? <p className="text-sm text-muted">{dict.admin.noData}</p> : null}
        {hotels.map((hotel) => (
          <details key={hotel.id} className={`${cardClass} p-4`}>
            <summary className="cursor-pointer font-semibold">
              {pick(lang, hotel.nameAr, hotel.nameEn)} · {hotel.status}{hotel.sponsored ? ` · ${dict.admin.sponsored}` : ""}
            </summary>
            <form action={updateHotel} className="mt-4 grid gap-3 text-sm md:grid-cols-2">
              <input type="hidden" name="id" value={hotel.id} />
              <input className="h-11 rounded-2xl border border-line px-3" name="nameAr" defaultValue={hotel.nameAr} />
              <input className="h-11 rounded-2xl border border-line px-3" name="nameEn" defaultValue={hotel.nameEn} />
              <input className="h-11 rounded-2xl border border-line px-3" name="classification" defaultValue={hotel.classification} />
              <input className="h-11 rounded-2xl border border-line px-3" name="whatsapp" defaultValue={hotel.whatsapp} />
              <input className="h-11 rounded-2xl border border-line px-3" name="phone" defaultValue={hotel.phone} />
              <input className="h-11 rounded-2xl border border-line px-3" name="email" defaultValue={hotel.email} />
              <input className="h-11 rounded-2xl border border-line px-3" name="lat" defaultValue={hotel.lat ?? ""} placeholder="lat" />
              <input className="h-11 rounded-2xl border border-line px-3" name="lng" defaultValue={hotel.lng ?? ""} placeholder="lng" />
              <input className="h-11 rounded-2xl border border-line px-3" name="recommendedRank" defaultValue={hotel.recommendedRank ?? ""} placeholder="rank" />
              <select className="h-11 rounded-2xl border border-line px-3" name="bookingModel" defaultValue={hotel.bookingModel}>
                <option value="request">request</option>
                <option value="instant">instant</option>
              </select>
              <label className="flex items-center gap-2"><input type="checkbox" name="liveInventory" value="1" defaultChecked={hotel.liveInventory} /> live inventory</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="sponsored" value="1" defaultChecked={hotel.sponsored} /> {dict.admin.sponsored}</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="wifi" value="1" defaultChecked={hotel.wifi} /> Wi-Fi</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="parking" value="1" defaultChecked={hotel.parking} /> parking</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="accessibility" value="1" defaultChecked={hotel.accessibility} /> access</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="luggageStorage" value="1" defaultChecked={hotel.luggageStorage} /> luggage</label>
              <textarea className="min-h-24 rounded-2xl border border-line px-3 py-2 md:col-span-2" name="descriptionAr" defaultValue={hotel.descriptionAr} />
              <textarea className="min-h-24 rounded-2xl border border-line px-3 py-2 md:col-span-2" name="descriptionEn" defaultValue={hotel.descriptionEn} />
              <textarea className="min-h-20 rounded-2xl border border-line px-3 py-2" name="policiesAr" defaultValue={hotel.policiesAr} />
              <textarea className="min-h-20 rounded-2xl border border-line px-3 py-2" name="policiesEn" defaultValue={hotel.policiesEn} />
              <textarea className="min-h-20 rounded-2xl border border-line px-3 py-2" name="checkInAr" defaultValue={hotel.checkInAr} />
              <textarea className="min-h-20 rounded-2xl border border-line px-3 py-2" name="checkInEn" defaultValue={hotel.checkInEn} />
              <textarea className="min-h-20 rounded-2xl border border-line px-3 py-2" name="cancellationAr" defaultValue={hotel.cancellationAr} />
              <textarea className="min-h-20 rounded-2xl border border-line px-3 py-2" name="cancellationEn" defaultValue={hotel.cancellationEn} />
              <button className="h-11 rounded-2xl bg-ink text-paper md:col-span-2" type="submit">{dict.admin.save}</button>
            </form>
            <div className="mt-3 flex flex-wrap gap-2">
              {["draft", "published", "suspended"].map((status) => (
                <form key={status} action={setHotelStatus}>
                  <input type="hidden" name="id" value={hotel.id} />
                  <input type="hidden" name="status" value={status} />
                  <button className="h-10 rounded-full border border-line px-3 text-sm" type="submit">{status}</button>
                </form>
              ))}
            </div>
            <form action={addRoom} className="mt-4 grid gap-2 text-sm md:grid-cols-2">
              <input type="hidden" name="hotelId" value={hotel.id} />
              <input className="h-11 rounded-2xl border border-line px-3" name="nameAr" placeholder="اسم الغرفة" required />
              <input className="h-11 rounded-2xl border border-line px-3" name="nameEn" placeholder="Room name" required />
              <input className="h-11 rounded-2xl border border-line px-3" type="number" min={1} name="capacity" placeholder="capacity" required />
              <select className="h-11 rounded-2xl border border-line px-3" name="roomType" defaultValue="room">
                <option value="room">room</option>
                <option value="suite">suite</option>
                <option value="studio">studio</option>
                <option value="apartment">apartment</option>
              </select>
              <label className="flex items-center gap-2"><input type="checkbox" name="privateBath" value="1" /> private bath</label>
              {["1h", "3h", "6h", "12h", "night"].map((id) => (
                <label key={id} className="flex items-center gap-2">
                  <input type="checkbox" name={`duration-${id}`} value="1" /> {id}
                  <input className="h-10 w-28 rounded-xl border border-line px-2" name={`price-${id}`} placeholder="SAR" />
                </label>
              ))}
              <button className="h-11 rounded-2xl bg-gold font-semibold md:col-span-2" type="submit">{dict.admin.addRoom}</button>
            </form>
            <form action={addHotelPhoto} className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <input type="hidden" name="hotelId" value={hotel.id} />
              <input type="file" name="photo" accept="image/jpeg,image/png,image/webp" />
              <input className="h-10 rounded-xl border border-line px-2" name="altAr" placeholder="وصف" />
              <input className="h-10 rounded-xl border border-line px-2" name="altEn" placeholder="Alt" />
              <label className="flex items-center gap-2"><input type="checkbox" name="verified" value="1" /> verified</label>
              <button className="h-10 rounded-full border border-line px-3" type="submit">photo</button>
            </form>
            <form action={addVerifiedDistance} className="mt-3 flex flex-wrap gap-2 text-sm">
              <input type="hidden" name="hotelId" value={hotel.id} />
              <select className="h-10 rounded-xl border border-line px-2" name="landmarkId">
                {landmarks.filter((landmark) => landmark.cityId === hotel.cityId).map((landmark) => (
                  <option key={landmark.id} value={landmark.id}>{landmark.nameEn}</option>
                ))}
              </select>
              <input className="h-10 w-28 rounded-xl border border-line px-2" type="number" min={0} name="meters" placeholder="meters" />
              <input className="h-10 rounded-xl border border-line px-2" name="sourceNote" placeholder="source" />
              <button className="h-10 rounded-full border border-line px-3" type="submit">distance</button>
            </form>
            {hotel.rooms.map((room) => (
              <form key={room.id} action={addAvailability} className="mt-2 flex flex-wrap gap-2 text-sm">
                <input type="hidden" name="roomId" value={room.id} />
                <span className="self-center">{room.nameEn}</span>
                <select className="h-10 rounded-xl border border-line px-2" name="durationId">
                  {["1h", "3h", "6h", "12h", "night"].map((id) => <option key={id}>{id}</option>)}
                </select>
                <input className="h-10 rounded-xl border border-line px-2" type="date" name="date" required />
                <input className="h-10 rounded-xl border border-line px-2" name="arrivalTime" placeholder="HH:mm" />
                <input className="h-10 w-20 rounded-xl border border-line px-2" type="number" min={0} name="units" defaultValue={1} />
                <select className="h-10 rounded-xl border border-line px-2" name="source"><option value="hotel_entry">hotel</option><option value="api">api</option></select>
                <button className="h-10 rounded-full border border-line px-3" type="submit">slot</button>
              </form>
            ))}
          </details>
        ))}
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-semibold">{dict.admin.requests}</h2>
        {requests.length === 0 ? <p className="text-sm text-muted">{dict.admin.noData}</p> : null}
        {requests.map((request) => (
          <article key={request.id} className={`${cardClass} p-4 text-sm`}>
            <p className="font-semibold">{request.reference} · {request.status}</p>
            <p>{pick(lang, request.hotel.nameAr, request.hotel.nameEn)} · {request.date} · {request.arrivalTime} · {request.durationId}</p>
            <p className="text-muted">{request.customer.name} · {request.customer.mobile}</p>
            {request.status === "pending_hotel" ? (
              <div className="mt-2 flex gap-2">
                <form action={decideRequest}>
                  <input type="hidden" name="id" value={request.id} />
                  <input type="hidden" name="decision" value="confirmed" />
                  <button className="h-10 rounded-full bg-pine px-3 text-paper" type="submit">{dict.admin.confirm}</button>
                </form>
                <form action={decideRequest}>
                  <input type="hidden" name="id" value={request.id} />
                  <input type="hidden" name="decision" value="declined" />
                  <button className="h-10 rounded-full border border-line px-3" type="submit">{dict.admin.decline}</button>
                </form>
              </div>
            ) : null}
          </article>
        ))}
      </section>
    </div>
  );
}
