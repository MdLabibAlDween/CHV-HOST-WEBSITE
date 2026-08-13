"use client";

import Image from "next/image";
import { useState } from "react";
import { useEnv } from "@/lib/public-env";

/**
 * Site logo. Uses /logo.png when available (drop your logo in
 * `public/logo.png`), otherwise falls back to the branded text mark.
 */
export function Logo({ light = false, size = "md" }: { light?: boolean; size?: "sm" | "md" | "lg" }) {
  const env = useEnv();
  const [error, setError] = useState(false);

  const mark = (
    <span
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg btn-gradient font-bold text-white"
      style={{ fontSize: size === "lg" ? 16 : 13 }}
      aria-hidden="true"
    >
      CH
    </span>
  );

  const text = (
    <span className="flex flex-col leading-none">
      <span
        className={`font-extrabold tracking-tight ${size === "lg" ? "text-xl" : "text-lg"}`}
        style={{ color: light ? "#fff" : "inherit" }}
      >
        {env.siteName}
      </span>
      <span
        className={`hidden font-medium sm:block ${size === "lg" ? "text-[11px]" : "text-[9px]"} uppercase tracking-[0.18em] text-muted`}
        style={{ color: light ? "rgb(148 163 184)" : "#64748b" }}
      >
        {env.siteTagline}
      </span>
    </span>
  );

  if (env.logoPath && !error) {
    return (
      <span className="flex items-center gap-2.5">
        <Image
          src={env.logoPath}
          alt={`${env.siteName} logo`}
          width={size === "lg" ? 40 : 34}
          height={size === "lg" ? 40 : 34}
          className="rounded-lg object-contain"
          onError={() => setError(true)}
        />
        {text}
      </span>
    );
  }

  return (
    <span className="flex items-center gap-2.5">
      {mark}
      {text}
    </span>
  );
}
