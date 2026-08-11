import type { MetadataRoute } from "next";
import { getPublicEnv } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const env = getPublicEnv();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/checkout", "/payment/"],
    },
    sitemap: `${env.siteDomain.replace(/\/$/, "")}/sitemap.xml`,
  };
}
