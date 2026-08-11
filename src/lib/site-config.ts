import fs from "node:fs";
import path from "node:path";
import type { SiteConfigData, SiteContent, TldConfig } from "@/lib/site-types";
import { defaultContent } from "@/config/site-content";
import { defaultPlans, defaultTlds } from "@/config/product-catalog";

export const CONTENT_DIR = path.join(process.cwd(), "content");
const OVERRIDES_FILE = path.join(CONTENT_DIR, "overrides.json");
const PLANS_FILE = path.join(CONTENT_DIR, "plans.json");
const TLDS_FILE = path.join(CONTENT_DIR, "tlds.json");

function readJson<T>(file: string, fallback: T): T {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function deepMerge<T>(base: T, overrides: unknown): T {
  if (!isRecord(overrides)) return base;
  const baseRecord = base as unknown as Record<string, unknown>;
  const out: Record<string, unknown> = { ...baseRecord };
  for (const [key, value] of Object.entries(overrides)) {
    const baseValue = baseRecord[key];
    if (isRecord(value) && isRecord(baseValue)) {
      out[key] = deepMerge(baseValue, value);
    } else {
      out[key] = value;
    }
  }
  return out as T;
}

/**
 * Merges default content with runtime overrides written by the /admin
 * editor. Content overrides live in ./content/ (gitignored).
 */
export function loadSiteContent(): SiteContent {
  const overrides = readJson<unknown>(OVERRIDES_FILE, null);
  return deepMerge(defaultContent, overrides);
}

/** Plans = defaults overridden by admin-edited plans.json (or future WHMCS mirror). */
export function loadPlans() {
  const overrides = readJson<{ plans?: import("@/lib/site-types").HostingPlan[] }>(PLANS_FILE, {});
  if (Array.isArray(overrides.plans) && overrides.plans.length > 0) return overrides.plans;
  return defaultPlans;
}

export function loadTlds(): TldConfig[] {
  const overrides = readJson<{ tlds?: TldConfig[] }>(TLDS_FILE, {});
  if (Array.isArray(overrides.tlds) && overrides.tlds.length > 0) return overrides.tlds;
  return defaultTlds;
}

export function loadSiteConfig(): SiteConfigData {
  return { content: loadSiteContent(), tlds: loadTlds() };
}

/* ------------------------------ Admin writes ------------------------------ */

export function saveContentOverrides(content: unknown): void {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
  fs.writeFileSync(OVERRIDES_FILE, JSON.stringify(content, null, 2), "utf-8");
}

export function savePlans(plans: unknown): void {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
  fs.writeFileSync(PLANS_FILE, JSON.stringify({ plans }, null, 2), "utf-8");
}

export function saveTlds(tlds: unknown): void {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
  fs.writeFileSync(TLDS_FILE, JSON.stringify({ tlds }, null, 2), "utf-8");
}
