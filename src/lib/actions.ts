"use server";

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/admin";
import { isDuration, makeReference, riyadhToday, slugify } from "@/lib/format";
import { isLocale, withLocale, type Locale } from "@/lib/locale";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function localeOf(formData: FormData): Locale {
  const value = text(formData, "locale");
  return isLocale(value) ? value : "ar";
}

function phoneOk(value: string) {
  const digits = value.replace(/[^\d]/g, "");
  return digits.length >= 8 && digits.length <= 15;
}

function emailOk(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function uniqueHotelSlug(base: string) {
  let slug = base || `hotel-${crypto.randomUUID().slice(0, 8)}`;
  let n = 2;
  while (await prisma.hotel.findUnique({ where: { slug } })) {
    slug = `${base}-${n++}`;
  }
  return slug;
}

export async function loginAdmin(formData: FormData) {
  const locale = localeOf(formData);
  const key = process.env.ADMIN_ACCESS_KEY ?? "";
  const given = text(formData, "key");
  const { timingSafeEqual } = await import("crypto");
  const left = Buffer.from(given);
  const right = Buffer.from(key);
  if (!key || left.length !== right.length || !timingSafeEqual(left, right)) {
    redirect(withLocale(locale, "/admin?error=1"));
  }
  (await cookies()).set("sr_admin", given, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  redirect(withLocale(locale, "/admin"));
}

export async function logoutAdmin(formData: FormData) {
  (await cookies()).delete("sr_admin");
  redirect(withLocale(localeOf(formData), "/admin"));
}

export async function setCityActive(formData: FormData) {
  if (!(await isAdmin())) return;
  const slug = text(formData, "slug");
  const active = text(formData, "active") === "1";
  await prisma.city.update({ where: { slug }, data: { active } });
  updateTag("geography");
}

export async function setApplicationStatus(formData: FormData) {
  if (!(await isAdmin())) return;
  const id = text(formData, "id");
  const status = text(formData, "status");
  if (!["submitted", "reviewing", "approved", "declined"].includes(status)) return;
  await prisma.hotelPartner.update({ where: { id }, data: { status } });
}

export async function createHotelDraft(formData: FormData) {
  if (!(await isAdmin())) return;
  const applicationId = text(formData, "applicationId");
  const application = applicationId
    ? await prisma.hotelPartner.findUnique({ where: { id: applicationId }, include: { hotel: true } })
    : null;
  if (application?.hotel) return;
  const nameAr = text(formData, "nameAr") || application?.hotelName || "";
  const nameEn = text(formData, "nameEn") || application?.commercialName || "";
  const citySlug = text(formData, "citySlug") || application?.citySlug || "";
  const districtSlug = text(formData, "districtSlug") || application?.districtSlug || "";
  if (!nameAr || !nameEn || !citySlug || !districtSlug) return;
  const city = await prisma.city.findUnique({ where: { slug: citySlug } });
  const district = city
    ? await prisma.district.findUnique({ where: { cityId_slug: { cityId: city.id, slug: districtSlug } } })
    : null;
  if (!city || !district) return;
  const slug = await uniqueHotelSlug(slugify(nameEn));
  await prisma.hotel.create({
    data: {
      slug,
      partnerId: application?.id,
      cityId: city.id,
      districtId: district.id,
      nameAr,
      nameEn,
      classification: application?.classification ?? "",
      whatsapp: application?.whatsapp ?? "",
      phone: application?.mobile ?? "",
      email: application?.email ?? "",
      status: "draft",
      bookingModel: "request",
      liveInventory: false,
      sponsored: false,
    },
  });
  if (application) {
    await prisma.hotelPartner.update({ where: { id: application.id }, data: { status: "reviewing" } });
  }
  updateTag("hotels");
}

export async function updateHotel(formData: FormData) {
  if (!(await isAdmin())) return;
  const id = text(formData, "id");
  const rank = text(formData, "recommendedRank");
  const lat = text(formData, "lat");
  const lng = text(formData, "lng");
  await prisma.hotel.update({
    where: { id },
    data: {
      nameAr: text(formData, "nameAr"),
      nameEn: text(formData, "nameEn"),
      classification: text(formData, "classification"),
      descriptionAr: text(formData, "descriptionAr"),
      descriptionEn: text(formData, "descriptionEn"),
      whatsapp: text(formData, "whatsapp"),
      phone: text(formData, "phone"),
      email: text(formData, "email"),
      policiesAr: text(formData, "policiesAr"),
      policiesEn: text(formData, "policiesEn"),
      checkInAr: text(formData, "checkInAr"),
      checkInEn: text(formData, "checkInEn"),
      cancellationAr: text(formData, "cancellationAr"),
      cancellationEn: text(formData, "cancellationEn"),
      bookingModel: text(formData, "bookingModel") === "instant" ? "instant" : "request",
      liveInventory: formData.get("liveInventory") === "1",
      sponsored: formData.get("sponsored") === "1",
      wifi: formData.get("wifi") === "1",
      parking: formData.get("parking") === "1",
      accessibility: formData.get("accessibility") === "1",
      luggageStorage: formData.get("luggageStorage") === "1",
      recommendedRank: rank && Number.isFinite(Number(rank)) ? Number(rank) : null,
      lat: lat && Number.isFinite(Number(lat)) ? Number(lat) : null,
      lng: lng && Number.isFinite(Number(lng)) ? Number(lng) : null,
    },
  });
  updateTag("hotels");
}

export async function setHotelStatus(formData: FormData) {
  if (!(await isAdmin())) return;
  const status = text(formData, "status");
  if (!["draft", "published", "suspended"].includes(status)) return;
  await prisma.hotel.update({ where: { id: text(formData, "id") }, data: { status } });
  updateTag("hotels");
}

export async function addRoom(formData: FormData) {
  if (!(await isAdmin())) return;
  const hotelId = text(formData, "hotelId");
  const nameAr = text(formData, "nameAr");
  const nameEn = text(formData, "nameEn");
  const capacity = Number(text(formData, "capacity"));
  if (!hotelId || !nameAr || !nameEn || !Number.isFinite(capacity) || capacity < 1) return;
  const durations = ["1h", "3h", "6h", "12h", "night"].filter((id) => formData.get(`duration-${id}`) === "1");
  const room = await prisma.room.create({
    data: {
      hotelId,
      nameAr,
      nameEn,
      roomType: text(formData, "roomType") || "room",
      capacity,
      privateBath: formData.get("privateBath") === "1",
    },
  });
  for (const durationId of durations) {
    const raw = text(formData, `price-${durationId}`);
    await prisma.roomPrice.create({
      data: {
        roomId: room.id,
        durationId,
        amountHalalas: raw && Number.isFinite(Number(raw)) ? Math.round(Number(raw) * 100) : null,
      },
    });
  }
  updateTag("hotels");
}

export async function addAvailability(formData: FormData) {
  if (!(await isAdmin())) return;
  const roomId = text(formData, "roomId");
  const durationId = text(formData, "durationId");
  const date = text(formData, "date");
  const units = Number(text(formData, "units"));
  const source = text(formData, "source") === "api" ? "api" : "hotel_entry";
  if (!roomId || !isDuration(durationId) || !date || !Number.isFinite(units) || units < 0) return;
  await prisma.availabilitySlot.create({
    data: {
      roomId,
      durationId,
      date,
      arrivalTime: text(formData, "arrivalTime") || null,
      units,
      source,
    },
  });
}

export async function addVerifiedDistance(formData: FormData) {
  if (!(await isAdmin())) return;
  const hotelId = text(formData, "hotelId");
  const landmarkId = text(formData, "landmarkId");
  const meters = Number(text(formData, "meters"));
  const sourceNote = text(formData, "sourceNote");
  if (!hotelId || !landmarkId || !Number.isInteger(meters) || meters < 0 || !sourceNote) return;
  await prisma.verifiedDistance.upsert({
    where: { hotelId_landmarkId: { hotelId, landmarkId } },
    update: { meters, sourceNote, verifiedOn: riyadhToday() },
    create: { hotelId, landmarkId, meters, sourceNote, verifiedOn: riyadhToday() },
  });
  updateTag("hotels");
}

export async function addHotelPhoto(formData: FormData) {
  if (!(await isAdmin())) return;
  const hotelId = text(formData, "hotelId");
  const file = formData.get("photo");
  if (!hotelId || !(file instanceof File) || file.size === 0 || file.size > 5_000_000) return;
  const types: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
  const ext = types[file.type];
  if (!ext) return;
  const filename = `${crypto.randomUUID()}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
  await prisma.hotelPhoto.create({
    data: {
      hotelId,
      url: `/uploads/${filename}`,
      altAr: text(formData, "altAr"),
      altEn: text(formData, "altEn"),
      verified: formData.get("verified") === "1",
    },
  });
  updateTag("hotels");
}

export async function decideRequest(formData: FormData) {
  if (!(await isAdmin())) return;
  const id = text(formData, "id");
  const decision = text(formData, "decision");
  const request = await prisma.bookingRequest.findUnique({ where: { id } });
  if (!request || request.status !== "pending_hotel") return;
  if (decision === "declined") {
    await prisma.bookingRequest.update({ where: { id }, data: { status: "declined" } });
    return;
  }
  if (decision !== "confirmed") return;
  const roomPrice = await prisma.roomPrice.findUnique({
    where: { roomId_durationId: { roomId: request.roomId, durationId: request.durationId } },
  });
  await prisma.$transaction([
    prisma.bookingRequest.update({ where: { id }, data: { status: "confirmed" } }),
    prisma.booking.create({
      data: {
        reference: makeReference("SRB"),
        requestId: request.id,
        hotelId: request.hotelId,
        customerId: request.customerId,
        roomId: request.roomId,
        durationId: request.durationId,
        date: request.date,
        arrivalTime: request.arrivalTime,
        guests: request.guests,
        amountHalalas: roomPrice?.amountHalalas ?? null,
        source: "hotel_confirmation",
        status: "confirmed",
      },
    }),
  ]);
}

export type ActionState = { ok: false; error: string } | null;

export async function submitPartner(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const locale = localeOf(formData);
  if (text(formData, "company_website")) {
    redirect(withLocale(locale, "/partners?sent=1"));
  }
  const hotelName = text(formData, "hotelName");
  const commercialName = text(formData, "commercialName");
  const citySlug = text(formData, "citySlug");
  const districtSlug = text(formData, "districtSlug");
  const contactName = text(formData, "contactName");
  const mobile = text(formData, "mobile");
  const whatsapp = text(formData, "whatsapp");
  const email = text(formData, "email");
  const roomCount = Number(text(formData, "roomCount"));
  const city = await prisma.city.findFirst({ where: { slug: citySlug, active: true } });
  const district = city
    ? await prisma.district.findUnique({ where: { cityId_slug: { cityId: city.id, slug: districtSlug } } })
    : null;
  if (!hotelName || !commercialName || !city || !district || !contactName || !phoneOk(mobile) || !phoneOk(whatsapp) || !emailOk(email)) {
    return { ok: false, error: "missing" };
  }
  if (!Number.isInteger(roomCount) || roomCount < 1 || roomCount > 5000) return { ok: false, error: "missing" };
  const reference = makeReference("SRP");
  await prisma.hotelPartner.create({
    data: {
      reference,
      hotelName,
      commercialName,
      citySlug: city.slug,
      districtSlug: district.slug,
      cityName: city.nameAr,
      districtName: district.nameAr,
      classification: text(formData, "classification"),
      contactName,
      mobile,
      whatsapp,
      email,
      roomCount,
      shortStay: text(formData, "shortStay") === "yes",
      fullNight: text(formData, "fullNight") === "yes",
      message: text(formData, "message").slice(0, 2000),
      status: "submitted",
    },
  });
  redirect(withLocale(locale, `/partners?sent=${reference}`));
}

export async function submitBooking(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const locale = localeOf(formData);
  if (text(formData, "company_website")) {
    redirect(withLocale(locale, "/booking/request"));
  }
  const hotel = await prisma.hotel.findFirst({
    where: { slug: text(formData, "hotelSlug"), status: "published" },
    include: { rooms: { include: { prices: true } } },
  });
  const room = hotel?.rooms.find((item) => item.id === text(formData, "roomId"));
  const durationId = text(formData, "durationId");
  const price = room?.prices.find((item) => item.durationId === durationId);
  const date = text(formData, "date");
  const arrivalTime = text(formData, "arrivalTime");
  const guests = Number(text(formData, "guests"));
  const name = text(formData, "guestName");
  const mobile = text(formData, "mobile");
  const email = text(formData, "email");
  if (!hotel || !room || !price || !isDuration(durationId) || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(arrivalTime)) {
    return { ok: false, error: "missing" };
  }
  if (date < riyadhToday()) return { ok: false, error: "datePast" };
  if (!Number.isInteger(guests) || guests < 1 || guests > room.capacity) return { ok: false, error: "missing" };
  if (!name || !phoneOk(mobile) || (email && !emailOk(email))) return { ok: false, error: "missing" };

  const mode = text(formData, "mode");
  const instant = mode === "instant" && hotel.bookingModel === "instant" && hotel.liveInventory;
  if (mode === "instant" && !instant) return { ok: false, error: "unavailable" };

  const customer = await prisma.customer.create({
    data: { name, mobile, email },
  });

  if (instant) {
    const booked = await prisma.$transaction(async (tx) => {
      const slot = await tx.availabilitySlot.findFirst({
        where: {
          roomId: room.id,
          durationId,
          date,
          units: { gt: 0 },
          OR: [{ arrivalTime: null }, { arrivalTime }],
        },
      });
      if (!slot) return null;
      await tx.availabilitySlot.update({ where: { id: slot.id }, data: { units: { decrement: 1 } } });
      const request = await tx.bookingRequest.create({
        data: {
          reference: makeReference("SRQ"),
          hotelId: hotel.id,
          roomId: room.id,
          customerId: customer.id,
          durationId,
          date,
          arrivalTime,
          guests,
          notes: text(formData, "notes").slice(0, 1000),
          status: "confirmed",
        },
      });
      await tx.booking.create({
        data: {
          reference: makeReference("SRB"),
          requestId: request.id,
          hotelId: hotel.id,
          customerId: customer.id,
          roomId: room.id,
          durationId,
          date,
          arrivalTime,
          guests,
          amountHalalas: price.amountHalalas,
          source: slot.source === "api" ? "live_inventory" : "live_inventory",
          status: "confirmed",
        },
      });
      return request.reference;
    });
    if (!booked) return { ok: false, error: "unavailable" };
    updateTag("hotels");
    redirect(withLocale(locale, `/booking/confirmation/${booked}`));
  }

  const request = await prisma.bookingRequest.create({
    data: {
      reference: makeReference("SRQ"),
      hotelId: hotel.id,
      roomId: room.id,
      customerId: customer.id,
      durationId,
      date,
      arrivalTime,
      guests,
      notes: text(formData, "notes").slice(0, 1000),
      status: "pending_hotel",
    },
  });
  redirect(withLocale(locale, `/booking/confirmation/${request.reference}`));
}
