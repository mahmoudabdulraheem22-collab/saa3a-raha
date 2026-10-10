import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/locale";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/en/admin", "/partner", "/en/partner", "/booking", "/en/booking"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
