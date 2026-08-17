import type { PlanCategory } from "@/lib/site-types";

/**
 * WHMCS product-group sync map.
 *
 * This is the ONLY place you need to edit when you add, rename or
 * remove product groups in WHMCS (Setup → Products/Services →
 * Products → Groups).
 *
 * Rules:
 * - Write the group name exactly as it appears in WHMCS, one per line.
 * - Matching is case-insensitive and ignores spaces/symbols, so
 *   "bdx hosting", "Bdx-Hosting" and "BDX  HOSTING" all match
 *   "Bdx Hosting".
 * - Several names may map to the same category (see the two Bdx
 *   variants below).
 * - Products belonging to a group that is not listed here fall back
 *   to the default category (FALLBACK_CATEGORY).
 * - A group with no products shows "Plans coming soon" on the site.
 *
 * NOTE: some WHMCS versions do not return group names from the API,
 * only numeric group ids (gid). If your products are not landing in
 * the right category, put their gid in WHMCS_GID_MAP below instead —
 * you can see the gid in WHMCS when you open a product group
 * (the URL contains gid=N).
 */

export const WHMCS_GROUP_MAP: Record<string, PlanCategory> = {
  // ---- Hosting ----
  "Bdx Hosting": "bdix",
  "BDIX Hosting": "bdix",
  "Wordpress Hosting": "wordpress",
  "Reseller Hosting": "reseller",

  // ---- VPS / RDP ----
  "Bdix VPS/RDP": "bdix-vps",
  "Windows Server RDP": "windows-rdp",
  "Managed VPS": "managed-vps",

  // ---- Servers / services ----
  "IVAC Service": "ivac",
  "Dedicated Server": "dedicated",
  "License": "license",
};

/**
 * Numeric group id → category, used when the API returns only gids
 * (current WHMCS build does not expose group names). Check each
 * group's gid in WHMCS admin (Setup → Products/Services → Groups).
 */
export const WHMCS_GID_MAP: Record<string, PlanCategory> = {
  "1": "bdix",
  "2": "reseller",
  "4": "bdix-vps",
  "5": "wordpress",
  "6": "managed-vps",
  "7": "ivac",
  "8": "dedicated",
  "9": "windows-rdp",
  "10": "license",
};

/**
 * Store slug → category. WHMCS includes the group's store URL in every
 * product (product_url, e.g. .../store/bdix-hosting/cheap-bdix), so
 * products are routed to the right page automatically. Add a line here
 * if you create a brand-new group in WHMCS.
 */
export const STORE_SLUG_MAP: Record<string, PlanCategory> = {
  "bdix-hosting": "bdix",
  "wordpress-hosting": "wordpress",
  "reseller-hosting": "reseller",
  "bdix-vps-rdp": "bdix-vps",
  "windows-server-rdp": "windows-rdp",
  "managed-vps": "managed-vps",
  "ivac-service": "ivac",
  "dedicated-server": "dedicated",
  license: "license",
};

/**
 * WHMCS product group metadata (icons, headlines, taglines, store
 * URLs and payment gateway) mirrored from the WHMCS admin store pages.
 * Keyed by PlanCategory so any page can render the group as WHMCS
 * presents it.
 */
export const WHMCS_GROUP_META: Record<
  PlanCategory,
  { icon: string; headline: string; tagline: string; url: string; gateway: string }
> = {
  bdix: {
    icon: "fa-solid fa-house",
    headline: "BDIX Hosting Plans",
    tagline: "Fast, reliable BDIX hosting with free SSL.",
    url: "https://billing.chvhost.com/index.php?rp=/store/bdix-hosting",
    gateway: "ZiniPay",
  },
  reseller: {
    icon: "fa-solid fa-layer-group",
    headline: "Reseller Hosting Plans",
    tagline: "White-label hosting with WHM access.",
    url: "https://billing.chvhost.com/index.php?rp=/store/reseller-hosting",
    gateway: "ZiniPay",
  },
  "bdix-vps": {
    icon: "fa-solid fa-server",
    headline: "BDIX VPS & RDP",
    tagline: "Low latency VPS and RDP on BDIX network.",
    url: "https://billing.chvhost.com/index.php?rp=/store/bdix-vps-rdp",
    gateway: "ZiniPay",
  },
  wordpress: {
    icon: "",
    headline: "",
    tagline: "",
    url: "https://billing.chvhost.com/index.php?rp=/store/wordpress-hosting",
    gateway: "ZiniPay",
  },
  "managed-vps": {
    icon: "",
    headline: "",
    tagline: "",
    url: "https://billing.chvhost.com/index.php?rp=/store/managed-vps",
    gateway: "ZiniPay",
  },
  ivac: {
    icon: "",
    headline: "",
    tagline: "",
    url: "https://billing.chvhost.com/index.php?rp=/store/ivac-service",
    gateway: "ZiniPay",
  },
  dedicated: {
    icon: "",
    headline: "",
    tagline: "",
    url: "https://billing.chvhost.com/index.php?rp=/store/dedicated-server",
    gateway: "ZiniPay",
  },
  "windows-rdp": {
    icon: "",
    headline: "",
    tagline: "",
    url: "https://billing.chvhost.com/index.php?rp=/store/windows-server-rdp",
    gateway: "ZiniPay",
  },
  license: {
    icon: "",
    headline: "",
    tagline: "",
    url: "https://billing.chvhost.com/index.php?rp=/store/license",
    gateway: "ZiniPay",
  },
};

/** Category used when a WHMCS group name/gid is not in the maps above. */
export const FALLBACK_CATEGORY: PlanCategory = "bdix";
