import { PrismaClient } from "@prisma/client";
import { citySeeds, commercialSeeds, districtSeeds, districtSummary, durationSeeds, landmarkSeeds } from "../src/data/geography";

const prisma = new PrismaClient();

async function main() {
  for (const duration of durationSeeds) {
    await prisma.stayDuration.upsert({
      where: { id: duration.id },
      update: {
        hours: duration.hours,
        nameAr: duration.nameAr,
        nameEn: duration.nameEn,
        sortOrder: duration.sortOrder,
      },
      create: {
        id: duration.id,
        hours: duration.hours,
        nameAr: duration.nameAr,
        nameEn: duration.nameEn,
        sortOrder: duration.sortOrder,
      },
    });
  }

  for (const city of citySeeds) {
    await prisma.city.upsert({
      where: { slug: city.slug },
      update: {
        nameAr: city.nameAr,
        nameEn: city.nameEn,
        summaryAr: city.summaryAr,
        summaryEn: city.summaryEn,
        active: city.active,
        lat: city.lat,
        lng: city.lng,
        sortOrder: city.sortOrder,
      },
      create: {
        slug: city.slug,
        nameAr: city.nameAr,
        nameEn: city.nameEn,
        summaryAr: city.summaryAr,
        summaryEn: city.summaryEn,
        active: city.active,
        lat: city.lat,
        lng: city.lng,
        sortOrder: city.sortOrder,
      },
    });
  }

  for (const landmark of landmarkSeeds) {
    const city = await prisma.city.findUniqueOrThrow({ where: { slug: landmark.citySlug } });
    await prisma.landmark.upsert({
      where: { slug: landmark.slug },
      update: {
        nameAr: landmark.nameAr,
        nameEn: landmark.nameEn,
        lat: landmark.lat,
        lng: landmark.lng,
        cityId: city.id,
      },
      create: {
        slug: landmark.slug,
        nameAr: landmark.nameAr,
        nameEn: landmark.nameEn,
        lat: landmark.lat,
        lng: landmark.lng,
        cityId: city.id,
      },
    });
  }

  for (const [citySlug, districts] of Object.entries(districtSeeds)) {
    const city = await prisma.city.findUniqueOrThrow({ where: { slug: citySlug } });
    const landmark = landmarkSeeds.find((item) => item.citySlug === citySlug);
    for (const [index, district] of districts.entries()) {
      const summary = districtSummary(
        city,
        district,
        landmark ?? { nameAr: city.nameAr, nameEn: city.nameEn },
      );
      await prisma.district.upsert({
        where: { cityId_slug: { cityId: city.id, slug: district.slug } },
        update: {
          nameAr: district.nameAr,
          nameEn: district.nameEn,
          summaryAr: summary.summaryAr,
          summaryEn: summary.summaryEn,
          sortOrder: index + 1,
        },
        create: {
          cityId: city.id,
          slug: district.slug,
          nameAr: district.nameAr,
          nameEn: district.nameEn,
          summaryAr: summary.summaryAr,
          summaryEn: summary.summaryEn,
          sortOrder: index + 1,
        },
      });
    }
  }

  for (const model of commercialSeeds) {
    await prisma.commercialModel.upsert({
      where: { code: model.code },
      update: {
        nameAr: model.nameAr,
        nameEn: model.nameEn,
        descriptionAr: model.descriptionAr,
        descriptionEn: model.descriptionEn,
      },
      create: {
        code: model.code,
        nameAr: model.nameAr,
        nameEn: model.nameEn,
        descriptionAr: model.descriptionAr,
        descriptionEn: model.descriptionEn,
        publicDisclosure: false,
        active: true,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
