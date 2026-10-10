# Saa3a Raha | ساعة راحة

Saa3a Raha is a hotel marketing and booking intermediary for Makkah and Madinah. Participating hotels provide the rooms, prices, stay durations and policies. The platform does not operate hotels and does not publish invented listings, reviews, prices, distances or availability.

## Stack

Next.js, TypeScript, Tailwind CSS, Prisma and SQLite for local data. The schema is ready to move to Postgres by changing the datasource.

## Setup

```bash
npm install
npx prisma generate
npm run db:setup
npm run dev
```

Copy `.env.example` to `.env` if needed. `DATABASE_URL` points at the local SQLite file. Set `ADMIN_ACCESS_KEY` before any production deploy. In local development, an empty key leaves the operations desk open at `/admin`.

Arabic is the default and is served without a locale prefix (`/makkah`). English is under `/en`.

## What is stored

Cities, districts, landmarks, stay durations and commercial models are seeded. Jeddah, Taif and Riyadh exist as inactive cities so they can be switched on later. No sample hotels are seeded.

Hotel applications, rooms, verified photos, verified distances, availability slots and booking requests are created only from forms.
