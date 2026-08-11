import fs from "node:fs";
import path from "node:path";

/**
 * Payment ledger for idempotent processing.
 *
 * Guarantees that a ZiniPay transaction is applied to a WHMCS invoice
 * exactly once, even if callbacks arrive multiple times or from
 * multiple sources (webhook + return redirect).
 *
 * File-backed for single-instance deployments. For multi-instance
 * production, swap this for a Redis/Postgres implementation exposing
 * the same two functions.
 */

const LEDGER_FILE = path.join(process.cwd(), "content", "payment-ledger.json");

export interface LedgerEntry {
  key: string;
  zinipayInvoiceId: string;
  transactionId?: string;
  whmcsInvoiceId: string;
  amount: number;
  currency: string;
  outcome: "PAID" | "PENDING" | "FAILED" | "REJECTED" | "ALREADY_PAID";
  processedAt: string;
}

function readLedger(): LedgerEntry[] {
  try {
    if (!fs.existsSync(LEDGER_FILE)) return [];
    return JSON.parse(fs.readFileSync(LEDGER_FILE, "utf-8")) as LedgerEntry[];
  } catch {
    return [];
  }
}

function writeLedger(entries: LedgerEntry[]) {
  fs.mkdirSync(path.dirname(LEDGER_FILE), { recursive: true });
  fs.writeFileSync(LEDGER_FILE, JSON.stringify(entries, null, 2), "utf-8");
}

/** Atomically mark a transaction as processed. Returns false when already processed. */
export function claimProcessing(key: string, entry: Omit<LedgerEntry, "key" | "processedAt">): boolean {
  const entries = readLedger();
  if (entries.some((e) => e.key === key)) return false;
  entries.push({ key, processedAt: new Date().toISOString(), ...entry });
  writeLedger(entries);
  return true;
}

export function getLedgerEntry(key: string): LedgerEntry | undefined {
  return readLedger().find((e) => e.key === key);
}

export function listLedgerEntries(): LedgerEntry[] {
  return readLedger().reverse();
}
