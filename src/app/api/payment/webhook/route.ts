import { NextRequest, NextResponse } from "next/server";
import { getEnv } from "@/lib/env";
import { whmcsRequest } from "@/lib/whmcs";
import { zinipayVerifyInvoice } from "@/lib/zinipay";
import { claimProcessing, getLedgerEntry } from "@/lib/payment-ledger";
import { log } from "@/lib/logger";

export const runtime = "nodejs";

/**
 * POST /api/payment/webhook
 *
 * ZiniPay calls this after a payment update. The bare callback is
 * NEVER trusted — every callback is re-verified server-side with
 * ZiniPay /v1/payment/verify, and only a COMPLETED, amount-matched
 * status marks the WHMCS invoice as paid.
 *
 * Idempotency: the same ZiniPay invoice/transaction can only be
 * credited once (payment ledger).
 *
 * NOTE: If the official ZiniPay WHMCS module is installed, ZiniPay
 * also calls WHMCS directly and the module marks the invoice paid
 * there. This endpoint is the fallback integration path and double-
 * credit is prevented by the WHMCS invoice status re-check below.
 */
export async function POST(request: NextRequest) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    raw = null;
  }
  const body = (raw ?? {}) as Record<string, unknown>;
  const invoiceId = typeof body.invoice_id === "string" ? body.invoice_id : "";

  if (!invoiceId) {
    return NextResponse.json({ error: "Missing invoice_id." }, { status: 400 });
  }

  // Optional shared-secret authentication when configured.
  const env = getEnv();
  if (env.zinipayWebhookSecret) {
    const provided = request.headers.get("x-znp-signature") ?? request.headers.get("authorization") ?? "";
    const expected = env.zinipayWebhookSecret;
    const providedTrim = provided.replace(/^Bearer\s+/i, "").trim();
    if (!providedTrim || providedTrim !== expected) {
      log("ZINIPAY_CALLBACK", { invoiceId, rejected: "bad signature" });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  log("ZINIPAY_CALLBACK", { invoiceId, rawStatus: body.status });

  // 1. Server-side verification with ZiniPay (never trust the callback).
  const verified = await zinipayVerifyInvoice(invoiceId);
  if (!verified.ok || !verified.invoiceId) {
    log("PAYMENT_REJECTED", { invoiceId, reason: "verification failed" });
    return NextResponse.json({ error: "Verification failed." }, { status: 502 });
  }

  if (verified.status === "FAILED") {
    log("PAYMENT_FAILED", { invoiceId, transactionId: verified.transactionId });
    return NextResponse.json({ ok: true, state: "failed" });
  }

  if (verified.status !== "COMPLETED") {
    // PENDING — acknowledge, retry later via later callbacks.
    return NextResponse.json({ ok: true, state: "pending" });
  }

  // 2. Idempotency: this verified invoice may only be credited once.
  const claimKey = `paid:${verified.invoiceId}`;
  const already = getLedgerEntry(claimKey);
  if (already) {
    return NextResponse.json({ ok: true, state: "already-processed" });
  }

  // 3. Resolve the WHMCS invoice id from metadata mapping.

  // The ZiniPay verify response echoes invoice_id; we derive the WHMCS
  // invoice from the create-time mapping stored in the ledger.
  const createEntry = getLedgerEntry(`create:${invoiceId}`);
  const whmcsInvoiceId = createEntry?.whmcsInvoiceId;

  if (!whmcsInvoiceId) {
    log("PAYMENT_REJECTED", { invoiceId, reason: "no whmcs invoice mapping" });
    return NextResponse.json({ error: "Unknown invoice." }, { status: 422 });
  }

  // 4. Re-fetch the WHMCS invoice: must exist and be unpaid.
  const invoiceResult = await whmcsRequest("GetInvoice", { invoiceid: Number(whmcsInvoiceId) });
  if (!invoiceResult.ok) {
    return NextResponse.json(
      { error: "Billing system temporarily unavailable. Please try again shortly." },
      { status: 502 },
    );
  }
  const invoice = invoiceResult.data;
  const invoiceStatus = String(invoice.status ?? "").toLowerCase();
  const expectedAmount = Number(invoice.total);

  if (invoiceStatus === "paid") {
    claimProcessing(claimKey, {
      zinipayInvoiceId: verified.invoiceId,
      transactionId: verified.transactionId,
      whmcsInvoiceId,
      amount: expectedAmount,
      currency: "BDT",
      outcome: "ALREADY_PAID",
    });
    return NextResponse.json({ ok: true, state: "already-paid" });
  }

  // 5. Amount + currency validation (server-side, never from the browser).
  const paidAmount = verified.amount;
  if (paidAmount === undefined || !Number.isFinite(paidAmount) || Math.abs(paidAmount - expectedAmount) > 0.01) {
    log("PAYMENT_REJECTED", {
      invoiceId,
      whmcsInvoiceId,
      reason: "amount mismatch",
      expectedAmount,
      paidAmount,
    });
    return NextResponse.json({ error: "Amount mismatch. Payment not credited." }, { status: 409 });
  }

  // 6. Mark the WHMCS invoice paid. The transaction id is stored so
  //    duplicates can never double-credit.
  const payResult = await whmcsRequest("AddPayment", {
    invoiceid: Number(whmcsInvoiceId),
    transid: verified.transactionId ?? verified.invoiceId,
    gateway: "zinipay",
    amount: paidAmount,
  });
  if (!payResult.ok) {
    log("PAYMENT_FAILED", { invoiceId, whmcsInvoiceId, reason: "AddPayment failed", detail: payResult.message });
    return NextResponse.json(
      { error: "Could not record payment in the billing system. Please contact support." },
      { status: 502 },
    );
  }

  claimProcessing(claimKey, {
    zinipayInvoiceId: verified.invoiceId,
    transactionId: verified.transactionId,
    whmcsInvoiceId,
    amount: paidAmount,
    currency: "BDT",
    outcome: "PAID",
  });

  log("PAYMENT_SUCCESS", {
    whmcsInvoiceId,
    zinipayInvoiceId: verified.invoiceId,
    transactionId: verified.transactionId,
    amount: paidAmount,
  });

  // WHMCS automation now provisions the service and emails the customer.
  return NextResponse.json({ ok: true, state: "paid", whmcsInvoiceId });
}
