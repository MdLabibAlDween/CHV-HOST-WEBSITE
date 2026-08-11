import { NextRequest, NextResponse } from "next/server";
import { getEnv } from "@/lib/env";
import { whmcsRequest } from "@/lib/whmcs";
import { zinipayVerifyInvoice } from "@/lib/zinipay";
import { claimProcessing, getLedgerEntry } from "@/lib/payment-ledger";
import { log } from "@/lib/logger";

export const runtime = "nodejs";

/**
 * GET /api/payment/return
 *
 * Browser redirect target after the customer finishes on ZiniPay.
 *
 * Security: a customer redirecting back is never enough to mark a
 * payment as successful. This handler verifies the payment server-
 * side with ZiniPay; if verified COMPLETED it records the payment
 * (idempotently) and redirects to the success page. Otherwise it
 * redirects to the cancelled/failed page and the invoice stays unpaid.
 */
export async function GET(request: NextRequest) {
  const invoiceId = request.nextUrl.searchParams.get("invoice_id") ?? "";
  const cancelled = request.nextUrl.searchParams.get("cancelled") === "1";
  const env = getEnv();

  if (!invoiceId) {
    return NextResponse.redirect(new URL(env.paymentCancelUrl, env.appBaseUrl), 302);
  }

  if (cancelled) {
    return NextResponse.redirect(new URL(env.paymentCancelUrl, env.appBaseUrl), 302);
  }

  const verified = await zinipayVerifyInvoice(invoiceId);
  const successUrl = new URL(env.paymentSuccessUrl, env.appBaseUrl);
  const cancelUrl = new URL(env.paymentCancelUrl, env.appBaseUrl);
  successUrl.searchParams.set("invoice_id", invoiceId);
  cancelUrl.searchParams.set("invoice_id", invoiceId);

  if (verified.ok && verified.status === "COMPLETED" && verified.invoiceId) {
    const claimKey = `paid:${verified.invoiceId}`;
    if (!getLedgerEntry(claimKey)) {
      const createEntry = getLedgerEntry(`create:${invoiceId}`);
      const whmcsInvoiceId = createEntry?.whmcsInvoiceId;
      if (whmcsInvoiceId) {
        const invoiceResult = await whmcsRequest("GetInvoice", { invoiceid: Number(whmcsInvoiceId) });
        const invoice = invoiceResult.ok ? invoiceResult.data : null;
        const invoiceStatus = invoice ? String(invoice.status ?? "").toLowerCase() : "unpaid";
        const expectedAmount = invoice ? Number(invoice.total) : 0;

        if (invoiceStatus !== "paid") {
          const paidAmount = verified.amount;
          if (
            paidAmount !== undefined &&
            Number.isFinite(paidAmount) &&
            Math.abs(paidAmount - expectedAmount) <= 0.01
          ) {
            const payResult = await whmcsRequest("AddPayment", {
              invoiceid: Number(whmcsInvoiceId),
              transid: verified.transactionId ?? verified.invoiceId,
              gateway: "zinipay",
              amount: paidAmount,
            });
            if (payResult.ok) {
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
                transactionId: verified.transactionId,
                amount: paidAmount,
                via: "return-redirect-verification",
              });
            }
          } else {
            log("PAYMENT_REJECTED", { invoiceId, reason: "amount mismatch at return" });
          }
        }
      }
    }
    return NextResponse.redirect(successUrl, 302);
  }

  return NextResponse.redirect(cancelUrl, 302);
}
