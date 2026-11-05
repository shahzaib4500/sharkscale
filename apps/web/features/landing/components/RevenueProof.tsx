"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CREAM = "#FFFFFF";
const CARD = "#FFFFFF";
const INK = "#12141F";
const VIOLET = "#4A1AC9";

const REPORT_STATS = [
  { id: "attributed", label: "Attributed revenue", value: "€35,294" },
  { id: "share", label: "% of total revenue", value: "36.58%" }
] as const;

const PRINCIPLES = [
  {
    id: "traffic",
    title: "More from existing traffic",
    description: "Turn the customers you already paid to acquire into more revenue."
  },
  {
    id: "flows",
    title: "Flows that keep earning",
    description: "Automations generated €25,741 without depending on another campaign send."
  },
  {
    id: "retention",
    title: "Retention that compounds",
    description: "Better journeys bring customers back, increasing repeat purchases, AOV, and LTV over time."
  }
] as const;

export default function RevenueProof() {
  const wrapperRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const principleRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      return;
    }

    const mm = gsap.matchMedia();

    // Fade each piece in as it enters the viewport. The section is only as tall
    // as its content, so this does not add a pinned scroll runway.
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const principles = principleRefs.current.filter((el): el is HTMLLIElement => el !== null);
      const targets: HTMLElement[] = [headingRef.current, cardRef.current, ...principles].filter((el): el is HTMLDivElement | HTMLLIElement => el !== null);

      gsap.set(targets, { opacity: 0, y: 24 });

      targets.forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true
          }
        });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={wrapperRef} id="revenueProof" data-nav-theme="light" className="relative w-full" style={{ backgroundColor: CREAM }}>
      <div className="flex w-full items-center justify-center px-6 py-16 sm:px-10 lg:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(90deg, rgba(24,16,48,0.04) 1px, transparent 1px), linear-gradient(rgba(24,16,48,0.04) 1px, transparent 1px)",
            backgroundSize: "156px 140px"
          }}
        />

        <div className="relative z-10 mx-auto grid w-full max-w-260 items-center gap-14 lg:grid-cols-[0.85fr_1.3fr_0.85fr] lg:gap-12">
          <div ref={headingRef}>
            <p className="text-[10px] font-semibold tracking-[0.24em] uppercase" style={{ color: VIOLET }}>
              One number that matters
            </p>
            <h2 className="mt-4 text-[2.4rem] leading-[1.05] font-extrabold tracking-[-0.045em] sm:text-[2.7rem]" style={{ color: INK }}>
              36% of revenue.
              <br />
              From email.
            </h2>
            <p className="mt-5 max-w-72 text-[13px] leading-relaxed text-neutral-500">
              In just 30 days, email generated <span className="font-semibold text-[#12141F]">€35,294 in attributed revenue</span> for HerbellaVita. Not from
              more ad spend, but from better flows, campaigns, segmentation, and retention.
            </p>
          </div>

          <div
            ref={cardRef}
            className="flex min-h-84 flex-col rounded-[18px] border border-black/5 shadow-[0_28px_70px_-34px_rgba(28,16,60,0.4)]"
            style={{ backgroundColor: CARD, transformOrigin: "center center" }}
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between gap-4 border-b border-black/5 px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <span className="size-3.5 rounded-[5px]" style={{ backgroundColor: VIOLET }} />
                  <p className="text-[13px] font-semibold" style={{ color: INK }}>
                    HerbellaVita
                  </p>
                </div>
                <p className="text-[10px] font-medium tracking-[0.18em] text-neutral-400 uppercase">Last 30 days</p>
              </div>

              <div className="m-5 grid grid-cols-2 rounded-[12px] border border-black/5">
                {REPORT_STATS.map((stat, index) => (
                  <div key={stat.id} className={index === 0 ? "border-r border-black/5 px-4 py-3.5" : "px-4 py-3.5"}>
                    <p className="text-[9px] font-medium tracking-[0.16em] text-neutral-400 uppercase">{stat.label}</p>
                    <p className="mt-1.5 text-[1.4rem] leading-none font-bold tracking-[-0.03em] tabular-nums" style={{ color: INK }}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-auto border-t border-black/5 px-5 py-4">
                <p className="text-[13px] font-semibold" style={{ color: INK }}>
                  One month, 36% of revenue from email.
                </p>
              </div>
            </div>
          </div>

          <ul className="flex flex-col gap-8">
            {PRINCIPLES.map((principle, index) => (
              <li
                key={principle.id}
                ref={(node) => {
                  principleRefs.current[index] = node;
                }}
                className="border-t border-black/10 pt-4"
              >
                <p className="text-[10px] font-medium tracking-[0.14em] text-neutral-400">{`0${index + 1}`}</p>
                <h3 className="mt-3 text-[15px] font-bold tracking-[-0.02em]" style={{ color: INK }}>
                  {principle.title}
                </h3>
                <p className="mt-2 max-w-56 text-[12.5px] leading-relaxed text-neutral-500">
                  {principle.id === "flows" ? (
                    <>
                      Automations generated <span className="font-semibold text-[#12141F]">€25,741</span> without depending on another campaign send.
                    </>
                  ) : (
                    principle.description
                  )}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
