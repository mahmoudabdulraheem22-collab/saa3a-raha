import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-3xl font-semibold">الصفحة غير موجودة · Page not found</h1>
      <p className="mt-4 leading-8 text-[#6e675d]">الرابط لا يطابق صفحة منشورة. This link does not match a published page.</p>
      <Link href="/" className="mt-6 inline-flex h-12 items-center rounded-2xl bg-[#d4af37] px-5 text-sm font-semibold text-[#171512]">
        ساعة راحة
      </Link>
    </div>
  );
}
