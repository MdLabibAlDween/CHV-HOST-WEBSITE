/**
 * Typed environment configuration.
 *
 * All private credentials are read ONLY here (server-side) and never
 * exposed to the browser. Anything prefixed NEXT_PUBLIC_ is safe for
 * the client bundle; everything else must stay in server code.
 */

export type Env = {
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

  whmcsUrl: string;
  whmcsApiUrl: string;
  whmcsIdentifier: string;
  whmcsSecret: string;
  whmcsAccessKey: string;
  useWhmcsProducts: boolean;
  whmcsTimeoutMs: number;
  whmcsCacheTtlMs: number;

  whmHost: string;
  whmUsername: string;
  whmApiToken: string;

  zinipayApiKey: string;
  zinipayBaseUrl: string;
  zinipaySandbox: boolean;
  zinipayWebhookSecret: string;

  appBaseUrl: string;
  paymentSuccessUrl: string;
  paymentCancelUrl: string;

  domainRegistrar: string;
  domainRegistrarApiKey: string;
  domainRegistrarApiSecret: string;

  adminPassword: string;
  liveChatProviderUrl: string;

  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  smtpFrom: string;
};

function str(name: string, fallback = ""): string {
  const v = process.env[name];
  return v === undefined || v === "" ? fallback : v;
}

/**
 * Public value reader: prefers the NEXT_PUBLIC_ alias (which is also
 * inlined into client bundles), falls back to the legacy name and then
 * to a default. Server components use this; client components read the
 * same NEXT_PUBLIC_ names statically in public-env.ts.
 */
function pub(name: string, fallback = ""): string {
  return str(`NEXT_PUBLIC_${name}`, str(name, fallback));
}

function bool(name: string, fallback = false): boolean {
  const v = process.env[name];
  if (v === undefined || v === "") return fallback;
  return v === "true" || v === "1" || v.toLowerCase() === "yes";
}

function num(name: string, fallback: number): number {
  const v = process.env[name];
  if (v === undefined || v === "") return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

const cached: Env = {
  siteName: pub("SITE_NAME", "CHV HOST"),
  siteTagline: pub("SITE_TAGLINE", "Cheap Hosting And VPS"),
  siteDomain: pub("SITE_DOMAIN", "https://yourdomain.com"),
  supportEmail: pub("SUPPORT_EMAIL", "support@yourdomain.com"),
  salesEmail: pub("SALES_EMAIL", "sales@yourdomain.com"),
  supportPhone: pub("SUPPORT_PHONE", "+880XXXXXXXXXX"),
  companyAddress: pub("COMPANY_ADDRESS", "Your Address, Bangladesh"),

  logoPath: pub("LOGO_PATH", "/logo.png"),
  faviconPath: pub("FAVICON_PATH", "/favicon.ico"),
  primaryColor: pub("PRIMARY_COLOR", "#4f46e5"),
  secondaryColor: pub("SECONDARY_COLOR", "#06b6d4"),

  gaId: pub("GA_ID"),
  gtmId: pub("GTM_ID"),
  metaPixelId: pub("META_PIXEL_ID"),

  whmcsUrl: pub("WHMCS_URL"),
  whmcsApiUrl: str("WHMCS_API_URL"),
  whmcsIdentifier: str("WHMCS_IDENTIFIER"),
  whmcsSecret: str("WHMCS_SECRET"),
  whmcsAccessKey: str("WHMCS_ACCESS_KEY"),
  useWhmcsProducts: bool("USE_WHMCS_PRODUCTS", false),
  whmcsTimeoutMs: num("WHMCS_TIMEOUT_MS", 8000),
  whmcsCacheTtlMs: num("WHMCS_CACHE_TTL_MS", 120000),

  whmHost: str("WHM_HOST"),
  whmUsername: str("WHM_USERNAME"),
  whmApiToken: str("WHM_API_TOKEN"),

  zinipayApiKey: str("ZINIPAY_API_KEY"),
  zinipayBaseUrl: str("ZINIPAY_BASE_URL", "https://api.zinipay.com"),
  zinipaySandbox: bool("ZINIPAY_SANDBOX", true),
  zinipayWebhookSecret: str("ZINIPAY_WEBHOOK_SECRET"),

  appBaseUrl: str("APP_BASE_URL", "http://localhost:3000"),
  paymentSuccessUrl: str("PAYMENT_SUCCESS_URL", "/payment/success"),
  paymentCancelUrl: str("PAYMENT_CANCEL_URL", "/payment/cancelled"),

  domainRegistrar: str("DOMAIN_REGISTRAR"),
  domainRegistrarApiKey: str("DOMAIN_REGISTRAR_API_KEY"),
  domainRegistrarApiSecret: str("DOMAIN_REGISTRAR_API_SECRET"),

  adminPassword: str("ADMIN_PASSWORD", "change-me-before-deploy"),
  liveChatProviderUrl: str("LIVE_CHAT_PROVIDER_URL"),

  smtpHost: str("SMTP_HOST"),
  smtpPort: num("SMTP_PORT", 587),
  smtpUser: str("SMTP_USER"),
  smtpPass: str("SMTP_PASS"),
  smtpFrom: str("SMTP_FROM"),
};

/** Server-only configuration. Throws if imported from the browser bundle. */
export function getEnv(): Env {
  return cached;
}

/** True when WHMCS is configured with real values (not placeholders). */
function whmcsConfigured(): boolean {
  const url = cached.whmcsUrl.toLowerCase();
  return Boolean(cached.whmcsUrl && !url.includes("yourdomain.com") && !url.includes("localhost"));
}

/** Public-safe configuration subset (no secrets). */
export function getPublicEnv() {
  return {
    siteName: cached.siteName,
    siteTagline: cached.siteTagline,
    siteDomain: cached.siteDomain,
    supportEmail: cached.supportEmail,
    salesEmail: cached.salesEmail,
    supportPhone: cached.supportPhone,
    companyAddress: cached.companyAddress,
    logoPath: cached.logoPath,
    faviconPath: cached.faviconPath,
    primaryColor: cached.primaryColor,
    secondaryColor: cached.secondaryColor,
    gaId: cached.gaId,
    gtmId: cached.gtmId,
    metaPixelId: cached.metaPixelId,
    liveChatProviderUrl: cached.liveChatProviderUrl,
    whmcsUrl: whmcsConfigured() ? cached.whmcsUrl : "",
  };
}
