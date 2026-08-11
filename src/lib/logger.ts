/**
 * Server-side structured logging for integration events.
 *
 * NEVER log secrets: API keys, passwords, full payment credentials or
 * private tokens are always redacted before logging.
 */

type LogEvent =
  | "WHMCS_REQUEST"
  | "WHMCS_RESPONSE"
  | "WHMCS_ERROR"
  | "ZINIPAY_CREATE"
  | "ZINIPAY_VERIFY"
  | "ZINIPAY_CALLBACK"
  | "PAYMENT_SUCCESS"
  | "PAYMENT_FAILED"
  | "PAYMENT_REJECTED"
  | "PROVISIONING_SUCCESS"
  | "PROVISIONING_FAILED"
  | "DOMAIN_SEARCH"
  | "CONTACT_FORM"
  | "ADMIN_ACTION"
  | "APP_ERROR";

const SECRET_PATTERNS: RegExp[] = [
  /(api[_-]?key|secret|password|token|authorization|identifier)\s*[:=]\s*["']?[^"'\s,;}]+/gi,
];

function redact(input: string): string {
  let out = input;
  for (const pattern of SECRET_PATTERNS) {
    out = out.replace(pattern, (match) => {
      const prefix = match.split(/[:=]/)[0];
      return `${prefix}: [REDACTED]`;
    });
  }
  return out;
}

function serialize(data: unknown): string {
  if (data instanceof Error) return JSON.stringify({ message: data.message, stack: data.stack });
  try {
    return redact(JSON.stringify(data));
  } catch {
    return String(data);
  }
}

export function log(event: LogEvent, data?: unknown): void {
  const entry = {
    ts: new Date().toISOString(),
    event,
    detail: data === undefined ? undefined : serialize(data),
  };
  console.log(JSON.stringify(entry));
}

export function logError(event: LogEvent, err: unknown): void {
  log(event, { message: err instanceof Error ? err.message : String(err) });
}
