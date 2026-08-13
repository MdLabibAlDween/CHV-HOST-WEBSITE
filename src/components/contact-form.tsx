"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { useEnv } from "@/lib/public-env";

export function ContactForm() {
  const env = useEnv();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      setStatus("ok");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  const inputClass =
    "h-11 w-full rounded-xl border border-border-soft bg-card px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/10 dark:text-slate-100 dark:placeholder:text-slate-500";
  const labelClass = "block text-sm font-semibold text-slate-700 dark:text-slate-300";

  if (status === "ok") {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-emerald-200 bg-emerald-50 p-10 text-center dark:border-emerald-500/30 dark:bg-emerald-500/10">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-emerald-500 dark:bg-white/10">
          <Icon name="check-circle" size={28} />
        </span>
        <h2 className="mt-4 text-xl font-extrabold text-slate-900 dark:text-slate-100">Message sent!</h2>
        <p className="mt-2 max-w-sm text-sm text-slate-600 dark:text-slate-400">
          Thanks for reaching out. Our team will get back to you within a few hours.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 rounded-xl border border-emerald-300 px-5 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/40 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Name <span className="text-rose-500">*</span>
          </label>
          <input id="contact-name" type="text" required autoComplete="name" value={form.name} onChange={update("name")} className={`mt-1.5 ${inputClass}`} />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email <span className="text-rose-500">*</span>
          </label>
          <input id="contact-email" type="email" required autoComplete="email" value={form.email} onChange={update("email")} className={`mt-1.5 ${inputClass}`} />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-phone" className={labelClass}>
            Phone
          </label>
          <input id="contact-phone" type="tel" autoComplete="tel" value={form.phone} onChange={update("phone")} className={`mt-1.5 ${inputClass}`} placeholder="+8801XXXXXXXXX" />
        </div>
        <div>
          <label htmlFor="contact-subject" className={labelClass}>
            Subject <span className="text-rose-500">*</span>
          </label>
          <input id="contact-subject" type="text" required value={form.subject} onChange={update("subject")} className={`mt-1.5 ${inputClass}`} />
        </div>
      </div>
      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Message <span className="text-rose-500">*</span>
        </label>
        <textarea id="contact-message" required rows={6} value={form.message} onChange={update("message")} className="mt-1.5 w-full rounded-xl border border-border-soft bg-card px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/10 dark:text-slate-100 dark:placeholder:text-slate-500" />
      </div>

      {status === "error" && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-gradient inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Sending…
          </>
        ) : (
          <>
            <Icon name="mail" size={17} />
            Send Message
          </>
        )}
      </button>

      <p className="text-xs text-muted">
        Prefer tickets? {env.whmcsUrl ? (
          <a href={`${env.whmcsUrl.replace(/\/$/, "")}/submitticket.php`} className="font-semibold text-primary hover:underline">
            Open a support ticket
          </a>
        ) : (
          <span>Ticket support opens with our client area.</span>
        )}
      </p>
    </form>
  );
}
