# ZiniPay — WHMCS Payment Gateway Module (fallback)

## Recommended: use the official module

ZiniPay publishes an official WHMCS module:

> https://zinipay.com/downloads/zinipay_whmcs_module_v2.2.zip
> (Plugins, Modules & APK → WHMCS Module)

Install the official module into `modules/gateways/` first. It follows
WHMCS's gateway architecture, creates the invoice payment on ZiniPay,
handles the callback and marks invoices paid with correct transaction
IDs. If it satisfies your requirements (it should), **use it** — do not
install the fallback below at the same time.

## Fallback module (custom)

If the official module is ever insufficient, use the files in this
folder. They implement the standard WHMCS payment gateway pattern:

- `modules/gateways/zinipay.php` — gateway definition (config, link,
  refund, and the standard `zinipay_link` function that redirects the
  customer to ZiniPay).
- `modules/gateways/callback/zinipay.php` — callback endpoint that
  verifies the payment **server-side** with ZiniPay
  (`POST /v1/payment/verify`), validates the amount against the
  invoice total, and only then calls `addInvoicePayment()`.

### Install

```bash
# from this repo
cp -r whmcs-modules/zinipay/modules/gateways/* /path/to/whmcs/modules/gateways/
```

Then in WHMCS Admin → Setup → Payments → Payment Gateways:

1. Activate **ZiniPay**.
2. Enter your **ZiniPay API key** (sandbox key while testing).
3. Set **Sandbox Mode** on for testing, off for production.
4. Save. Optionally hide the "All Payment Methods" header in
   client area → General Settings → Ordering tab.

### Security notes (matching PRD §21–§22)

- The callback **never trusts** the HTTP query/body alone — it always
  re-verifies with `POST /v1/payment/verify`.
- `addInvoicePayment()` is guarded: WHMCS records the transaction id,
  so a duplicate callback cannot double-credit the invoice.
- The amount is compared against the invoice balance before payment is
  recorded.
- Enable HTTPS on the WHMCS installation (required for callbacks).

## Matching the frontend flow

The storefront (this Next.js app) hands customers into WHMCS at
checkout (`/cart.php?a=add&pid=...&billingcycle=...`). WHMCS creates the
invoice, the customer pays via this ZiniPay gateway, and WHMCS's
provisioning automation activates the service — exactly the
Product → WHMCS → Invoice → ZiniPay → Verification → Paid → Provisioning
lifecycle required by the PRD.
