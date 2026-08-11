# CHV HOST — Cheap Hosting And VPS

A complete web-hosting company platform: modern marketing website + WHMCS
integration + ZiniPay payments + domain search, built with **Next.js 16
(App Router) + TypeScript + Tailwind CSS v4**.

WHMCS remains the **source of truth** for billing, customers, invoices,
services and provisioning. This project provides the branded storefront,
the secure server-side integration layer, and the payment plumbing
around it.

---

## Quick start

```bash
cp .env.example .env      # fill in real values later
npm install
npm run dev               # http://localhost:3000
```

Everything renders out of the box using configurable **mock products and
pricing** (see `src/config/product-catalog.ts`). Once you configure WHMCS
and ZiniPay in `.env`, the site automatically switches to live data and
payments.

## What's included

### Pages
`/` · `/hosting` · `/bdix-hosting` · `/turbo-hosting` · `/reseller-hosting`
· `/vps` · `/bdix-vps` · `/domains` · `/pricing` · `/about` · `/contact`
· `/faq` · `/support` · `/status` · `/terms` · `/privacy` · `/refund-policy`
· `/client-area` (→ WHMCS) · `/checkout` (→ WHMCS cart) · `/admin`
(content editor)

### Server-side integration layer (`src/lib/`)
| Module | Purpose |
| --- | --- |
| `whmcs.ts` | WHMCS API client + cart/client-area URL builders |
| `zinipay.ts` | ZiniPay create/verify client (`/v1/payment/create`, `/v1/payment/verify`) |
| `providers.ts` | Unified product provider — WHMCS-first, catalog fallback |
| `domain.ts` | Domain availability (mock now, registrar-ready interface) |
| `payment-ledger.ts` | Idempotent payment processing (duplicate-callback safe) |
| `mail.ts` | Nodemailer SMTP transport for the contact form |
| `logger.ts` | Structured, secret-redacting integration logging |
| `rate-limit.ts` | In-memory API rate limiting |
| `env.ts` | Typed environment config (secrets never reach the browser) |

### API routes (`src/app/api/`)
`/api/products` · `/api/domains/search` · `/api/status` · `/api/contact` ·
`/api/payment/create` · `/api/payment/webhook` · `/api/payment/return` ·
`/api/payment/status` · `/api/admin/login` · `/api/admin/config` ·
`/api/health`

### WHMCS payment gateway
See `whmcs-modules/zinipay/README.md`. The **official ZiniPay WHMCS
module** is recommended (zinipay.com → Apps & Plugins); a standards-
compliant fallback module is included.

---

## Configuration

All secrets live in `.env` (gitignored). `.env.example` documents every
variable. Key switches:

```
USE_WHMCS_PRODUCTS=false   # true → fetch products/pricing from WHMCS
ZINIPAY_SANDBOX=true       # sandbox while testing
ADMIN_PASSWORD=...         # password for /admin content editor
SMTP_HOST=...              # contact form email transport
```

### Content management
Marketing content (hero, stats, categories, why-us, testimonials, FAQs,
status, legal) is defined in `src/config/site-content.ts` and can be
edited at **`/admin`** — changes are saved to `./content/overrides.json`
(gitignored) and merged over defaults at load time.

Plans and TLD prices: `./content/plans.json` and `./content/tlds.json`
(optional overrides), otherwise `src/config/product-catalog.ts`.

### Live WHMCS connection
1. Set `WHMCS_URL`, `WHMCS_API_URL`, `WHMCS_IDENTIFIER`, `WHMCS_SECRET`
   and `WHMCS_ACCESS_KEY` (recommended) in `.env`.
2. Set `USE_WHMCS_PRODUCTS=true`.
3. Ensure the `whmcsPid` values in the product catalog match your real
   WHMCS product ids (order links use `?pid=<id>&billingcycle=<cycle>`).
4. If WHMCS is unreachable, the site degrades gracefully (friendly
   message) instead of breaking.

### Live payments (ZiniPay)
1. Obtain a **brand/API key** from your ZiniPay dashboard (sandbox key
   for testing).
2. Set `ZINIPAY_API_KEY`, `ZINIPAY_BASE_URL` and `APP_BASE_URL` (the
   public HTTPS URL of this site — ZiniPay requires the redirect domain
   to match your brand).
3. The payment flow is verified server-side at every step:
   - `/api/payment/create` fetches the invoice amount **from WHMCS**
     (never from the browser), then creates the ZiniPay invoice.
   - `/api/payment/webhook` and `/api/payment/return` always re-verify
     with `POST /v1/payment/verify`, validate amount + currency, and
     credit through WHMCS **exactly once** (payment ledger).
4. Test the full cycle in sandbox: success, failure, cancel, duplicate
   callback, wrong amount (each is handled per the PRD test matrix).

---

## Deployment

```bash
npm run build
npm run start          # production server on :3000
```

- Use HTTPS in front (Caddy/Nginx reverse proxy).
- Run a single instance, or swap the file-backed payment ledger for a DB
  (`src/lib/payment-ledger.ts` documents the interface).
- Point `SITE_DOMAIN` at your real domain.
- Add your real `logo.png` to `public/` (a placeholder ships by default).
- Whitelist the frontend origin in WHMCS admin (Setup → General Settings
  → Allowed Origins) and generate API credentials there.

## Security checklist (from the PRD)

- Secrets only in `.env`, never in frontend code or git (`!.env.example`
  committed only).
- Every payment is verified server-side; no `?status=paid` trust.
- Idempotent callbacks via the payment ledger; transaction IDs stored.
- Amount/currency validation against the WHMCS invoice.
- CSRF: admin session uses an httpOnly signed cookie; POST APIs validate
  inputs and are rate-limited.
- XSS: React escapes output; contact form values are HTML-escaped before
  email rendering.
- Logging redacts API keys, passwords and tokens.