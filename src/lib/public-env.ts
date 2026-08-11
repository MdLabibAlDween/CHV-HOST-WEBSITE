"use client";

/**
 * Client-safe access to public site configuration.
 * Values come from NEXT_PUBLIC_* env vars, which Next.js inlines into
 * the client bundle at build time. No runtime script injection needed.
 */

export interface PublicEnv {
  siteName: string;
  siteTagline: string;
  siteDomain: string;
  supportEmail: string;
  salesEmail: string;
  supportPhone: string;
  companyAddress: string;
  logoPath: string;
  faviconPath: string;
  primaryColor: string;
  secondaryColor: string;
  gaId: string;
  gtmId: string;
  metaPixelId: string;
  liveChatProviderUrl: string;
  whmcsUrl: string;
}

const PUBLIC_ENV: PublicEnv = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || "CHV HOST",
  siteTagline: process.env.NEXT_PUBLIC_SITE_TAGLINE || "Cheap Hosting And VPS",
  siteDomain: process.env.NEXT_PUBLIC_SITE_DOMAIN || "https://yourdomain.com",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@yourdomain.com",
  salesEmail: process.env.NEXT_PUBLIC_SALES_EMAIL || "sales@yourdomain.com",
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+880XXXXXXXXXX",
  companyAddress: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || "Your Address, Bangladesh",
  logoPath: process.env.NEXT_PUBLIC_LOGO_PATH || "/logo.png",
  faviconPath: process.env.NEXT_PUBLIC_FAVICON_PATH || "/favicon.ico",
  primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || "#4f46e5",
  secondaryColor: process.env.NEXT_PUBLIC_SECONDARY_COLOR || "#06b6d4",
  gaId: process.env.NEXT_PUBLIC_GA_ID || "",
  gtmId: process.env.NEXT_PUBLIC_GTM_ID || "",
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || "",
  liveChatProviderUrl: process.env.NEXT_PUBLIC_LIVE_CHAT_PROVIDER_URL || "",
  whmcsUrl: "",
};

const whmcsUrl = (process.env.NEXT_PUBLIC_WHMCS_URL || "").toLowerCase();
if (process.env.NEXT_PUBLIC_WHMCS_URL && !whmcsUrl.includes("yourdomain.com") && !whmcsUrl.includes("localhost")) {
  PUBLIC_ENV.whmcsUrl = process.env.NEXT_PUBLIC_WHMCS_URL;
}

export function useEnv(): PublicEnv {
  return PUBLIC_ENV;
}
