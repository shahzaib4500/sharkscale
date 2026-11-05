"use client";
import { colors } from "@shared/constants/colors";
import { BOOK_SECTION_ID, PROCESS_SECTION_ID, SECTION_LINK_HREF, handleSectionNavClick } from "@shared/lib/scrollToSection";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useEffect, useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const VIOLET = "#4A1AC9";
const INK = "#12141F";
const BAND_BLUE = "#123CE8";
const SCALLOP_COUNT = 40;

const PHONE_IMAGE = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=720&q=80";

export default function PartnerBand() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const reveal = { trigger: section, start: "top 72%", once: true };

      if (contentRef.current) {
        gsap.from(contentRef.current, {
          opacity: 0,
          y: 32,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: reveal
        });
      }

      if (phoneRef.current) {
        gsap.from(phoneRef.current, {
          opacity: 0,
          y: 90,
          scale: 0.97,
          duration: 1.1,
          delay: 0.15,
          ease: "power3.out",
          scrollTrigger: reveal
        });
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <>
      <section ref={sectionRef} className="w-full overflow-hidden px-6 py-20 sm:px-10 sm:py-28" style={{ background: BAND_BLUE, color: "#ffffff" }}>
        <div className="mx-auto grid w-full max-w-260 items-center gap-12 lg:grid-cols-[1fr_1fr]">
          <div ref={contentRef}>
            <span
              className="inline-flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[12.5px] font-semibold"
              style={{ backgroundColor: "rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.9)" }}
            >
              <span className="size-3.5 flex-none rounded-lg" style={{ backgroundColor: colors.secondary }} />
              FREE 30-MINUTE REVENUE AUDIT
            </span>

            <h2 className="mt-5 max-w-[18ch] text-[clamp(30px,3.8vw,52px)] leading-[1.06] font-extrabold tracking-[-0.035em] uppercase">
              30 minutes to unlock your next 30% in revenue.
            </h2>

            <p className="mt-5 max-w-[46ch] text-[16.5px] leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
              We&apos;ll dig into your Klaviyo and show you where revenue is being left behind—from missing flows and weak campaigns to overlooked segments, low
              repeat purchases, and retention gaps. You leave with{" "}
              <span className="font-bold text-white">real opportunities, clear priorities, and an action plan.</span>
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={SECTION_LINK_HREF}
                onClick={handleSectionNavClick(BOOK_SECTION_ID)}
                className="inline-flex items-center gap-2.5 rounded-[10px] px-6 py-3.5 text-[14.5px] font-extrabold"
                style={{ backgroundColor: colors.secondary, color: INK }}
              >
                FIND MY 30% →
              </a>
              <a
                href={SECTION_LINK_HREF}
                onClick={handleSectionNavClick(PROCESS_SECTION_ID)}
                className="inline-flex items-center gap-2.5 rounded-[10px] px-6 py-3.5 text-[14.5px] font-bold"
                style={{ backgroundColor: "rgba(255,255,255,0.16)", color: "#ffffff" }}
              >
                SEE WHAT WE AUDIT
              </a>
            </div>
          </div>

          <div ref={phoneRef} className="flex justify-center">
            <div
              className="w-full max-w-80 rounded-[42px] p-2.5 shadow-[0_60px_110px_-40px_rgba(4,12,44,0.75)]"
              style={{ background: INK, transform: "rotate(-3deg)" }}
            >
              <div className="overflow-hidden rounded-[33px] bg-white" style={{ color: INK }}>
                <div className="flex items-center justify-center py-2.5">
                  <span className="h-1.25 w-18.5 rounded-full" style={{ backgroundColor: "rgba(10,16,51,0.18)" }} />
                </div>

                <div className="flex items-center gap-2.5 border-b border-black/8 px-4 py-2.5 text-[11.5px]" style={{ color: "rgba(10,16,51,0.5)" }}>
                  <span className="size-4.5 flex-none rounded-lg" style={{ backgroundColor: VIOLET }} />
                  Inbox · Lumen
                </div>

                <div className="relative aspect-9/7 w-full">
                  <Image src={PHONE_IMAGE} alt="" fill sizes="320px" draggable={false} className="object-cover" />
                </div>

                <div className="flex flex-col gap-2.5 px-4.5 pt-4 pb-5.5">
                  <span className="font-mono text-[10px] tracking-[0.14em] uppercase" style={{ color: VIOLET }}>
                    Replenishment · flow 3
                  </span>
                  <span className="text-[18px] leading-[1.2] font-extrabold tracking-tight">Your restock is due in 4 days</span>
                  <span className="text-[13px] leading-relaxed" style={{ color: "rgba(10,16,51,0.62)" }}>
                    You are about 4 days from running out. One tap and it is on its way.
                  </span>
                  <span className="mt-1.5 rounded-lg py-2.5 text-center text-[13px] font-bold text-white" style={{ backgroundColor: VIOLET }}>
                    Reorder in one tap
                  </span>
                  <span className="flex justify-between pt-1 font-mono text-[10.5px]" style={{ color: "rgba(10,16,51,0.45)" }}>
                    <span>Open 54%</span>
                    <span>$26.9k</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="flex h-7.5 justify-center overflow-hidden" style={{ backgroundColor: "#F6F6F3" }}>
        {Array.from({ length: SCALLOP_COUNT }).map((_, index) => (
          <span key={index} className="-mt-6.75 h-13.5 w-13.5 flex-none rounded-full" style={{ backgroundColor: BAND_BLUE }} />
        ))}
      </div>
    </>
  );
}
