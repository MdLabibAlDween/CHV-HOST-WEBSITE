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
};

/** Category used when a WHMCS group name/gid is not in the maps above. */
export const FALLBACK_CATEGORY: PlanCategory = "bdix";