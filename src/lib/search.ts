import { durationRank, isDuration } from "@/lib/format";
import type { PublicHotel, SearchQuery } from "@/lib/types";

function lowestPrice(hotel: PublicHotel) {
  const amounts = hotel.rooms.flatMap((room) =>
    room.durations.map((duration) => duration.amountHalalas).filter((amount): amount is number => amount != null),
  );
  return amounts.length ? Math.min(...amounts) : null;
}

function shortestDuration(hotel: PublicHotel) {
  const ranks = hotel.rooms.flatMap((room) => room.durations.map((duration) => durationRank(duration.id)));
  return ranks.length ? Math.min(...ranks) : 99;
}

function offersDuration(hotel: PublicHotel, durationId: string) {
  return hotel.rooms.some((room) => room.durations.some((duration) => duration.id === durationId));
}

export function filterHotels(hotels: PublicHotel[], query: SearchQuery) {
  const guests = Number(query.guests);
  const min = query.priceMin ? Math.round(Number(query.priceMin) * 100) : null;
  const max = query.priceMax ? Math.round(Number(query.priceMax) * 100) : null;
  const distance = query.distance ? Number(query.distance) : null;

  const filtered = hotels.filter((hotel) => {
    if (query.city && hotel.citySlug !== query.city) return false;
    if (query.district && hotel.districtSlug !== query.district) return false;
    if (isDuration(query.duration) && !offersDuration(hotel, query.duration)) return false;
    if (Number.isFinite(guests) && guests > 0) {
      if (!hotel.rooms.some((room) => room.capacity >= guests)) return false;
    }
    if (query.classification && !hotel.classification.toLowerCase().includes(query.classification.toLowerCase())) {
      return false;
    }
    if (query.roomType && !hotel.rooms.some((room) => room.roomType === query.roomType)) return false;
    if (query.privateBath === "1" && !hotel.rooms.some((room) => room.privateBath)) return false;
    if (query.wifi === "1" && !hotel.wifi) return false;
    if (query.parking === "1" && !hotel.parking) return false;
    if (query.accessibility === "1" && !hotel.accessibility) return false;
    if (query.luggage === "1" && !hotel.luggageStorage) return false;
    if (query.shortStay === "1" && !hotel.rooms.some((room) => room.durations.some((duration) => duration.id !== "night"))) {
      return false;
    }
    if (query.fullNight === "1" && !offersDuration(hotel, "night")) return false;
    const price = lowestPrice(hotel);
    if (min != null && Number.isFinite(min) && (price == null || price < min)) return false;
    if (max != null && Number.isFinite(max) && (price == null || price > max)) return false;
    if (distance != null && Number.isFinite(distance) && query.city) {
      const verified = hotel.distances.filter((item) => item.citySlug === query.city);
      if (!verified.some((item) => item.meters <= distance)) return false;
    }
    return true;
  });

  const sponsored = filtered.filter((hotel) => hotel.sponsored);
  const organic = filtered.filter((hotel) => !hotel.sponsored);
  const sort = query.sort || "recommended";

  organic.sort((a, b) => {
    if (sort === "price") {
      const left = lowestPrice(a);
      const right = lowestPrice(b);
      if (left == null && right == null) return 0;
      if (left == null) return 1;
      if (right == null) return -1;
      return left - right;
    }
    if (sort === "distance") {
      const left = nearest(a, query.city);
      const right = nearest(b, query.city);
      if (left == null && right == null) return 0;
      if (left == null) return 1;
      if (right == null) return -1;
      return left - right;
    }
    if (sort === "popular") return b.confirmedBookings - a.confirmedBookings;
    if (sort === "duration") return shortestDuration(a) - shortestDuration(b);
    const left = a.recommendedRank;
    const right = b.recommendedRank;
    if (left == null && right == null) return 0;
    if (left == null) return 1;
    if (right == null) return -1;
    return left - right;
  });

  return { sponsored, organic };
}

function nearest(hotel: PublicHotel, city?: string) {
  const items = hotel.distances.filter((item) => !city || item.citySlug === city);
  if (!items.length) return null;
  return Math.min(...items.map((item) => item.meters));
}

export function compareSlugs(query: SearchQuery) {
  return (query.compare ?? "")
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean)
    .slice(0, 3);
}
