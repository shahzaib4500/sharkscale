"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** ~6em wide at tracking -0.052em; keeps the full word inside the @container width. */
const WORDMARK_FONT_SIZE = "min(21cqw, calc(100cqw / 5.95))";

export default function FooterWordmark() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current || !textRef.current) {
      return;
    }

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        textRef.current,
        { yPercent: 30, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: wrapperRef.current, start: "top 90%", end: "bottom bottom", scrub: 1 }
        }
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="@container relative mt-16 overflow-hidden sm:mt-24"
      style={{
        height: `max(160px, calc(${WORDMARK_FONT_SIZE} * 1.16))`
      }}
    >
      <div
        ref={textRef}
        className="absolute right-0 bottom-[-0.13em] left-0 text-center leading-[1.02] font-black tracking-[-0.052em] whitespace-nowrap select-none"
        style={{
          fontSize: WORDMARK_FONT_SIZE,
          backgroundImage: "linear-gradient(180deg, #ffffff 0%, #cfd6f5 34%, #9fadd9 62%, #5f6ea8 84%, #3a4680 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent"
        }}
      >
        SharkScale
      </div>
    </div>
  );
}
