import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/db";
import type { PublicCity, PublicDistrict, PublicHotel, PublicLandmark } from "@/lib/types";

const hotelInclude = {
  city: true,
  district: true,
  photos: { orderBy: { sortOrder: "asc" as const } },
  rooms: {
    orderBy: { sortOrder: "asc" as const },
    include: { prices: true },
  },
  distances: { include: { landmark: { include: { city: true } } } },
  _count: { select: { bookings: { where: { status: "confirmed" } } } },
} as const;

type HotelRecord = Awaited<ReturnType<typeof loadHotels>>[number];

async function loadHotels() {
  return prisma.hotel.findMany({
    where: { status: "published" },
    include: hotelInclude,
  });
}

function toHotel(hotel: HotelRecord): PublicHotel {
  return {
    id: hotel.id,
    slug: hotel.slug,
    nameAr: hotel.nameAr,
    nameEn: hotel.nameEn,
    citySlug: hotel.city.slug,
    cityNameAr: hotel.city.nameAr,
    cityNameEn: hotel.city.nameEn,
    districtSlug: hotel.district.slug,
    districtNameAr: hotel.district.nameAr,
    districtNameEn: hotel.district.nameEn,
    classification: hotel.classification,
    descriptionAr: hotel.descriptionAr,
    descriptionEn: hotel.descriptionEn,
    lat: hotel.lat,
    lng: hotel.lng,
    bookingModel: hotel.bookingModel === "instant" ? "instant" : "request",
    liveInventory: hotel.liveInventory,
    sponsored: hotel.sponsored,
    whatsapp: hotel.whatsapp,
    phone: hotel.phone,
    email: hotel.email,
    parking: hotel.parking,
    accessibility: hotel.accessibility,
    luggageStorage: hotel.luggageStorage,
    wifi: hotel.wifi,
    policiesAr: hotel.policiesAr,
    policiesEn: hotel.policiesEn,
    checkInAr: hotel.checkInAr,
    checkInEn: hotel.checkInEn,
    cancellationAr: hotel.cancellationAr,
    cancellationEn: hotel.cancellationEn,
    recommendedRank: hotel.recommendedRank,
    confirmedBookings: hotel._count.bookings,
    photos: hotel.photos.map((photo) => ({
      url: photo.url,
      altAr: photo.altAr,
      altEn: photo.altEn,
      verified: photo.verified,
    })),
    rooms: hotel.rooms.map((room) => ({
      id: room.id,
      nameAr: room.nameAr,
      nameEn: room.nameEn,
      roomType: room.roomType,
      capacity: room.capacity,
      privateBath: room.privateBath,
      durations: room.prices.map((price) => ({
        id: price.durationId,
        amountHalalas: price.amountHalalas,
      })),
    })),
    distances: hotel.distances.map((distance) => ({
      landmarkSlug: distance.landmark.slug,
      citySlug: distance.landmark.city.slug,
      nameAr: distance.landmark.nameAr,
      nameEn: distance.landmark.nameEn,
      meters: distance.meters,
      verifiedOn: distance.verifiedOn,
      sourceNote: distance.sourceNote,
    })),
  };
}

export async function getPublishedHotels() {
  "use cache";
  cacheLife("minutes");
  cacheTag("hotels");
  const hotels = await loadHotels();
  return hotels.map(toHotel);
}

export async function getHotelBySlug(slug: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag("hotels");
  const hotels = await loadHotels();
  const hotel = hotels.find((item) => item.slug === slug);
  return hotel ? toHotel(hotel) : null;
}

export async function getActiveCities(): Promise<PublicCity[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("geography");
  const cities = await prisma.city.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
  return cities.map((city) => ({
    slug: city.slug,
    nameAr: city.nameAr,
    nameEn: city.nameEn,
    summaryAr: city.summaryAr,
    summaryEn: city.summaryEn,
    lat: city.lat,
    lng: city.lng,
  }));
}

export async function getCity(slug: string) {
  const cities = await getActiveCities();
  return cities.find((city) => city.slug === slug) ?? null;
}

export async function getDistricts(): Promise<PublicDistrict[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("geography");
  const districts = await prisma.district.findMany({
    where: { city: { active: true } },
    include: { city: true },
    orderBy: [{ city: { sortOrder: "asc" } }, { sortOrder: "asc" }],
  });
  return districts.map((district) => ({
    slug: district.slug,
    citySlug: district.city.slug,
    nameAr: district.nameAr,
    nameEn: district.nameEn,
    summaryAr: district.summaryAr,
    summaryEn: district.summaryEn,
  }));
}

export async function getDistrict(citySlug: string, districtSlug: string) {
  const districts = await getDistricts();
  return districts.find((district) => district.citySlug === citySlug && district.slug === districtSlug) ?? null;
}

export async function getLandmarks(): Promise<PublicLandmark[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("geography");
  const landmarks = await prisma.landmark.findMany({ include: { city: true } });
  return landmarks
    .filter((landmark) => landmark.city.active)
    .map((landmark) => ({
      slug: landmark.slug,
      citySlug: landmark.city.slug,
      nameAr: landmark.nameAr,
      nameEn: landmark.nameEn,
      lat: landmark.lat,
      lng: landmark.lng,
    }));
}
