import "server-only";
import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export async function isAdmin() {
  const key = process.env.ADMIN_ACCESS_KEY;
  if (!key) return process.env.NODE_ENV !== "production";
  const given = (await cookies()).get("sr_admin")?.value ?? "";
  const left = Buffer.from(given);
  const right = Buffer.from(key);
  if (left.length !== right.length || left.length === 0) return false;
  return timingSafeEqual(left, right);
}
