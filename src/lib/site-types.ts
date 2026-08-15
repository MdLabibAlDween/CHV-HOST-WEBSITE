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
  | "bdix"
  | "wordpress"
  | "reseller"
  | "bdix-vps"
  | "windows-rdp"
  | "managed-vps"
  | "ivac"
  | "dedicated"
  | "license";

export const CATEGORY_META: Record<
  PlanCategory,
  { label: string; href: string; description: string }
> = {
  bdix: {
    label: "BDIX Hosting",
    href: "/bdix-hosting",
    description: "Bangladesh-optimized shared hosting over the local BDIX network.",
  },
  wordpress: {
    label: "WordPress Hosting",
    href: "/wordpress-hosting",
    description: "Optimized WordPress hosting with LiteSpeed and one-click installs.",
  },
  reseller: {
    label: "Reseller Hosting",
    href: "/reseller-hosting",
    description: "White-label hosting with WHM and your own nameservers.",
  },
  "bdix-vps": {
    label: "BDIX VPS / RDP",
    href: "/bdix-vps",
    description: "Low-latency VPS and RDP servers on the local BDIX network.",
  },
  "windows-rdp": {
    label: "Windows Server RDP",
    href: "/windows-rdp",
    description: "Windows Server remote desktops for business and automation.",
  },
  "managed-vps": {
    label: "Managed VPS",
    href: "/managed-vps",
    description: "Root-access VPS with server management handled by our team.",
  },
  ivac: {
    label: "IVAC Service",
    href: "/ivac",
    description: "IVAC solutions for high-security remote desktop environments.",
  },
  dedicated: {
    label: "Dedicated Server",
    href: "/dedicated-server",
    description: "Full bare-metal servers with NVMe storage and root access.",
  },
  license: {
    label: "License",
    href: "/license",
    description: "Genuine software licenses — cPanel, Windows and more.",
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
    terms: LegalTermsSection[];
    privacy: { heading: string; body: string }[];
    refund: LegalTermsSection[];
  };
  footer: {
    description: string;
    socials: { label: string; url: string }[];
  };
}

export interface LegalTermsSection {
  heading: string;
  body?: string;
  items?: string[];
  subsections?: { heading: string; body?: string; items?: string[] }[];
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
