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
    <section
      id="contactUs"
      data-nav-theme="light"
      className="flex flex-col items-center px-4 pt-24 pb-28 text-tertiary sm:px-12 lg:px-24 xl:px-40"
      style={{ background: "#ffffff" }}
    >
      <link rel="stylesheet" href="https://assets.calendly.com/assets/external/widget.css" />

      <h2 className="mb-3 text-center text-4xl font-extrabold uppercase tracking-tight sm:text-5xl lg:text-6xl">Book a Call</h2>
      <p className="mb-8 max-w-lg text-center text-tertiary/70">Schedule a consultation with our team to discuss how we can help scale your email revenue.</p>

      <div className="w-full max-w-3xl">
        <div ref={widgetRef} style={{ minWidth: 320, height: 900 }} />
      </div>

      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="afterInteractive" onLoad={initWidget} />
    </section>
  );
}
