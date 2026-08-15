import type { HostingPlan, BillingCycle } from "@/lib/site-types";
import { getPublicEnv } from "@/lib/env";
import { whmcsCartUrl } from "@/lib/whmcs";

/**
 * Pure order-destination builder. Takes the WHMCS base URL as an
 * explicit argument so the result is identical on the server and on
 * the client during hydration — client components receive `whmcsUrl`
 * as a prop from their server parent instead of reading env.
 */
export function buildOrderHref(
  plan: HostingPlan,
  cycle: BillingCycle,
  whmcsUrl: string,
  domain?: string,
): string {
  if (plan.customOrderUrl) {
    const url = new URL(plan.customOrderUrl, whmcsUrl || "https://chvhost.com");
    url.searchParams.set("billingcycle", cycle);
    if (domain) url.searchParams.set("domain", domain);
    return url.toString();
  }

  if (whmcsUrl && plan.whmcsPid) {
    return whmcsCartUrl(plan.whmcsPid, cycle, domain ? { domain } : undefined, whmcsUrl);
  }

  const params = new URLSearchParams({ plan: plan.id, cycle });
  if (domain) params.set("domain", domain);
  return `/checkout?${params.toString()}`;
}

/**
 * Server-side wrapper of {@link buildOrderHref} using the env value.
 * Client components should receive `whmcsUrl` as a prop instead.
 */
export function orderHref(plan: HostingPlan, cycle: BillingCycle, domain?: string): string {
  return buildOrderHref(plan, cycle, getPublicEnv().whmcsUrl, domain);
}