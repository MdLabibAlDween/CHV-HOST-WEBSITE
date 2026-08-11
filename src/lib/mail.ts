import nodemailer from "nodemailer";
import { getEnv } from "@/lib/env";
import { log } from "@/lib/logger";

/**
 * Server-side mail transport.
 *
 * Configure SMTP via env (SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS).
 * When SMTP is not configured, messages are logged (dev mode) and the
 * form still acknowledges the sender — the site never breaks because
 * mail is unconfigured.
 */

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (transporter) return transporter;
  const env = getEnv();
  if (env.smtpHost && env.smtpUser && env.smtpPass) {
    transporter = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpPort === 465,
      auth: { user: env.smtpUser, pass: env.smtpPass },
    });
  }
  return transporter;
}

export interface MailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

export async function sendMail(message: MailMessage): Promise<{ ok: boolean; delivered: boolean }> {
  const t = getTransporter();
  if (!t) {
    log("CONTACT_FORM", { note: "SMTP not configured — message logged instead.", to: message.to });
    return { ok: true, delivered: false };
  }
  try {
    await t.sendMail({
      from: getEnv().smtpFrom ?? getEnv().siteName,
      ...message,
    });
    return { ok: true, delivered: true };
  } catch (err) {
    log("CONTACT_FORM", { error: err instanceof Error ? err.message : "smtp failure" });
    return { ok: false, delivered: false };
  }
}
