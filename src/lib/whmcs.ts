import { getEnv } from "@/lib/env";
import { log } from "@/lib/logger";

/**
 * Server-side WHMCS API client.
 *
 * Credentials are read from the environment on the server only and are
 * never exposed to the browser. All WHMCS communication happens here.
 */

export interface WhmcsError {
  ok: false;
  error: string;
  message?: string;
  httpCode?: number;
}

export interface WhmcsResult {
  ok: true;
  data: Record<string, unknown>;
}

export type WhmcsResponse = WhmcsResult | WhmcsError;

function isConfigured(): boolean {
  const env = getEnv();
  return Boolean(env.whmcsApiUrl && env.whmcsIdentifier && env.whmcsSecret);
}

/** True when the WHMCS base URL is a real value, not a placeholder. */
function hasRealUrl(url: string): boolean {
  const u = url.toLowerCase();
  return Boolean(url && !u.includes("yourdomain.com") && !u.includes("localhost"));
}

export async function whmcsRequest(
  action: string,
  params: Record<string, string | number | boolean> = {},
  opts: { timeoutMs?: number } = {},
): Promise<WhmcsResponse> {
  const env = getEnv();
  if (!isConfigured()) {
    return { ok: false, error: "WHMCS_NOT_CONFIGURED", message: "Billing system is not configured yet." };
  }

  const body = new URLSearchParams({
    identifier: env.whmcsIdentifier,
    secret: env.whmcsSecret,
    action,
    responsetype: "json",
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), opts.timeoutMs ?? env.whmcsTimeoutMs);
  const start = Date.now();

  log("WHMCS_REQUEST", { action });

  try {
    const res = await fetch(env.whmcsApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: controller.signal,
    });

    const text = await res.text();
    log("WHMCS_RESPONSE", { action, httpCode: res.status, elapsedMs: Date.now() - start });

    if (!res.ok) {
      return { ok: false, error: "WHMCS_HTTP_ERROR", httpCode: res.status, message: text.slice(0, 500) };
    }

    let json: Record<string, unknown>;
    try {
      json = JSON.parse(text);
    } catch {
      return { ok: false, error: "WHMCS_BAD_RESPONSE", message: "Billing system returned an invalid response." };
    }

    if (json.result === "error") {
      return { ok: false, error: "WHMCS_API_ERROR", message: String(json.message ?? json.error ?? "Unknown WHMCS error") };
    }

    return { ok: true, data: json };
  } catch (err) {
    log("WHMCS_ERROR", { action, message: err instanceof Error ? err.message : String(err) });
    return { ok: false, error: "WHMCS_UNREACHABLE", message: "We're temporarily unable to connect to the billing system. Please try again shortly." };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * WHMCS cart URL for a product + billing cycle. Uses the legacy cart
 * add-to-cart flow which preserves billing as the WHMCS source of truth.
 *
 * `baseUrl` is optional and meant for deterministic server-propagated
 * hrefs (client hydration must never re-read process.env here).
 */
export function whmcsCartUrl(
  pid: number | undefined,
  billingCycle: string,
  extras?: Record<string, string>,
  baseUrl?: string,
): string {
  const base = baseUrl ?? getEnv().whmcsUrl;
  if (!hasRealUrl(base)) return "";
  const params = new URLSearchParams();
  params.set("a", "add");
  if (pid) params.set("pid", String(pid));
  params.set("billingcycle", billingCycle);
  for (const [k, v] of Object.entries(extras ?? {})) params.set(k, v);
  return `${base.replace(/\/$/, "")}/cart.php?${params.toString()}`;
}

export function whmcsClientAreaUrl(path = ""): string {
  const env = getEnv();
  if (!hasRealUrl(env.whmcsUrl)) return "";
  return `${env.whmcsUrl.replace(/\/$/, "")}/${path}`;
}
