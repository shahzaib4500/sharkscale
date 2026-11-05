"use client";
import Script from "next/script";
import { useEffect, useRef } from "react";

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void;
    };
  }
}

export default function BookACall() {
  const widgetRef = useRef<HTMLDivElement>(null);

  const initWidget = () => {
    const widget = widgetRef.current;
    if (CALENDLY_URL && window.Calendly && widget && widget.childElementCount === 0) {
      window.Calendly.initInlineWidget({ url: CALENDLY_URL, parentElement: widget });
    }
  };

  useEffect(() => {
    initWidget();
  }, []);

  return (
    <section data-nav-theme="light" className="flex flex-col items-center bg-white px-6 py-20 sm:px-10 sm:py-28">
      <link rel="stylesheet" href="https://assets.calendly.com/assets/external/widget.css" />

      <span
        className="inline-block rounded-full border px-3.5 py-1.5 text-[12.5px] font-bold tracking-[0.02em]"
        style={{ color: "#123CE8", borderColor: "#123CE859" }}
      >
        Free teardown
      </span>

      <h2 className="mt-4 text-center text-[clamp(32px,4.4vw,62px)] leading-[1.04] font-bold tracking-tight text-[#12141F]">
        Let&apos;s Find the Money You&apos;re Missing
      </h2>
      <p className="mt-4 max-w-lg text-center text-[16.5px] leading-relaxed text-[#12141F]/70">
        Give us 30 minutes and your Klaviyo. We&apos;ll find the gaps, missed opportunities, and quick wins that could be costing your brand revenue.
      </p>

      <div className="mt-12 w-full max-w-3xl">
        <div className="overflow-hidden rounded-3xl border border-black/8 bg-white shadow-[0_30px_90px_-35px_rgba(10,16,51,0.18)]">
          <div ref={widgetRef} style={{ minWidth: 320, height: 900 }} />
        </div>
      </div>

      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="afterInteractive" onLoad={initWidget} />
    </section>
  );
}
