"use client";
import emailTemplates1 from "@shared/assets/emailTemplates_1.webp";
import emailTemplates2 from "@shared/assets/emailTemplates_2.webp";
import emailTemplates3 from "@shared/assets/emailTemplates_3.webp";
import emailTemplates4 from "@shared/assets/emailTemplates_4.webp";
import emailTemplates5 from "@shared/assets/emailTemplates_5.webp";
import emailTemplates6 from "@shared/assets/emailTemplates_6.webp";
import emailTemplates7 from "@shared/assets/emailTemplates_7.webp";
import { REVENUE_PROOF_SECTION_ID, SECTION_LINK_HREF, handleSectionNavClick } from "@shared/lib/scrollToSection";
import { cn } from "@shared/lib/utils";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

type ScrollDirection = "up" | "down";

const EMAIL_TEMPLATES: StaticImageData[] = [
  emailTemplates1,
  emailTemplates2,
  emailTemplates3,
  emailTemplates4,
  emailTemplates5,
  emailTemplates6,
  emailTemplates7
];

const COLUMN_DIRECTIONS: ScrollDirection[] = ["up", "down", "up", "down"];

function pickRandomTemplates(count: number): StaticImageData[] {
  const pool = [...EMAIL_TEMPLATES];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const current = pool[i];
    const swap = pool[j];
    if (current !== undefined && swap !== undefined) {
      pool[i] = swap;
      pool[j] = current;
    }
  }
  return pool.slice(0, count);
}

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SURFACE = "#F6F6F3";
const INK = "#0A1033";
const BLUE = "#123CE8";

const SCROLL_DURATION_S = 52;

function EmailTemplatePreload() {
  return (
    <div aria-hidden className="pointer-events-none absolute size-0 overflow-hidden opacity-0">
      {EMAIL_TEMPLATES.map((src) => (
        <Image key={src.src} src={src} alt="" width={src.width} height={src.height} loading="eager" fetchPriority="low" />
      ))}
    </div>
  );
}

function ScrollingEmailColumn({ src, alt, direction }: { src: StaticImageData; alt: string; direction: ScrollDirection }) {
  return (
    <div className="relative min-h-0 overflow-hidden rounded-[14px] bg-white/95 [mask-image:linear-gradient(to_bottom,transparent,black_6%,black_94%,transparent)]">
      <div className={cn("flex flex-col gap-4 px-2 pt-2", direction === "up" ? "owned-scroll-up" : "owned-scroll-down")}>
        {[0, 1].map((key) => (
          <Image
            key={key}
            src={src}
            alt={key === 0 ? alt : ""}
            draggable={false}
            loading="eager"
            fetchPriority="low"
            className="h-auto w-full flex-none rounded-[10px] shadow-[0_12px_40px_-20px_rgba(10,16,51,0.45)]"
          />
        ))}
      </div>
    </div>
  );
}

export default function OwnedChannel() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const mockRef = useRef<HTMLDivElement>(null);
  const [columnImages, setColumnImages] = useState(() => EMAIL_TEMPLATES.slice(0, 4));

  useEffect(() => {
    setColumnImages(pickRandomTemplates(4));
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const reveal = { trigger: section, start: "top 72%", once: true };

      if (headingRef.current) {
        gsap.from(headingRef.current, {
          opacity: 0,
          y: 32,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: reveal
        });
      }

      if (mockRef.current) {
        gsap.from(mockRef.current, {
          opacity: 0,
          y: 70,
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
    <section
      ref={sectionRef}
      data-nav-theme="light"
      className="relative w-full overflow-hidden px-6 py-20 sm:px-10 sm:py-24"
      style={{ backgroundColor: SURFACE, color: INK }}
    >
      <EmailTemplatePreload />
      <style>{`
        @keyframes owned-scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes owned-scroll-down {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        .owned-scroll-up {
          animation: owned-scroll-up ${SCROLL_DURATION_S}s linear infinite;
        }
        .owned-scroll-down {
          animation: owned-scroll-down ${SCROLL_DURATION_S}s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .owned-scroll-up,
          .owned-scroll-down {
            animation: none;
          }
        }
      `}</style>

      <div className="mx-auto w-full max-w-260">
        <div ref={headingRef}>
          <span
            className="inline-block rounded-full border px-3.5 py-1.5 text-[12.5px] font-bold tracking-[0.02em]"
            style={{ color: BLUE, borderColor: `${BLUE}59` }}
          >
            Owned channel
          </span>

          <h2 className="mt-6 max-w-[24ch] text-[clamp(32px,4.4vw,62px)] leading-[1.04] font-bold tracking-[-0.04em]">Good enough to stop the scroll.</h2>

          <p className="mt-6 max-w-[62ch] text-[17px] leading-relaxed" style={{ color: "rgba(10,16,51,0.7)" }}>
            Every email is designed around your brand, your customer, and the action we want them to take. Strategy, copy, and design come together to create
            emails people actually want to open, read, and shop.
          </p>

          <a
            href={SECTION_LINK_HREF}
            onClick={handleSectionNavClick(REVENUE_PROOF_SECTION_ID)}
            className="mt-7 inline-flex items-center gap-2.5 rounded-[10px] px-6 py-3.5 text-[14.5px] font-bold text-white"
            style={{ backgroundColor: BLUE }}
          >
            EXPLORE OUR CREATIVE →
          </a>
        </div>

        <div ref={mockRef} className="mx-auto mt-14 grid h-[min(78vh,720px)] w-full max-w-280 grid-cols-2 gap-2.5 overflow-hidden sm:grid-cols-4 sm:gap-4">
          {columnImages.map((src, index) => (
            <ScrollingEmailColumn key={src.src} src={src} alt={`Email creative example ${index + 1}`} direction={COLUMN_DIRECTIONS[index] ?? "up"} />
          ))}
        </div>
      </div>
    </section>
  );
}
