import { NextRequest, NextResponse } from "next/server";
import { getEnv } from "@/lib/env";
import { log } from "@/lib/logger";
import { sendMail } from "@/lib/mail";
import { rateLimit, clientKey } from "@/lib/rate-limit";

export const runtime = "nodejs";

const NAME_RE = /^.{2,80}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[\d+\-\s()]{6,20}$/;
const SUBJECT_RE = /^.{4,120}$/;
const MESSAGE_RE = /^.{10,3000}$/;

export async function POST(request: NextRequest) {
  const limit = rateLimit(`contact:${clientKey(request)}`, { max: 5, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const b = (body as Record<string, unknown>) ?? {};
  const name = typeof b.name === "string" ? b.name.trim() : "";
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const phone = typeof b.phone === "string" ? b.phone.trim() : "";
  const subject = typeof b.subject === "string" ? b.subject.trim() : "";
  const message = typeof b.message === "string" ? b.message.trim() : "";

  if (!NAME_RE.test(name) || !EMAIL_RE.test(email) || !SUBJECT_RE.test(subject) || !MESSAGE_RE.test(message)) {
    return NextResponse.json({ error: "Please check your inputs and try again." }, { status: 400 });
  }
  if (phone && !PHONE_RE.test(phone)) {
    return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
  }

  const env = getEnv();
  log("CONTACT_FORM", { name, email, phone: phone || null, subject });

  const escaped = (s: string) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!);
  const html = `
    <h2>New contact form message</h2>
    <p><strong>Name:</strong> ${escaped(name)}</p>
    <p><strong>Email:</strong> ${escaped(email)}</p>
    <p><strong>Phone:</strong> ${escaped(phone || "—")}</p>
    <p><strong>Subject:</strong> ${escaped(subject)}</p>
    <p><strong>Message:</strong></p>
    <p style="white-space:pre-wrap">${escaped(message)}</p>
  `;

  await sendMail({
    to: env.supportEmail,
    replyTo: email,
    subject: `[${env.siteName} Contact] ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "—"}\n\n${message}`,
    html,
  });

  return NextResponse.json({ ok: true, message: "Message received. We'll get back to you shortly." });
}
