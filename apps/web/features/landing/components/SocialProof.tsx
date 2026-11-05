"use client";
import BrandTicker from "@features/landing/components/BrandTicker";
import { cn } from "@shared/lib/utils";
import gsap from "gsap";
import { useEffect, useRef } from "react";

const STATS = [
  {
    id: "revenue-share",
    end: 38,
    prefix: "",
    suffix: "%",
    label: "of client revenue attributed to email",
    highlight: false
  },
  {
    id: "generated",
    end: 12,
    prefix: "$",
    suffix: "M+",
    label: "generated for ecommerce brands",
    highlight: false
  },
  {
    id: "brands",
    end: 64,
    prefix: "",
    suffix: "",
    label: "brands scaled since 2021",
    highlight: false
  },
  {
    id: "speed",
    end: 14,
    prefix: "",
    suffix: " days",
    label: "from kickoff to first flow live",
    highlight: true
  }
] as const;

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function formatStat(value: number, prefix: string, suffix: string) {
  return `${prefix}${Math.round(value)}${suffix}`;
}

export default function SocialProof() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const valueRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const values = valueRefs.current.filter(Boolean) as HTMLSpanElement[];
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];

    if (prefersReducedMotion()) {
      values.forEach((el, index) => {
        const stat = STATS[index];
        if (stat) {
          el.textContent = formatStat(stat.end, stat.prefix, stat.suffix);
        }
      });
      return;
    }

    // Set initial entrance state for cards
    gsap.set(cards, { opacity: 0, y: 24 });
    values.forEach((el, index) => {
      const stat = STATS[index];
      if (stat) {
        el.textContent = formatStat(0, stat.prefix, stat.suffix);
      }
    });

    const ctx = gsap.context(() => {});

    let triggered = false;
    const runAnimation = () => {
      if (triggered) {
        return;
      }
      triggered = true;

      ctx.add(() => {
        // Entrance animation for cards
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.09,
          ease: "power2.out"
        });

        // Counter count-up animation
        values.forEach((el, index) => {
          const stat = STATS[index];
          if (!stat) {
            return;
          }

          const counter = { value: 0 };
          gsap.to(counter, {
            value: stat.end,
            duration: 1.5,
            delay: 0.05 + index * 0.08,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = formatStat(counter.value, stat.prefix, stat.suffix);
            }
          });
        });
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          runAnimation();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} data-nav-theme="light" className="relative w-full bg-[#FBFBFD] pt-10 pb-16 sm:pt-14 sm:pb-24">
      <div className="relative z-10 mx-auto w-full max-w-260 px-4 sm:px-6">
        <div className="grid overflow-hidden rounded-[22px] border border-black/5 bg-white sm:grid-cols-4">
          {STATS.map((stat, index) => (
            <div
              key={stat.id}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              className={cn(
                "flex flex-col justify-between gap-6 px-6 py-7 sm:px-7 sm:py-8",
                stat.highlight ? "bg-[#FFD21F]" : "bg-white",
                index < STATS.length - 1 && "border-b border-black/5 sm:border-r sm:border-b-0"
              )}
            >
              <p className="text-[2.65rem] leading-none font-extrabold tracking-[-0.04em] text-[#12141F] tabular-nums sm:text-[3.1rem]">
                <span
                  ref={(node) => {
                    valueRefs.current[index] = node;
                  }}
                >
                  {formatStat(0, stat.prefix, stat.suffix)}
                </span>
              </p>
              <p className="max-w-44 text-[13px] leading-snug text-[#12141F]/70 sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        <BrandTicker label="Retention partner to 64 ecommerce brands" className="mt-12 sm:mt-14" />
      </div>
    </section>
  );
}
