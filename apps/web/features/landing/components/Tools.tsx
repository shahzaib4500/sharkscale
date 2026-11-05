"use client";
import appstle from "@shared/assets/appstle.webp";
import canva from "@shared/assets/canva.webp";
import figma from "@shared/assets/figma.webp";
import googleAnalytics from "@shared/assets/googleAnalytics.webp";
import klaviyo from "@shared/assets/klaviyo.webp";
import openAI from "@shared/assets/openAI.webp";
import shopify from "@shared/assets/shopify.webp";
import tripleWhale from "@shared/assets/tripleWhale.webp";
import trustpilot from "@shared/assets/trustpilot.webp";
import typeform from "@shared/assets/typeform.webp";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image, { StaticImageData } from "next/image";
import { useEffect, useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Tool = {
  name: string;
  src: StaticImageData;
  x: number;
  y: number;
  w: string;
  h: string;
  seed: number;
  mx: number;
  my: number;
  mw: string;
  mh: string;
  /** Square logos (e.g. Canva, Appstle) — assets are 1000×1000 with rounded corners. */
  rounded?: boolean;
};

const wide = {
  w: "clamp(180px,19vw,280px)",
  h: "clamp(60px,6.3vw,94px)",
  mw: "clamp(128px,34vw,176px)",
  mh: "clamp(44px,12vw,58px)"
} as const;

const square = {
  w: "clamp(64px,6.5vw,96px)",
  h: "clamp(64px,6.5vw,96px)",
  mw: "clamp(48px,13vw,64px)",
  mh: "clamp(48px,13vw,64px)"
} as const;

const tools: Tool[] = [
  { name: "Klaviyo", src: klaviyo, x: 3, y: 7, seed: 0, mx: 2, my: 5, ...wide },
  { name: "Shopify", src: shopify, x: 28, y: 2, seed: 1, mx: 52, my: 4, ...wide },
  { name: "Canva", src: canva, x: 54, y: 4, seed: 2, mx: 40, my: 7, ...square, rounded: true },
  { name: "OpenAI", src: openAI, x: 76, y: 7, seed: 3, mx: 54, my: 22, ...wide },
  { name: "Figma", src: figma, x: 82, y: 24, seed: 4, mx: 4, my: 24, ...wide },
  { name: "Google Analytics", src: googleAnalytics, x: 79, y: 44, seed: 5, mx: 52, my: 68, ...wide },
  { name: "Triple Whale", src: tripleWhale, x: 74, y: 64, seed: 6, mx: 34, my: 86, ...wide },
  { name: "Trustpilot", src: trustpilot, x: 50, y: 80, seed: 7, mx: 4, my: 86, ...wide },
  { name: "Typeform", src: typeform, x: 20, y: 78, seed: 8, mx: 54, my: 84, ...wide },
  { name: "Appstle", src: appstle, x: 2, y: 42, seed: 9, mx: 4, my: 68, ...square, rounded: true }
];

function seededVal(seed: number, index: number): number {
  const x = Math.sin(seed * 9301 + index * 49297 + 233) * 1000;
  return x - Math.floor(x);
}

function floatStyle(seed: number): React.CSSProperties {
  const duration = (3 + seededVal(seed, 0) * 2).toFixed(2);
  const delay = (seededVal(seed, 1) * 2.5).toFixed(2);
  const variant = seed % 4;
  return { animation: `tools-float-${variant} ${duration}s ${delay}s ease-in-out infinite` };
}

export default function Tools() {
  const sectionRef = useRef<HTMLElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const ctx = gsap.context(() => {
      const layer = layerRef.current;
      const items = itemRefs.current.filter((el): el is HTMLDivElement => el !== null);

      gsap.set([badgeRef.current, headingRef.current].filter(Boolean), { y: 32, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 68%",
          once: true
        }
      });

      if (layer && items.length > 0) {
        const layerRect = layer.getBoundingClientRect();
        const cx = layerRect.left + layerRect.width / 2;
        const cy = layerRect.top + layerRect.height / 2;

        items.forEach((el) => {
          const r = el.getBoundingClientRect();
          gsap.set(el, {
            x: cx - (r.left + r.width / 2),
            y: cy - (r.top + r.height / 2),
            scale: 0,
            opacity: 0,
            rotate: gsap.utils.random(-45, 45)
          });
        });

        tl.to(items, {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 0.9,
          ease: "back.out(1.4)",
          stagger: { each: 0.06, from: "random" }
        });
      }

      tl.to(
        [badgeRef.current, headingRef.current].filter(Boolean),
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "power3.out"
        },
        items.length > 0 ? "-=0.35" : 0
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} data-nav-theme="light" className="relative overflow-hidden" style={{ height: "80vh", minHeight: 560, background: "#ffffff" }}>
      <style>{`
        @keyframes tools-float-0 {
          0%,100% { transform: translate(0,0) rotate(0deg); }
          50%      { transform: translate(3px,-5px) rotate(2deg); }
        }
        @keyframes tools-float-1 {
          0%,100% { transform: translate(0,0) rotate(0deg); }
          33%      { transform: translate(-4px,3px) rotate(-2deg); }
          66%      { transform: translate(3px,-3px) rotate(1.5deg); }
        }
        @keyframes tools-float-2 {
          0%,100% { transform: translate(0,0) rotate(0deg); }
          40%      { transform: translate(4px,4px) rotate(-1.5deg); }
          80%      { transform: translate(-3px,-4px) rotate(2deg); }
        }
        @keyframes tools-float-3 {
          0%,100% { transform: translate(0,0) rotate(0deg); }
          25%      { transform: translate(-3px,-5px) rotate(1deg); }
          75%      { transform: translate(4px,3px) rotate(-1.5deg); }
        }
        .tools-item {
          left: var(--x);
          top: var(--y);
          width: var(--w);
          height: var(--h);
        }
        @media (max-width: 640px) {
          .tools-item {
            left: var(--mx);
            top: var(--my);
            width: var(--mw);
            height: var(--mh);
          }
        }
      `}</style>

      <div ref={layerRef} className="absolute inset-0">
        {tools.map((tool, index) => (
          <div
            key={tool.name}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className="tools-item absolute"
            data-cursor-text={tool.name}
            style={
              {
                "--x": `${tool.x}%`,
                "--y": `${tool.y}%`,
                "--w": tool.w,
                "--h": tool.h,
                "--mx": `${tool.mx}%`,
                "--my": `${tool.my}%`,
                "--mw": tool.mw,
                "--mh": tool.mh,
                willChange: "transform"
              } as React.CSSProperties
            }
          >
            <div style={floatStyle(tool.seed)} className="size-full">
              <div className="flex size-full items-center justify-center p-3">
                <Image src={tool.src} alt={tool.name} className={`size-full object-contain ${tool.rounded ? "rounded-[14px]" : ""}`} draggable={false} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <span
          ref={badgeRef}
          className="inline-block rounded-full border px-3.5 py-1.5 text-[12.5px] font-bold tracking-[0.02em]"
          style={{ color: "#123CE8", borderColor: "#123CE859" }}
        >
          Integrations
        </span>
        <h2 ref={headingRef} className="mt-4 text-center text-[clamp(32px,4.4vw,62px)] leading-[1.04] font-extrabold uppercase tracking-tight">
          <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-blue-950 bg-clip-text text-transparent">
            The Tools Behind
            <br />
            the Growth
          </span>
        </h2>
      </div>
    </section>
  );
}
