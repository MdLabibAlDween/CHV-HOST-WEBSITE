import { NextRequest, NextResponse } from "next/server";
import { getEnv } from "@/lib/env";
import { whmcsRequest } from "@/lib/whmcs";
import { zinipayCreateInvoice } from "@/lib/zinipay";
import { claimProcessing, getLedgerEntry } from "@/lib/payment-ledger";
import { rateLimit, clientKey } from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * POST /api/payment/create
 *
 * Creates a ZiniPay hosted invoice for a WHMCS invoice.
 *
 * Security rules enforced here:
 *  - The amount is NEVER taken from the client — it is fetched from
 *    WHMCS (GetInvoice) so a tampered payload can't change the price.
 *  - The invoice must exist in WHMCS and be Unpaid.
 *  - ZiniPay redirect/cancel/webhook URLs always point back at this
 *    site's HTTPS endpoints.
 */
export async function POST(request: NextRequest) {
  const limit = rateLimit(`payment:${clientKey(request)}`, { max: 10, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const invoiceId = (body as Record<string, unknown>)?.whmcsInvoiceId;
  if (typeof invoiceId !== "string" || !/^\d+$/.test(invoiceId)) {
    return NextResponse.json({ error: "Invalid invoice id." }, { status: 400 });
  }

  const env = getEnv();

  // 1. Fetch the invoice from WHMCS (source of truth for amount).
  const invoiceResult = await whmcsRequest("GetInvoice", { invoiceid: Number(invoiceId) });
  if (!invoiceResult.ok) {
    return NextResponse.json(
      { error: "We're temporarily unable to connect to the billing system. Please try again shortly." },
      { status: 502 },
    );
  }
  const invoice = invoiceResult.data;
  const status = String(invoice.status ?? "").toLowerCase();
  if (status === "paid") {
    return NextResponse.json({ error: "This invoice is already paid.", alreadyPaid: true }, { status: 409 });
  }
  if (status !== "unpaid" && status !== "pending") {
    return NextResponse.json(
      { error: `This invoice cannot be paid (status: ${status}).` },
      { status: 409 },
    );
  }

  const amount = Number(invoice.total);
  const currency = typeof invoice.currencycode === "string" ? invoice.currencycode.toUpperCase() : "BDT";
  const clientName = typeof invoice.firstname === "string" ? `${invoice.firstname} ${invoice.lastname ?? ""}`.trim() : "";
  const clientEmail = typeof invoice.email === "string" ? invoice.email : "";

  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "Invalid invoice amount." }, { status: 400 });
  }

  const base = env.appBaseUrl.replace(/\/$/, "");
  const zinipay = await zinipayCreateInvoice({
    cusName: clientName || undefined,
    cusEmail: clientEmail || undefined,
    amount,
    metadata: {
      whmcs_invoice_id: invoiceId,
      currency,
    },
    redirectUrl: `${base}/api/payment/return?invoice_id=${invoiceId}`,
    cancelUrl: `${base}/api/payment/return?invoice_id=${invoiceId}&cancelled=1`,
    webhookUrl: `${base}/api/payment/webhook`,
  });

  if (!zinipay.ok || !zinipay.paymentUrl) {
    const message =
      zinipay.error === "NOT_CONFIGURED"
        ? "Payments are not configured yet. Please contact support."
        : "Payment service is temporarily unavailable. Please try again later.";
    return NextResponse.json({ error: message }, { status: zinipay.error === "NOT_CONFIGURED" ? 503 : 502 });
  }

  // Track the intent so a duplicate create for the same invoice is safe.
  if (!getLedgerEntry(`create:${invoiceId}`)) {
    claimProcessing(`create:${invoiceId}`, {
      zinipayInvoiceId: "",
      transactionId: undefined,
      whmcsInvoiceId: invoiceId,
      amount,
      currency,
      outcome: "PENDING",
    });
  }

  return NextResponse.json({
    ok: true,
    paymentUrl: zinipay.paymentUrl,
    invoiceId,
    amount,
    currency,
  });
}
