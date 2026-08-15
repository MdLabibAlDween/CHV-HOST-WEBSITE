"use client";

import { Icon } from "@/components/icons";

export function LiveChatCard({ enabled }: { enabled: boolean }) {
  const openTawk = () => {
    const api = (window as unknown as { Tawk_API?: { maximize?: () => void } }).Tawk_API;
    if (api?.maximize) {
      api.maximize();
    } else {
      window.open(
        "https://embed.tawk.to/67eb013beb0591190d9dbd6c/default",
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  return (
    <button
      type="button"
      onClick={openTawk}
      className="group rounded-2xl border border-border-soft bg-card p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-slate-900/5 dark:border-white/10 dark:hover:shadow-black/30"
    >
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl btn-gradient text-white">
        <Icon name="headphones" size={22} />
      </span>
      <h2 className="mt-4 text-base font-bold text-slate-900 dark:text-slate-100">Live Chat</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Instant answers during business hours on the homepage.
      </p>
      <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        {enabled ? "Start Chatting" : "Chat opens with our live chat provider"}
        <Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-1" />
      </p>
    </button>
  );
}
