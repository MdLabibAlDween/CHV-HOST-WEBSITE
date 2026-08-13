import type { MetadataRoute } from "next";
import { getPublicEnv } from "@/lib/env";

const STATIC_ROUTES = [
  "",
  "/bdix-hosting",
  "/wordpress-hosting",
  "/reseller-hosting",
  "/bdix-vps",
  "/windows-rdp",
  "/managed-vps",
  "/ivac",
  "/dedicated-server",
  "/license",
  "/domains",
  "/pricing",
  "/about",
  "/contact",
  "/faq",
  "/support",
  "/status",
  "/terms",
  "/privacy",
  "/refund-policy",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const env = getPublicEnv();
  const base = env.siteDomain.replace(/\/$/, "");
  const now = new Date();

  return STATIC_ROUTES.map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
