"use client";
import alia from "@shared/assets/alia.webp";
import analytics from "@shared/assets/analytics.webp";
import campaigns1 from "@shared/assets/campaigns_1.webp";
import campaigns2 from "@shared/assets/campaigns_2.webp";
import deliverability from "@shared/assets/deliverability.webp";
import flows from "@shared/assets/flows.webp";
import loop from "@shared/assets/loop.webp";
import { BOOK_SECTION_ID, REVENUE_PROOF_SECTION_ID, SECTION_LINK_HREF, handleSectionNavClick } from "@shared/lib/scrollToSection";
import { cn } from "@shared/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

const PARALLAX_STRENGTH = 16;
const HERO_BLUE = "#2F5BFF";
const HERO_NAVY = "#12141F";

const TABS = [
  {
    id: "analytics",
    label: "Analytics",
    images: [{ src: analytics, alt: "Business performance summary with total revenue and attributed revenue" }]
  },
  {
    id: "flows",
    label: "Flows",
    images: [{ src: flows, alt: "Top performing flows, including welcome, checkout, and post-purchase series" }]
  },
  {
    id: "campaigns",
    label: "Campaigns",
    images: [
      { src: campaigns1, alt: "Campaign results with a 47.91% open rate and €1,423 in revenue" },
      { src: campaigns2, alt: "Campaign results with a 69.33% open rate and €1,641 in revenue" }
    ]
  },
  {
    id: "loop",
    label: "Loop",
    images: [{ src: loop, alt: "Cancellation save rate, saved revenue, and save-rate trend" }]
  },
  {
    id: "deliverability",
    label: "Deliverability",
    images: [{ src: deliverability, alt: "Deliverability score of 80 with inbox and complaint metrics" }]
  },
  {
    id: "alia",
    label: "Alia",
    images: [{ src: alia, alt: "Popup design variant test comparing email submit rates" }]
  }
] as const satisfies readonly {
  id: string;
  label: string;
  images: readonly { src: StaticImageData; alt: string }[];
}[];

const TAB_IMAGES = TABS.flatMap((item) =>
  item.images.map((image, imageIndex) => ({
    tabId: item.id,
    imageIndex,
    src: image.src,
    alt: image.alt
  }))
);

type TabId = (typeof TABS)[number]["id"];

function Envelope({ className, stroke }: { className?: string; stroke: string }) {
  return (
    <svg viewBox="0 0 72 52" fill="none" aria-hidden className={className}>
      <rect x="3" y="8" width="66" height="40" rx="6" stroke={stroke} strokeWidth="2.2" />
      <path d="M4 12.5 36 32 68 12.5" stroke={stroke} strokeWidth="2.2" strokeLinejoin="round" />
    </svg>
  );
}

function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 1.2 14.1 9 22.2 12 14.1 15 12 22.8 9.9 15 1.8 12 9.9 9Z" />
    </svg>
  );
}

function DashboardCard() {
  const [activeId, setActiveId] = useState<TabId>("analytics");
  const [slide, setSlide] = useState(0);
  const tab = TABS.find((item) => item.id === activeId) ?? TABS[0];
  const slideCount = tab.images.length;

  useEffect(() => {
    setSlide(0);
  }, [activeId]);

  useEffect(() => {
    if (slideCount < 2) {
      return;
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      return;
    }

    const timer = window.setInterval(() => {
      setSlide((current) => (current + 1) % slideCount);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [activeId, slide, slideCount]);

  function showSlide(next: number) {
    setSlide((next + slideCount) % slideCount);
  }

  return (
    <div className="relative mx-auto w-full max-w-245">
      <div
        aria-hidden
        className="hero-glow pointer-events-none absolute -inset-x-16 -bottom-16 top-8 rounded-[48px] bg-[radial-gradient(ellipse_at_50%_70%,rgba(47,91,255,0.5)_0%,rgba(47,91,255,0.16)_38%,transparent_72%)] blur-3xl"
      />
      <div aria-hidden className="pointer-events-none absolute -left-24 top-24 size-72 rounded-full bg-[#2F5BFF]/25 blur-3xl" />

      <div className="relative overflow-hidden rounded-[22px] border border-black/5 bg-white shadow-[0_28px_80px_-24px_rgba(47,91,255,0.5),0_12px_40px_-20px_rgba(15,23,42,0.16)]">
        <div className="relative">
          <div className="flex items-center gap-1 overflow-x-auto border-b border-black/5 px-5 pt-4 scrollbar-none sm:px-7">
            {TABS.map((item) => {
              const isActive = item.id === activeId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  className={cn(
                    "relative flex shrink-0 items-center gap-2 px-3 pb-3.5 text-[13px] font-medium transition-colors",
                    isActive ? "text-[#2F5BFF]" : "text-neutral-400 hover:text-neutral-600"
                  )}
                >
                  {isActive && <span className="size-3.5 rounded-lg bg-[#2F5BFF]" />}
                  {item.label}
                  {isActive && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[#2F5BFF]" />}
                </button>
              );
            })}
          </div>

          {/* fades the tab bar's edge instead of an abrupt clip when it overflows on narrow screens */}
          <div aria-hidden className="pointer-events-none absolute top-0 right-0 bottom-0 w-8 bg-linear-to-l from-white to-transparent sm:w-12" />
        </div>

        <div className="relative aspect-[7/3] w-full" aria-roledescription={slideCount > 1 ? "carousel" : undefined}>
          {TAB_IMAGES.map(({ tabId, imageIndex, src, alt }) => {
            const isVisible = tabId === activeId && imageIndex === slide;
            const isLcp = tabId === "analytics" && imageIndex === 0;

            return (
              <Image
                key={`${tabId}-${alt}`}
                src={src}
                alt={isVisible ? alt : ""}
                fill
                draggable={false}
                priority={isLcp}
                loading={isLcp ? undefined : "eager"}
                fetchPriority={isLcp ? "high" : "low"}
                aria-hidden={isVisible ? undefined : true}
                className={cn("object-cover transition-opacity duration-500 motion-reduce:transition-none", isVisible ? "opacity-100" : "opacity-0")}
                sizes="(max-width: 1024px) 100vw, 980px"
              />
            );
          })}

          {slideCount > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous campaign"
                onClick={() => showSlide(slide - 1)}
                className="absolute top-1/2 left-3 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/90 text-[#12141F] shadow-sm transition-colors hover:bg-white"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Next campaign"
                onClick={() => showSlide(slide + 1)}
                className="absolute top-1/2 right-3 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/90 text-[#12141F] shadow-sm transition-colors hover:bg-white"
              >
                <ChevronRight className="size-4" />
              </button>
              <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5">
                {tab.images.map((image, index) => (
                  <button
                    key={image.alt}
                    type="button"
                    aria-label={`Show campaign ${index + 1}`}
                    aria-current={index === slide ? "true" : undefined}
                    onClick={() => setSlide(index)}
                    className={cn("h-1.5 rounded-full transition-all", index === slide ? "w-5 bg-[#2F5BFF]" : "w-1.5 bg-[#12141F]/25 hover:bg-[#12141F]/40")}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    function handleMouseMove(event: MouseEvent) {
      if (!section) {
        return;
      }
      const rect = section.getBoundingClientRect();
      const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
      const relativeY = (event.clientY - rect.top) / rect.height - 0.5;
      setOffset({ x: relativeX * PARALLAX_STRENGTH, y: relativeY * PARALLAX_STRENGTH });
    }

    function handleMouseLeave() {
      setOffset({ x: 0, y: 0 });
    }

    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section ref={sectionRef} id="home" data-nav-theme="light" className="relative flex min-h-svh w-full flex-col overflow-hidden bg-white text-[#12141F]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_85%_-10%,rgba(255,210,31,0.22)_0%,transparent_55%),radial-gradient(ellipse_70%_45%_at_10%_20%,rgba(47,91,255,0.06)_0%,transparent_60%),radial-gradient(ellipse_90%_40%_at_50%_100%,rgba(47,91,255,0.10)_0%,transparent_70%)]"
      />

      <div
        aria-hidden
        className="hero-float pointer-events-none absolute top-[30%] left-[5%] hidden w-16 opacity-70 lg:block"
        style={{ transform: `translate3d(${offset.x * -0.6}px, ${offset.y * -0.6}px, 0)` }}
      >
        <Envelope className="w-14 rotate-[-18deg]" stroke="#C5CAD6" />
      </div>
      <div
        aria-hidden
        className="hero-float pointer-events-none absolute top-[28%] right-[8%] hidden w-16 lg:block"
        style={{ transform: `translate3d(${offset.x * 0.8}px, ${offset.y * 0.7}px, 0)`, animationDelay: "1.2s" }}
      >
        <Envelope className="w-14 rotate-12" stroke="#E8C21A" />
      </div>
      <div
        aria-hidden
        className="hero-float pointer-events-none absolute top-[44%] right-[12%] hidden text-[#E8C21A] lg:block"
        style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`, animationDelay: "0.6s" }}
      >
        <Sparkle className="size-4" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-6 pt-36 text-center sm:pt-40">
        <h1 className="text-[2.3rem] leading-[1.05] font-extrabold tracking-[-0.045em] sm:text-[3.35rem] lg:text-[4.1rem]">
          <span style={{ color: HERO_NAVY }}>Extra </span>
          <span className="hero-phrase" style={{ color: HERO_BLUE }}>
            <span className="relative inline-block">
              <span className="relative z-10">30% Revenue</span>
              <span aria-hidden className="hero-highlight absolute -inset-x-0.5 bottom-[0.1em] z-0 h-[0.2em] rounded-[1px] bg-[#FFD21F]" />
            </span>
          </span>
          <span style={{ color: HERO_NAVY }}> for Your Brand</span>
        </h1>

        <p className="mt-6 max-w-152 text-[15px] leading-relaxed text-neutral-500 sm:text-base">
          We turn email and SMS into a serious revenue channel. From high-converting flows and campaigns to smarter segmentation, retention, and
          personalization, we help increase repeat purchases, AOV, and LTV, so you make more from the traffic and customers you already have, without relying on
          more ad spend.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={SECTION_LINK_HREF}
            onClick={handleSectionNavClick(BOOK_SECTION_ID)}
            data-cursor-magnetic
            data-cursor-text="Book"
            className={cn(
              "group inline-flex items-center gap-1 rounded-full px-5 py-3 text-sm font-semibold text-white",
              "bg-[#2F5BFF] transition-colors hover:bg-[#244CE6]"
            )}
          >
            Book a free teardown
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href={SECTION_LINK_HREF}
            onClick={handleSectionNavClick(REVENUE_PROOF_SECTION_ID)}
            data-cursor-magnetic
            data-cursor-text="View"
            className={cn(
              "group inline-flex items-center gap-1 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-[#12141F]",
              "transition-colors hover:bg-neutral-50"
            )}
          >
            See the numbers
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-8 w-full max-w-260 flex-1 px-4 pb-10 sm:mt-16 sm:px-6 sm:pb-20">
        <div className="translate-y-4 sm:translate-y-10">
          <DashboardCard />
        </div>
      </div>
    </section>
  );
}
