import { NextRequest, NextResponse } from "next/server";
import { whmcsRequest } from "@/lib/whmcs";

export const runtime = "nodejs";

/**
 * GET /api/payment/status?invoice_id=...
 * Used by the success page to display the authoritative invoice state
 * from WHMCS (source of truth).
 */
export async function GET(request: NextRequest) {
  const invoiceId = request.nextUrl.searchParams.get("invoice_id");
  if (!invoiceId || !/^\d+$/.test(invoiceId)) {
    return NextResponse.json({ error: "Invalid invoice id." }, { status: 400 });
  }

  const result = await whmcsRequest("GetInvoice", { invoiceid: Number(invoiceId) });
  if (!result.ok) {
    return NextResponse.json(
      { error: "Billing system temporarily unavailable.", source: "unavailable" },
      { status: 502 },
    );
  }

  const invoice = result.data;
  return NextResponse.json({
    invoiceId,
    status: String(invoice.status ?? "unknown"),
    total: invoice.total,
    paid: invoice.status === "Paid",
    source: "whmcs",
  });
}
