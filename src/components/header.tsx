"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/logo";
import { Icon } from "@/components/icons";
import { useEnv } from "@/lib/public-env";
import { useTheme } from "@/components/theme-provider";

const NAV = [
  { label: "Home", href: "/" },
  {
    label: "Hosting",
    href: "/bdix-hosting",
    children: [
      { label: "BDIX Hosting", href: "/bdix-hosting" },
      { label: "WordPress Hosting", href: "/wordpress-hosting" },
      { label: "Reseller Hosting", href: "/reseller-hosting" },
    ],
  },
  { label: "Domains", href: "/domains" },
  {
    label: "VPS & RDP",
    href: "/bdix-vps",
    children: [
      { label: "BDIX VPS / RDP", href: "/bdix-vps" },
      { label: "Windows Server RDP", href: "/windows-rdp" },
      { label: "Managed VPS", href: "/managed-vps" },
    ],
  },
  {
    label: "Servers",
    href: "/dedicated-server",
    children: [
      { label: "Dedicated Server", href: "/dedicated-server" },
      { label: "IVAC Service", href: "/ivac" },
      { label: "License", href: "/license" },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  { label: "Support", href: "/support" },
];

function NavLink({
  item,
  onNavigate,
}: {
  item: (typeof NAV)[number];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = pathname === item.href || (item.children?.some((c) => pathname === c.href) ?? false);
  const [open, setOpen] = useState(false);

  if (item.children) {
    return (
      <li className="relative">
        <button
          type="button"
          className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            active ? "text-primary" : "text-slate-700 hover:text-primary dark:text-slate-300"
          }`}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {item.label}
          <Icon name="chevron-down" size={14} className={open ? "rotate-180" : ""} />
        </button>
        {open && (
          <ul
            className="absolute left-0 top-full z-50 mt-1 w-48 rounded-xl border border-border-soft bg-card p-1.5 shadow-lg shadow-slate-900/5 dark:border-white/10 dark:shadow-black/40"
            onClick={() => {
              setOpen(false);
              onNavigate?.();
            }}
          >
            {item.children.map((child) => (
              <li key={child.href}>
                <Link
                  href={child.href}
                  className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary dark:text-slate-300 dark:hover:bg-white/5"
                >
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li>
      <Link
        href={item.href}
        onClick={onNavigate}
        className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          active ? "text-primary" : "text-slate-700 hover:text-primary dark:text-slate-300"
        }`}
      >
        {item.label}
      </Link>
    </li>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const env = useEnv();
  const { theme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const clientAreaUrl = "/client-area";

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-shadow ${
        scrolled
          ? "border-b border-border-soft bg-white/90 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-ink/90"
          : "bg-white/60 backdrop-blur-md dark:bg-ink/60"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label={`${env.siteName} home`} className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Main navigation" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <NavLink key={item.label} item={item} />
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border-soft text-slate-700 transition-colors hover:border-primary/40 hover:text-primary dark:border-white/10 dark:text-slate-300 dark:hover:text-white"
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
          </button>
          <a
            href={clientAreaUrl}
            className="inline-flex items-center gap-2 rounded-lg border border-border-soft px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-primary/40 hover:text-primary dark:border-white/10 dark:text-slate-300"
          >
            <Icon name="user" size={16} />
            Client Area
          </a>
          <Link
            href="/pricing"
            className="btn-gradient inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold"
          >
            Get Started
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border-soft text-slate-700 transition-colors hover:border-primary/40 hover:text-primary dark:border-white/10 dark:text-slate-300 dark:hover:text-white"
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} size={18} />
          </button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border-soft text-slate-700 lg:hidden dark:border-white/10 dark:text-slate-300"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <Icon name={menuOpen ? "x" : "menu"} size={22} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="border-t border-border-soft bg-white lg:hidden dark:border-white/10 dark:bg-ink">
          <nav aria-label="Mobile navigation" className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <ul className="flex flex-col gap-1">
              {NAV.map((item) => (
                <li key={item.label}>
                  {item.children ? (
                    <div className="mb-1">
                      <Link
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-slate-900 dark:text-slate-100"
                      >
                        {item.label}
                        <Icon name="chevron-right" size={14} className="text-slate-400 dark:text-slate-500" />
                      </Link>
                      <ul className="ml-3 border-l border-border-soft pl-2 dark:border-white/10">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={() => setMenuOpen(false)}
                              className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:text-primary dark:text-slate-400"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary dark:text-slate-300 dark:hover:bg-white/5"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col gap-2.5 border-t border-border-soft pt-4 dark:border-white/10">
              <a
                href={clientAreaUrl}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border-soft px-4 py-2.5 text-sm font-semibold text-slate-700 dark:border-white/10 dark:text-slate-300"
              >
                <Icon name="user" size={16} />
                Client Area
              </a>
              <Link
                href="/pricing"
                onClick={() => setMenuOpen(false)}
                className="btn-gradient inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
