"use client";
import { cn } from "@shared/lib/utils";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

const INK = "#12141F";

const FAQS = [
  {
    question: "How quickly do you actually go live?",
    answer: "Most accounts are live within two weeks: audit and strategy in week one, first flows written, built and shipped in week two."
  },
  {
    question: "Do we need to be on Klaviyo?",
    answer: "We work primarily in Klaviyo, but we can also build inside Mailchimp or Omnisend if that's where your list already lives."
  },
  {
    question: "What list size makes this worth it?",
    answer:
      "Around 10,000 engaged subscribers, or a store doing roughly $50k a month. Below that, we will usually point you at a lighter setup instead of a retainer."
  },
  {
    question: "Who writes and designs the emails?",
    answer: "Our in-house copywriters and designers handle every send, briefed by strategists who know your brand, your list and your data."
  },
  {
    question: "How do you report on results?",
    answer: "One report a month, in plain language, tying every campaign and flow back to revenue per recipient."
  },
  {
    question: "What does it cost and how long is the commitment?",
    answer: "Pricing depends on list size and scope, but most retainers run month-to-month with no long-term lock-in."
  }
] as const;

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" data-nav-theme="light" className="bg-white px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-11 md:grid-cols-3">
        <div className="md:sticky md:top-24">
          <h2 className="text-[clamp(56px,11vw,140px)] leading-[0.82] font-extrabold tracking-[-0.06em] text-[#12141F]">FAQ</h2>
        </div>

        <div className="flex flex-col md:col-span-2">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className={cn("border-t border-dashed border-black/15 transition-colors duration-300", isOpen && "border-t-[#FFD21F]")}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-5.5 py-6.5 text-left"
                >
                  <span className="flex-none bg-black/8 px-2 py-1 font-mono text-[11px] tracking-[0.12em] text-black/70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 text-[clamp(17px,1.8vw,23px)] font-semibold tracking-[-0.02em]" style={{ color: INK }}>
                    {faq.question}
                  </span>
                  <span className="relative flex size-9.5 flex-none items-center justify-center text-white" style={{ backgroundColor: INK }}>
                    <Plus
                      className={cn("size-4 transition-all duration-300 ease-out", isOpen ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100")}
                    />
                    <Minus
                      className={cn(
                        "absolute size-4 transition-all duration-300 ease-out",
                        isOpen ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
                      )}
                    />
                  </span>
                </button>

                <div
                  className={cn(
                    "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="max-w-[70ch] pr-18.5 pb-7.5 pl-18.5 text-[16px] leading-relaxed text-black/72">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="border-t border-dashed border-black/15" />
        </div>
      </div>
    </section>
  );
}
