"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  "hero",
  "stats",
  "categories",
  "whyChooseUs",
  "infrastructure",
  "testimonials",
  "faqs",
  "finalCta",
] as const;

type SectionKey = (typeof SECTIONS)[number];

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [active, setActive] = useState<SectionKey>("hero");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/login")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setAuthed(Boolean(data.authed));
      })
      .catch(() => {
        if (!cancelled) setAuthed(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
      loadContent();
    } else {
      setNotice({ type: "err", text: "Incorrect password." });
    }
  };

  const loadContent = async () => {
    const res = await fetch("/api/admin/config");
    if (!res.ok) return;
    const data = await res.json();
    const c = data.content as Record<string, unknown>;
    const next: Record<string, string> = {};
    for (const key of SECTIONS) {
      next[key] = JSON.stringify(c[key] ?? null, null, 2);
    }
    setEdits(next);
  };

  const save = async () => {
    setSaving(true);
    setNotice(null);
    try {
      const payload: Record<string, unknown> = {};
      for (const key of SECTIONS) {
        payload[key] = JSON.parse(edits[key] ?? "null");
      }
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setNotice({ type: "ok", text: "Configuration saved. Reloading…" });
      window.location.reload();
    } catch (err) {
      setNotice({ type: "err", text: err instanceof Error ? err.message : "Invalid JSON in one of the sections." });
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/login/logout", { method: "GET" });
    setAuthed(false);
    setPassword("");
  };

  if (authed === null) {
    return <div className="py-20 text-center text-muted">Checking session…</div>;
  }

  if (!authed) {
    return (
      <div className="mx-auto max-w-md px-4 py-20">
        <div className="rounded-3xl border border-border-soft bg-card p-8 shadow-sm dark:border-white/10">
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Admin Login</h1>
          <p className="mt-2 text-sm text-muted">
            Enter the admin password from your <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-white/10">.env</code> file.
          </p>
          <form onSubmit={login} className="mt-6 space-y-4">
            <label htmlFor="admin-password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 w-full rounded-xl border border-border-soft bg-card px-4 text-sm text-slate-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-white/10 dark:text-slate-100"
              autoFocus
            />
            {notice?.type === "err" && <p className="text-sm text-rose-600">{notice.text}</p>}
            <button type="submit" className="btn-gradient w-full rounded-xl px-5 py-3 text-sm font-bold">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Site Content Editor</h1>
          <p className="mt-1 text-sm text-muted">
            Edits are stored in <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs dark:bg-white/10">./content/overrides.json</code> and merged over defaults.
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="rounded-lg border border-border-soft px-4 py-2 text-sm font-semibold text-slate-600 hover:border-rose-200 hover:text-rose-600 dark:border-white/10 dark:text-slate-400"
        >
          Logout
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Content sections" className="flex gap-2 overflow-x-auto lg:flex-col">
          {SECTIONS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              className={`shrink-0 rounded-lg px-4 py-2 text-left text-sm font-semibold transition-colors ${
                active === key ? "btn-gradient text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10"
              }`}
            >
              {key}
            </button>
          ))}
        </nav>

        <div className="space-y-4">
          <label htmlFor={`edit-${active}`} className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
            Edit <span className="text-primary">content.{active}</span> (JSON)
          </label>
          <textarea
            id={`edit-${active}`}
            value={edits[active] ?? ""}
            onChange={(e) => setEdits((prev) => ({ ...prev, [active]: e.target.value }))}
            spellCheck={false}
            className="min-h-[420px] w-full rounded-2xl border border-border-soft bg-slate-950 p-4 font-mono text-xs leading-relaxed text-emerald-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {notice && (
            <p className={`text-sm ${notice.type === "ok" ? "text-emerald-600" : "text-rose-600"}`}>
              {notice.text}
            </p>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="btn-gradient rounded-xl px-6 py-3 text-sm font-bold disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
          <p className="text-xs text-muted">
            Product prices are managed separately (./content/plans.json) or by WHMCS — the billing
            system remains the source of truth.
          </p>
        </div>
      </div>
    </div>
  );
}
