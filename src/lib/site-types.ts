/**
 * Shared types for site content, products, pricing and integrations.
 */

export type CurrencyCode = "BDT" | "USD";

export type BillingCycle =
  | "monthly"
  | "quarterly"
  | "semiannually"
  | "annually"
  | "biennially"
  | "triennially";

export const BILLING_CYCLE_LABELS: Record<BillingCycle, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  semiannually: "Semi-Annually",
  annually: "Annually",
  biennially: "Biennially",
  triennially: "Triennially",
};

export type PlanCategory =
  | "web"
  | "bdix"
  | "turbo"
  | "reseller"
  | "vps"
  | "bdix-vps";

export const CATEGORY_META: Record<
  PlanCategory,
  { label: string; href: string; description: string }
> = {
  web: {
    label: "Web Hosting",
    href: "/hosting",
    description: "Reliable shared hosting with cPanel for every website.",
  },
  bdix: {
    label: "BDIX Hosting",
    href: "/bdix-hosting",
    description: "Bangladesh-optimized hosting over the BDIX network.",
  },
  turbo: {
    label: "Turbo Hosting",
    href: "/turbo-hosting",
    description: "Maximum performance with NVMe and LiteSpeed.",
  },
  reseller: {
    label: "Reseller Hosting",
    href: "/reseller-hosting",
    description: "White-label hosting with WHM and your own nameservers.",
  },
  vps: {
    label: "VPS",
    href: "/vps",
    description: "Root-access virtual servers with NVMe storage.",
  },
  "bdix-vps": {
    label: "BDIX VPS",
    href: "/bdix-vps",
    description: "Low-latency VPS on the local BDIX network.",
  },
};

export interface PriceEntry {
  bdt: Partial<Record<BillingCycle, number>>;
  usd: Partial<Record<BillingCycle, number>>;
}

export interface ResourceSpec {
  label: string;
  value: string;
}

export interface HostingPlan {
  id: string;
  category: PlanCategory;
  name: string;
  tagline: string;
  popular?: boolean;
  badge?: string;
  /** Billing cycles actually available for this product. */
  billingCycles: BillingCycle[];
  prices: PriceEntry;
  /** Short feature list shown on cards. */
  features: string[];
  /** Resource rows shown in comparison tables. */
  resourceSpecs: ResourceSpec[];
  /** WHMCS product id used for "Order Now" links. */
  whmcsPid?: number;
  /** Full WHMCS cart URL if you prefer a fixed link over pid mapping. */
  customOrderUrl?: string;
}

export interface StatusItem {
  name: string;
  status: "operational" | "degraded" | "down" | "maintenance";
  note: string;
}

export type StatusName =
  | "operational"
  | "degraded"
  | "down"
  | "maintenance";

/* ----------------------------- Site content ----------------------------- */

export interface SiteContent {
  company: {
    name: string;
    tagline: string;
    description: string;
    email: string;
    salesEmail: string;
    phone: string;
    address: string;
    founded: string;
  };
  hero: {
    headline: string;
    highlight: string;
    subheadline: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    points: string[];
  };
  stats: { label: string; value: string; suffix?: string }[];
  categories: {
    id: string;
    title: string;
    description: string;
    startingPrice: string;
    icon: string;
    href: string;
    cta: string;
  }[];
  whyChooseUs: { icon: string; title: string; description: string }[];
  infrastructure: string[];
  testimonials: { name: string; company: string; rating: number; text: string }[];
  faqs: { question: string; answer: string }[];
  finalCta: { title: string; subtitle: string; primaryLabel: string; secondaryLabel: string };
  status: { title: string; description: string; items: StatusItem[] };
  contact: {
    title: string;
    description: string;
    phoneLabel: string;
    emailLabel: string;
  };
  legal: {
    terms: { heading: string; body: string }[];
    privacy: { heading: string; body: string }[];
    refund: { heading: string; body: string }[];
  };
  footer: {
    description: string;
    socials: { label: string; url: string }[];
  };
}

export interface TldConfig {
  tld: string;
  registerBdt: number;
  registerUsd: number;
  renewBdt: number;
  renewUsd: number;
  transferBdt: number;
  transferUsd: number;
  premium?: boolean;
  minYears: number;
}

export interface SiteConfigData {
  content: SiteContent;
  tlds: TldConfig[];
}
