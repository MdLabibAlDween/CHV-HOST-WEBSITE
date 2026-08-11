import type { HostingPlan, BillingCycle } from "@/lib/site-types";
import { getEnv } from "@/lib/env";
import { whmcsCartUrl } from "@/lib/whmcs";

/**
 * Builds the order destination for a plan:
 *  - WHMCS configured  -> WHMCS cart URL with pid + billing cycle
 *  - WHMCS unconfigured -> local checkout page (graceful message)
 */
export function orderHref(plan: HostingPlan, cycle: BillingCycle, domain?: string): string {
  const env = getEnv();

  if (plan.customOrderUrl) {
    const url = new URL(plan.customOrderUrl, env.siteDomain);
    url.searchParams.set("billingcycle", cycle);
    if (domain) url.searchParams.set("domain", domain);
    return url.toString();
  }

  if (env.whmcsUrl && plan.whmcsPid) {
    return whmcsCartUrl(plan.whmcsPid, cycle, domain ? { domain } : undefined);
  }

  const params = new URLSearchParams({ plan: plan.id, cycle });
  if (domain) params.set("domain", domain);
  return `/checkout?${params.toString()}`;
}
