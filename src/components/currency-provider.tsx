"use client";

import { createContext, useContext, useState } from "react";
import type { CurrencyCode } from "@/lib/site-types";

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: "BDT",
  setCurrency: () => {},
});

const STORAGE_KEY = "chv-currency";

function initialCurrency(): CurrencyCode {
  if (typeof window === "undefined") return "BDT";
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === "USD" || saved === "BDT" ? saved : "BDT";
  } catch {
    return "BDT";
  }
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(initialCurrency);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    try {
      window.localStorage.setItem(STORAGE_KEY, c);
    } catch {
      /* private mode */
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
