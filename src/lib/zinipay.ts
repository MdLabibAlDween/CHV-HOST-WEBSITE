import { getEnv } from "@/lib/env";
import { log } from "@/lib/logger";

/**
 * ZiniPay payment gateway client (server-side only).
 *
 * Based on the official ZiniPay sandbox API documentation:
 *   POST /v1/payment/create  -> hosted invoice + payment_url
 *   POST /v1/payment/verify  -> verify invoice status
 *
 * Auth: `zini-api-key` header. The API key is read from the
 * environment and never exposed to the browser.
 */

export type ZinipayStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface ZinipayCreateParams {
  cusName?: string;
  cusEmail?: string;
  amount: number;
  metadata?: Record<string, string>;
  redirectUrl: string;
  cancelUrl?: string;
  webhookUrl?: string;
}

export interface ZinipayCreateResult {
  ok: boolean;
  paymentUrl?: string;
  message?: string;
  error?: "NOT_CONFIGURED" | "UNREACHABLE" | "REJECTED" | "INVALID_RESPONSE";
}

export interface ZinipayVerifyResult {
  ok: boolean;
  status?: ZinipayStatus;
  invoiceId?: string;
  transactionId?: string;
  amount?: number;
  paymentMethod?: string;
  error?: "NOT_CONFIGURED" | "UNREACHABLE" | "REJECTED" | "INVALID_RESPONSE";
}

function isConfigured(): boolean {
  return Boolean(getEnv().zinipayApiKey);
}

async function apiCall(
  endpoint: string,
  body: unknown,
): Promise<{ ok: boolean; status: number; json?: Record<string, unknown>; error?: string }> {
  const env = getEnv();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(`${env.zinipayBaseUrl.replace(/\/$/, "")}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "zini-api-key": env.zinipayApiKey,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const text = await res.text();
    let json: Record<string, unknown> | undefined;
    try {
      json = text ? JSON.parse(text) : undefined;
    } catch {
      json = undefined;
    }
    return { ok: res.ok, status: res.status, json };
  } catch (err) {
    return { ok: false, status: 0, error: err instanceof Error ? err.message : "network error" };
  } finally {
    clearTimeout(timeout);
  }
}

/** Create a hosted ZiniPay invoice. Returns the secure payment_url. */
export async function zinipayCreateInvoice(
  params: ZinipayCreateParams,
): Promise<ZinipayCreateResult> {
  if (!isConfigured()) {
    return { ok: false, error: "NOT_CONFIGURED" };
  }
  log("ZINIPAY_CREATE", {
    amount: params.amount,
    hasMetadata: Boolean(params.metadata),
  });

  const { ok, status, json } = await apiCall("/v1/payment/create", {
    cus_name: params.cusName,
    cus_email: params.cusEmail,
    amount: params.amount,
    metadata: params.metadata,
    redirect_url: params.redirectUrl,
    cancel_url: params.cancelUrl,
    webhook_url: params.webhookUrl,
  });

  if (!ok) {
    return {
      ok: false,
      error: status === 0 ? "UNREACHABLE" : "REJECTED",
      message: json?.message ? String(json.message) : `ZiniPay request failed (HTTP ${status})`,
    };
  }
  if (json?.status !== true || typeof json.payment_url !== "string") {
    return { ok: false, error: "INVALID_RESPONSE" };
  }
  return { ok: true, paymentUrl: json.payment_url as string };
}

/**
 * Server-side payment verification. Never trust a client-side
 * redirect or a bare callback — always verify with ZiniPay before
 * crediting an invoice.
 */
export async function zinipayVerifyInvoice(invoiceId: string): Promise<ZinipayVerifyResult> {
  if (!isConfigured()) {
    return { ok: false, error: "NOT_CONFIGURED" };
  }
  log("ZINIPAY_VERIFY", { invoiceId });

  const { ok, status, json } = await apiCall("/v1/payment/verify", { invoice_id: invoiceId });

  if (!ok) {
    return {
      ok: false,
      error: status === 0 ? "UNREACHABLE" : "REJECTED",
    };
  }

  const amount = typeof json?.amount === "number" ? json.amount : undefined;
  const transactionId = typeof json?.transaction_id === "string" ? json.transaction_id : undefined;
  const verifiedInvoice = typeof json?.invoice_id === "string" ? json.invoice_id : undefined;
  const paymentStatus =
    json?.status === "COMPLETED" || json?.status === "PENDING" || json?.status === "FAILED"
      ? (json.status as ZinipayStatus)
      : undefined;
  const paymentMethod = typeof json?.payment_method === "string" ? json.payment_method : undefined;

  return {
    ok: Boolean(verifiedInvoice && paymentStatus),
    status: paymentStatus,
    invoiceId: verifiedInvoice,
    transactionId,
    amount,
    paymentMethod,
  };
}
