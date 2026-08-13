"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";

export interface FaqItem {
  question: string;
  answer: string;
}

export function FAQAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div
            key={item.question}
            className="overflow-hidden rounded-2xl border border-border-soft bg-card dark:border-white/10"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
              aria-expanded={open}
              aria-controls={`faq-panel-${index}`}
              id={`faq-button-${index}`}
              onClick={() => setOpenIndex(open ? null : index)}
            >
              <span className="text-sm font-semibold text-slate-900 sm:text-base dark:text-slate-100">{item.question}</span>
              <Icon
                name={open ? "minus" : "plus"}
                size={18}
                className={`shrink-0 text-primary transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>
            <div
              id={`faq-panel-${index}`}
              role="region"
              aria-labelledby={`faq-button-${index}`}
              className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm leading-relaxed text-muted sm:px-6">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
