export type DurationOffer = {
  id: string;
  amountHalalas: number | null;
};

export type PublicRoom = {
  id: string;
  nameAr: string;
  nameEn: string;
  roomType: string;
  capacity: number;
  privateBath: boolean;
  durations: DurationOffer[];
};

export type PublicDistance = {
  landmarkSlug: string;
  citySlug: string;
  nameAr: string;
  nameEn: string;
  meters: number;
  verifiedOn: string;
  sourceNote: string;
};

export type PublicPhoto = {
  url: string;
  altAr: string;
  altEn: string;
  verified: boolean;
};

export type PublicHotel = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  citySlug: string;
  cityNameAr: string;
  cityNameEn: string;
  districtSlug: string;
  districtNameAr: string;
  districtNameEn: string;
  classification: string;
  descriptionAr: string;
  descriptionEn: string;
  lat: number | null;
  lng: number | null;
  bookingModel: "instant" | "request";
  liveInventory: boolean;
  sponsored: boolean;
  whatsapp: string;
  phone: string;
  email: string;
  parking: boolean;
  accessibility: boolean;
  luggageStorage: boolean;
  wifi: boolean;
  policiesAr: string;
  policiesEn: string;
  checkInAr: string;
  checkInEn: string;
  cancellationAr: string;
  cancellationEn: string;
  recommendedRank: number | null;
  confirmedBookings: number;
  photos: PublicPhoto[];
  rooms: PublicRoom[];
  distances: PublicDistance[];
};

export type PublicCity = {
  slug: string;
  nameAr: string;
  nameEn: string;
  summaryAr: string;
  summaryEn: string;
  lat: number | null;
  lng: number | null;
};

export type PublicDistrict = {
  slug: string;
  citySlug: string;
  nameAr: string;
  nameEn: string;
  summaryAr: string;
  summaryEn: string;
};

export type PublicLandmark = {
  slug: string;
  citySlug: string;
  nameAr: string;
  nameEn: string;
  lat: number;
  lng: number;
};

export type SearchQuery = {
  city?: string;
  district?: string;
  date?: string;
  time?: string;
  duration?: string;
  guests?: string;
  priceMin?: string;
  priceMax?: string;
  distance?: string;
  classification?: string;
  roomType?: string;
  privateBath?: string;
  wifi?: string;
  parking?: string;
  accessibility?: string;
  luggage?: string;
  shortStay?: string;
  fullNight?: string;
  sort?: string;
  compare?: string;
};
