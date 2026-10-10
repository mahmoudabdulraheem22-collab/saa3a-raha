export type LegalSection = { heading: string; paragraphs: string[] };

export type LegalDocument = {
  title: string;
  sections: LegalSection[];
};

const updated = "10 October 2026";

export const legalUpdated = { ar: "10 أكتوبر 2026", en: updated };

export const legalDocuments: Record<string, { ar: LegalDocument; en: LegalDocument }> = {
  terms: {
    ar: {
      title: "الشروط والأحكام",
      sections: [
        {
          heading: "من نحن",
          paragraphs: [
            "ساعة راحة منصة رقمية للتسويق والوساطة والحجز بين الضيوف والفنادق المشاركة في مكة المكرمة والمدينة المنورة.",
            "ساعة راحة لا تملك الفنادق ولا تقدّم خدمة الإقامة. مقدم الإقامة هو الفندق المشارك.",
          ],
        },
        {
          heading: "ما يظهر على المنصة",
          paragraphs: [
            "الغرف والأسعار والمدد والصور والسياسات تُنشر من واقع ما يدخله الفندق أو ما يعتمده مشغّل المنصة بناءً على بيانات الفندق.",
            "لا تُعرض تقييمات أو حجوزات أو تراخيص أو مسافات أو توافر لحظي ما لم تكن صادرة عن مصدرها ومسجلة في النظام.",
          ],
        },
        {
          heading: "النطاق",
          paragraphs: [
            "الإطلاق يقتصر على مكة والمدينة. يمكن تفعيل مدن سعودية أخرى لاحقًا من دون تغيير طبيعة الوساطة.",
            "هذه الشروط لا تتضمّن ادعاءً بترخيص أو اعتماد حكومي.",
          ],
        },
      ],
    },
    en: {
      title: "Terms & Conditions",
      sections: [
        {
          heading: "Who we are",
          paragraphs: [
            "Saa3a Raha is a digital marketing and booking intermediary between guests and participating hotels in Makkah and Madinah.",
            "Saa3a Raha does not own the hotels and does not provide the accommodation. The participating hotel is the accommodation provider.",
          ],
        },
        {
          heading: "What the platform shows",
          paragraphs: [
            "Rooms, prices, durations, photos and policies are published from what the hotel submits, or from what the operator records on the hotel's information.",
            "Reviews, bookings, licenses, distances and live availability are not displayed unless they come from their source and are stored in the system.",
          ],
        },
        {
          heading: "Scope",
          paragraphs: [
            "Launch coverage is Makkah and Madinah. Other Saudi cities can be activated later without changing the intermediary role.",
            "These terms do not claim a government license or approval.",
          ],
        },
      ],
    },
  },
  privacy: {
    ar: {
      title: "سياسة الخصوصية",
      sections: [
        {
          heading: "ما نجمعه",
          paragraphs: [
            "نجمع البيانات التي ترسلها في طلب الحجز أو طلب انضمام الفندق: الاسم، والجوال، والبريد، وتفاصيل الإقامة أو المنشأة، والملاحظة التي تكتبها.",
            "لا نشتري قوائم ضيوف ولا ننشئ ملفات شخصية وهمية.",
          ],
        },
        {
          heading: "لماذا نستخدمها",
          paragraphs: [
            "تُستخدم البيانات لإيصال الطلب إلى الفندق المشارك، ومتابعة حالته، والتواصل بخصوص الحجز أو طلب الانضمام.",
            "لا تُباع بيانات الضيوف كقائمة تسويق مستقلة.",
          ],
        },
        {
          heading: "المشاركة والاحتفاظ",
          paragraphs: [
            "تُشارك بيانات طلب الحجز مع الفندق المعني حتى يستطيع قبول الطلب أو رفضه.",
            "تُحفظ السجلات للتشغيل والمراجعة. يمكنك طلب تصحيح بيانات التواصل عندما تُنشر قناة التواصل الرسمية للمنصة.",
          ],
        },
      ],
    },
    en: {
      title: "Privacy Policy",
      sections: [
        {
          heading: "What we collect",
          paragraphs: [
            "We collect what you submit in a booking request or a hotel application: name, mobile, email, stay or property details, and the note you write.",
            "We do not buy guest lists or create fictional profiles.",
          ],
        },
        {
          heading: "Why we use it",
          paragraphs: [
            "The details are used to pass a request to the participating hotel, track its status, and communicate about the booking or the application.",
            "Guest data is not sold as a standalone marketing list.",
          ],
        },
        {
          heading: "Sharing and retention",
          paragraphs: [
            "Booking-request details are shared with the hotel concerned so it can accept or decline.",
            "Records are kept for operations and review. You can ask to correct contact details once the platform's official contact channel is published.",
          ],
        },
      ],
    },
  },
  cancellation: {
    ar: {
      title: "سياسة الإلغاء",
      sections: [
        {
          heading: "سياسة الفندق هي الأصل",
          paragraphs: [
            "يلغي الضيف وفق سياسة الإلغاء التي نشرها الفندق المشارك على صفحته. ساعة راحة لا تستبدل سياسة الفندق بسياسة موحدة.",
            "إذا لم ينشر الفندق سياسة إلغاء، يُذكر ذلك في صفحة الفندق ولا تُخترع مهلة إلغاء.",
          ],
        },
        {
          heading: "قبل تأكيد الفندق",
          paragraphs: [
            "طلب الحجز غير المؤكد ليس إقامة محجوزة. يمكن إيقاف متابعته قبل تأكيد الفندق من خلال مرجع الطلب عندما تتوفر قناة التشغيل.",
          ],
        },
      ],
    },
    en: {
      title: "Cancellation Policy",
      sections: [
        {
          heading: "The hotel's policy governs",
          paragraphs: [
            "A guest cancels under the cancellation policy the participating hotel published on its page. Saa3a Raha does not replace that policy with one platform-wide rule.",
            "If a hotel has not published a cancellation policy, the hotel page says so. No cancellation window is invented.",
          ],
        },
        {
          heading: "Before the hotel confirms",
          paragraphs: [
            "An unconfirmed request is not a reserved stay. It can be withdrawn before hotel confirmation through the request reference once an operations channel is available.",
          ],
        },
      ],
    },
  },
  "partner-terms": {
    ar: {
      title: "شروط الفنادق الشريكة",
      sections: [
        {
          heading: "دور الفندق",
          paragraphs: [
            "الفندق هو مقدم الإقامة ومسؤول عن حالة الغرفة والتوفر والأسعار وسياسات الدخول والإلغاء وأي تصريح يلزم لتشغيله.",
            "تسجيل الفندق طلب انضمام. لا ينشأ عنه شراكة إلا بعد مراجعة واعتماد صريحين.",
          ],
        },
        {
          heading: "ما يتحكم به الفندق",
          paragraphs: [
            "يختار الفندق الغرف والأسعار والتواريخ والساعات المتاحة ومدد الإقامة القصيرة وخيار الليلة الكاملة والعروض وسياسة الإلغاء.",
            "الإعلان الممول يُوسم للضيف ولا يُستخدم لتغيير الترتيب العضوي سرًا.",
          ],
        },
        {
          heading: "المقابل التجاري",
          paragraphs: [
            "قد تتفق المنصة والفندق على عمولة للحجز المؤكد، أو اشتراك شهري، أو إعلان، أو إدراج ممول، أو باقة تسويق، أو رسوم خدمة.",
            "لا تُنشر نسبة داخلية للعموم ما لم يُضبط الإفصاح عنها صراحة.",
          ],
        },
      ],
    },
    en: {
      title: "Hotel Partner Terms",
      sections: [
        {
          heading: "The hotel's role",
          paragraphs: [
            "The hotel is the accommodation provider and is responsible for the room, availability, prices, check-in and cancellation policies, and any permit its operation requires.",
            "Listing the hotel is an application. It becomes a partnership only after an explicit review and approval.",
          ],
        },
        {
          heading: "What the hotel controls",
          paragraphs: [
            "The hotel chooses rooms, prices, dates, available hours, short-stay durations, full-night options, promotions and the cancellation policy.",
            "A sponsored placement is labeled for the guest and is not used to change organic ranking in secret.",
          ],
        },
        {
          heading: "Commercial terms",
          paragraphs: [
            "The platform and the hotel may later agree a commission on confirmed bookings, a monthly subscription, advertising, a sponsored listing, a marketing package, or a service fee.",
            "An internal commission rate is not published unless disclosure is explicitly configured.",
          ],
        },
      ],
    },
  },
  "booking-terms": {
    ar: {
      title: "شروط الحجز",
      sections: [
        {
          heading: "نوعان من المسار",
          paragraphs: [
            "طلب الحجز: يرسل الضيف طلبًا، ولا تُعد الإقامة مؤكدة حتى يؤكدها الفندق.",
            "الحجز الفوري: لا يكتمل إلا إذا كان للفندق مخزون مباشر منشور يطابق الغرفة والمدة والتاريخ ووقت الوصول، مع وحدات متبقية.",
          ],
        },
        {
          heading: "السعر والرسوم",
          paragraphs: [
            "السعر المعروض هو سعر الفندق المنشور. إذا لم ينشر الفندق سعرًا تُذكر عبارة أن السعر عند الطلب.",
            "أي رسوم خدمة للمنصة لا تُضاف بصمت. تظهر قبل الإرسال فقط عندما تكون مفعلة ومُفصحًا عنها.",
          ],
        },
        {
          heading: "مسؤولية الإقامة",
          paragraphs: [
            "تنفيذ الإقامة وحالة الغرفة واستقبال الضيف التزام على الفندق المشارك.",
            "ساعة راحة تنقل الطلب أو التأكيد المسجل ولا تصبح بذلك مشغّل الفندق.",
          ],
        },
      ],
    },
    en: {
      title: "Booking Terms",
      sections: [
        {
          heading: "Two paths",
          paragraphs: [
            "Request to book: the guest sends a request. The stay is not confirmed until the hotel confirms it.",
            "Instant booking: it completes only when the hotel has published live inventory matching the room, duration, date and arrival time, with units remaining.",
          ],
        },
        {
          heading: "Price and fees",
          paragraphs: [
            "A displayed price is the hotel's published price. If the hotel has not published a price, the page says the price is on request.",
            "A platform service fee is never added silently. It appears before submission only when it is enabled and disclosed.",
          ],
        },
        {
          heading: "Who provides the stay",
          paragraphs: [
            "Providing the stay, the condition of the room and receiving the guest are the participating hotel's obligations.",
            "Saa3a Raha passes the request or the recorded confirmation and does not become the hotel operator by doing so.",
          ],
        },
      ],
    },
  },
};

export const legalSlugs = Object.keys(legalDocuments);
