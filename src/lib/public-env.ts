"use client";

/**
 * Client-safe access to public site configuration.
 * The root layout embeds the public env (no secrets) as
 * window.__CHV_ENV__; this hook reads it with a static fallback so
 * client components never import server-only env.
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

declare global {
  interface Window {
    __CHV_ENV__?: PublicEnv;
  }
}

const FALLBACK: PublicEnv = {
  siteName: "CHV HOST",
  siteTagline: "Cheap Hosting And VPS",
  siteDomain: "https://yourdomain.com",
  supportEmail: "support@yourdomain.com",
  salesEmail: "sales@yourdomain.com",
  supportPhone: "+880XXXXXXXXXX",
  companyAddress: "Your Address, Bangladesh",
  logoPath: "/logo.png",
  faviconPath: "/favicon.ico",
  primaryColor: "#4f46e5",
  secondaryColor: "#06b6d4",
  gaId: "",
  gtmId: "",
  metaPixelId: "",
  liveChatProviderUrl: "",
  whmcsUrl: "",
};

export function useEnv(): PublicEnv {
  if (typeof window !== "undefined" && window.__CHV_ENV__) {
    return window.__CHV_ENV__;
  }
  return FALLBACK;
}
