export type DistrictSeed = {
  slug: string;
  nameAr: string;
  nameEn: string;
};

export const durationSeeds = [
  { id: "1h", hours: 1, nameAr: "ساعة واحدة", nameEn: "1 Hour", sortOrder: 1 },
  { id: "3h", hours: 3, nameAr: "3 ساعات", nameEn: "3 Hours", sortOrder: 2 },
  { id: "6h", hours: 6, nameAr: "6 ساعات", nameEn: "6 Hours", sortOrder: 3 },
  { id: "12h", hours: 12, nameAr: "12 ساعة", nameEn: "12 Hours", sortOrder: 4 },
  { id: "night", hours: null, nameAr: "ليلة كاملة", nameEn: "Full Night", sortOrder: 5 },
] as const;

export const citySeeds = [
  {
    slug: "makkah",
    nameAr: "مكة المكرمة",
    nameEn: "Makkah",
    active: true,
    lat: 21.422487,
    lng: 39.826206,
    sortOrder: 1,
    summaryAr:
      "تغطي ساعة راحة فنادق مكة المشاركة، من وسط الحرم إلى الأحياء المحيطة. كل فندق ينشر غرفه ومدد الإقامة وأسعاره وسياساته بنفسه.",
    summaryEn:
      "Saa3a Raha covers participating hotels in Makkah, from the central Haram area to surrounding districts. Each hotel publishes its own rooms, stay durations, prices and policies.",
  },
  {
    slug: "madinah",
    nameAr: "المدينة المنورة",
    nameEn: "Madinah",
    active: true,
    lat: 24.467213,
    lng: 39.611065,
    sortOrder: 2,
    summaryAr:
      "تغطي ساعة راحة فنادق المدينة المشاركة حول المسجد النبوي وفي الأحياء السكنية. تظهر الإقامة القصيرة والليلة الكاملة فقط إذا أتاحها الفندق.",
    summaryEn:
      "Saa3a Raha covers participating hotels in Madinah, around the Prophet's Mosque and in residential districts. Short stays and full nights appear only when a hotel offers them.",
  },
  {
    slug: "jeddah",
    nameAr: "جدة",
    nameEn: "Jeddah",
    active: false,
    lat: 21.543333,
    lng: 39.172778,
    sortOrder: 3,
    summaryAr: "يمكن تفعيل جدة لاحقًا دون إعادة بناء المنصة.",
    summaryEn: "Jeddah can be activated later without rebuilding the platform.",
  },
  {
    slug: "taif",
    nameAr: "الطائف",
    nameEn: "Taif",
    active: false,
    lat: 21.270278,
    lng: 40.415833,
    sortOrder: 4,
    summaryAr: "يمكن تفعيل الطائف لاحقًا دون إعادة بناء المنصة.",
    summaryEn: "Taif can be activated later without rebuilding the platform.",
  },
  {
    slug: "riyadh",
    nameAr: "الرياض",
    nameEn: "Riyadh",
    active: false,
    lat: 24.713552,
    lng: 46.675296,
    sortOrder: 5,
    summaryAr: "يمكن تفعيل الرياض لاحقًا دون إعادة بناء المنصة.",
    summaryEn: "Riyadh can be activated later without rebuilding the platform.",
  },
] as const;

export const districtSeeds: Record<string, DistrictSeed[]> = {
  makkah: [
    { slug: "al-haram", nameAr: "الحرم / وسط مكة", nameEn: "Al Haram / Central Makkah" },
    { slug: "ajyad", nameAr: "أجياد", nameEn: "Ajyad" },
    { slug: "jabal-omar", nameAr: "جبل عمر", nameEn: "Jabal Omar" },
    { slug: "ibrahim-al-khalil", nameAr: "إبراهيم الخليل", nameEn: "Ibrahim Al Khalil" },
    { slug: "al-shubaikah", nameAr: "الشبيكة", nameEn: "Al Shubaikah" },
    { slug: "al-misfalah", nameAr: "المسفلة", nameEn: "Al Misfalah" },
    { slug: "jarwal", nameAr: "جرول", nameEn: "Jarwal" },
    { slug: "al-taysir", nameAr: "التيسير", nameEn: "Al Taysir" },
    { slug: "al-mansour", nameAr: "المنصور", nameEn: "Al Mansour" },
    { slug: "aziziyah", nameAr: "العزيزية", nameEn: "Al Aziziyah" },
    { slug: "mahbas-al-jin", nameAr: "محبس الجن", nameEn: "Mahbas Al Jin" },
    { slug: "al-maabdah", nameAr: "المعابدة", nameEn: "Al Maabdah" },
    { slug: "al-rawdah", nameAr: "الروضة", nameEn: "Al Rawdah" },
    { slug: "al-naseem", nameAr: "النسيم", nameEn: "Al Naseem" },
    { slug: "al-awali", nameAr: "العوالي", nameEn: "Al Awali" },
    { slug: "al-jamiah", nameAr: "الجامعة", nameEn: "Al Jamiah" },
    { slug: "al-rusayfah", nameAr: "الرصيفة", nameEn: "Al Rusayfah" },
    { slug: "al-kakiyyah", nameAr: "الكعكية", nameEn: "Al Kakiyyah" },
    { slug: "al-shoqiyah", nameAr: "الشوقية", nameEn: "Al Shoqiyah" },
    { slug: "bathaa-quraysh", nameAr: "بطحاء قريش", nameEn: "Bathaa Quraysh" },
    { slug: "al-hamra", nameAr: "الحمراء", nameEn: "Al Hamra" },
    { slug: "al-zaher", nameAr: "الزاهر", nameEn: "Al Zaher" },
    { slug: "al-nuzhah", nameAr: "النزهة", nameEn: "Al Nuzhah" },
    { slug: "al-khalidiyah", nameAr: "الخالدية", nameEn: "Al Khalidiyah" },
    { slug: "al-hijrah", nameAr: "الهجرة", nameEn: "Al Hijrah" },
    { slug: "al-taneem", nameAr: "التنعيم", nameEn: "Al Taneem" },
    { slug: "wali-al-ahd", nameAr: "ولي العهد", nameEn: "Wali Al Ahd" },
  ],
  madinah: [
    { slug: "central-madinah", nameAr: "وسط المدينة / الحرم", nameEn: "Central Madinah / Al Haram" },
    { slug: "quba", nameAr: "قباء", nameEn: "Quba" },
    { slug: "qurban", nameAr: "قربان", nameEn: "Qurban" },
    { slug: "al-awali", nameAr: "العوالي", nameEn: "Al Awali" },
    { slug: "al-anbariyah", nameAr: "العنبرية", nameEn: "Al Anbariyah" },
    { slug: "al-manakhah", nameAr: "المناخة", nameEn: "Al Manakhah" },
    { slug: "al-iskan", nameAr: "الإسكان", nameEn: "Al Iskan" },
    { slug: "al-aridh", nameAr: "العريض", nameEn: "Al Aridh" },
    { slug: "aziziyah", nameAr: "العزيزية", nameEn: "Al Aziziyah" },
    { slug: "al-khalidiyah", nameAr: "الخالدية", nameEn: "Al Khalidiyah" },
    { slug: "al-uyun", nameAr: "العيون", nameEn: "Al Uyun" },
    { slug: "al-qiblatayn", nameAr: "القبلتين", nameEn: "Al Qiblatayn" },
    { slug: "sayyid-al-shuhada", nameAr: "سيد الشهداء", nameEn: "Sayyid Al Shuhada" },
    { slug: "al-jumuah", nameAr: "الجمعة", nameEn: "Al Jumuah" },
    { slug: "king-fahd", nameAr: "الملك فهد", nameEn: "King Fahd" },
    { slug: "shuran", nameAr: "شوران", nameEn: "Shuran" },
    { slug: "al-ranuna", nameAr: "الرانوناء", nameEn: "Al Ranuna" },
    { slug: "al-aqoul", nameAr: "العقول", nameEn: "Al Aqoul" },
  ],
};

export const landmarkSeeds = [
  {
    slug: "al-masjid-al-haram",
    citySlug: "makkah",
    nameAr: "المسجد الحرام",
    nameEn: "Al Masjid Al Haram",
    lat: 21.422487,
    lng: 39.826206,
  },
  {
    slug: "al-masjid-an-nabawi",
    citySlug: "madinah",
    nameAr: "المسجد النبوي",
    nameEn: "Al Masjid an Nabawi",
    lat: 24.467213,
    lng: 39.611065,
  },
] as const;

export const commercialSeeds = [
  {
    code: "commission_per_booking",
    nameAr: "عمولة للحجز المؤكد",
    nameEn: "Commission per confirmed booking",
    descriptionAr: "تُحسب عند تأكيد الفندق للحجز، وتظهر للعميل فقط إذا تم ضبط الإفصاح عنها.",
    descriptionEn: "Calculated when a hotel confirms a booking. Shown to guests only if disclosure is turned on.",
  },
  {
    code: "monthly_subscription",
    nameAr: "اشتراك شهري للفندق",
    nameEn: "Monthly hotel subscription",
    descriptionAr: "مقابل شهري لحضور الفندق على المنصة، دون عرض نسبة داخلية.",
    descriptionEn: "A monthly fee for a hotel's presence on the platform, without publishing an internal rate.",
  },
  {
    code: "featured_advertising",
    nameAr: "إعلان فندق مميز",
    nameEn: "Featured hotel advertising",
    descriptionAr: "موضع مميز واضح، ولا يختلط بترتيب النتائج العضوي.",
    descriptionEn: "A clearly labeled featured placement that does not silently change organic ranking.",
  },
  {
    code: "sponsored_listing",
    nameAr: "إدراج ممول",
    nameEn: "Sponsored listing",
    descriptionAr: "يظهر في قسم مستقل وعليه وسم إعلان ممول.",
    descriptionEn: "Shown in a separate block and labeled as sponsored.",
  },
  {
    code: "marketing_package",
    nameAr: "باقة تسويق",
    nameEn: "Marketing package",
    descriptionAr: "حزمة تسويق متفق عليها مع الفندق المشارك.",
    descriptionEn: "A marketing package agreed with the participating hotel.",
  },
  {
    code: "booking_service_fee",
    nameAr: "رسوم حجز أو خدمة",
    nameEn: "Booking or service fee",
    descriptionAr: "تُعرض على الضيف قبل إرسال الطلب عندما تكون مفعلة ومُفصحًا عنها.",
    descriptionEn: "Shown to the guest before a request is sent, once it is enabled and disclosed.",
  },
] as const;

export function districtSummary(city: { nameAr: string; nameEn: string }, district: DistrictSeed, landmark: { nameAr: string; nameEn: string }) {
  return {
    summaryAr: `خيارات الإقامة في ${district.nameAr} ب${city.nameAr} تظهر هنا عندما تنشر الفنادق المشاركة غرفها ومددها وأسعارها. المسافة إلى ${landmark.nameAr} تُعرض فقط إذا وثّقها الفندق.`,
    summaryEn: `Stay options in ${district.nameEn}, ${city.nameEn}, appear here when participating hotels publish their rooms, durations and prices. Distance to ${landmark.nameEn} is shown only when the hotel has verified it.`,
  };
}
