"use client";
import googleAnalytics from "@shared/assets/google_analytics.webp";
import hubspot from "@shared/assets/hubspot.webp";
import klaviyo from "@shared/assets/klaviyo.webp";
import mailchimp from "@shared/assets/mailchimp.webp";
import notion from "@shared/assets/notion.webp";
import omnisend from "@shared/assets/omnisend.webp";
import shopify from "@shared/assets/shopify.webp";
import wooCommerce from "@shared/assets/woo_commerce.webp";
import zapier from "@shared/assets/zapier.webp";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image, { StaticImageData } from "next/image";
import { useEffect, useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const tools: { name: string; src: StaticImageData; x: number; y: number; w: string; h: string; seed: number }[] = [
  { name: "Klaviyo", src: klaviyo, x: 4, y: 8, w: "clamp(80px,8vw,128px)", h: "clamp(80px,8vw,128px)", seed: 0 },
  { name: "Shopify", src: shopify, x: 30, y: 3, w: "clamp(72px,7.5vw,120px)", h: "clamp(72px,7.5vw,120px)", seed: 1 },
  { name: "Mailchimp", src: mailchimp, x: 62, y: 5, w: "clamp(76px,8vw,124px)", h: "clamp(76px,8vw,124px)", seed: 2 },
  { name: "HubSpot", src: hubspot, x: 83, y: 10, w: "clamp(150px,16vw,240px)", h: "clamp(50px,5.3vw,80px)", seed: 3 },
  { name: "WooCommerce", src: wooCommerce, x: 78, y: 48, w: "clamp(150px,16vw,240px)", h: "clamp(50px,5.3vw,80px)", seed: 4 },
  { name: "Omnisend", src: omnisend, x: 79, y: 78, w: "clamp(150px,16vw,240px)", h: "clamp(50px,5.3vw,80px)", seed: 5 },
  { name: "Zapier", src: zapier, x: 54, y: 84, w: "clamp(150px,16vw,240px)", h: "clamp(50px,5.3vw,80px)", seed: 6 },
  { name: "Google Analytics", src: googleAnalytics, x: 22, y: 83, w: "clamp(130px,13vw,200px)", h: "clamp(65px,6.5vw,100px)", seed: 7 },
  { name: "Notion", src: notion, x: 3, y: 65, w: "clamp(72px,7.5vw,120px)", h: "clamp(72px,7.5vw,120px)", seed: 8 }
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
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const layer = layerRef.current;
    const items = itemRefs.current.filter((el): el is HTMLDivElement => el !== null);
    if (!section || !layer || items.length === 0) {
      return;
    }

    const ctx = gsap.context(() => {
      const layerRect = layer.getBoundingClientRect();
      const cx = layerRect.left + layerRect.width / 2;
      const cy = layerRect.top + layerRect.height / 2;

      // Start each icon collapsed at the center of the section.
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

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 68%",
          once: true
        }
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

      tl.from(
        [headingRef.current, paraRef.current],
        {
          y: 32,
          opacity: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out"
        },
        "-=0.35"
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
      `}</style>

      {/* Scattered icons — absolutely positioned */}
      <div ref={layerRef} className="absolute inset-0">
        {tools.map((tool, index) => (
          <div
            key={tool.name}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className="absolute"
            style={{
              left: `${tool.x}%`,
              top: `${tool.y}%`,
              width: tool.w,
              height: tool.h,
              willChange: "transform"
            }}
          >
            <div style={floatStyle(tool.seed)} className="size-full">
              <div className="flex size-full items-center justify-center p-3">
                <Image src={tool.src} alt={tool.name} className="size-full object-contain" draggable={false} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Center text */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <h2 ref={headingRef} className="text-4xl font-extrabold uppercase tracking-tight sm:text-5xl lg:text-6xl">
          <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 bg-clip-text text-transparent">Tools We Work With</span>
        </h2>
        <p ref={paraRef} className="max-w-md text-lg text-tertiary/60 sm:text-xl">
          We integrate seamlessly with the platforms that power your business.
        </p>
      </div>
    </section>
  );
}
