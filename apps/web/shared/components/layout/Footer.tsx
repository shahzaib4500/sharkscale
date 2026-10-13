"use client";
import FooterAuroraGlow from "@shared/components/layout/footer/FooterAuroraGlow";
import FooterCredits from "@shared/components/layout/footer/FooterCredits";
import FooterGridOverlay from "@shared/components/layout/footer/FooterGridOverlay";
import FooterHero from "@shared/components/layout/footer/FooterHero";
import FooterWordmark from "@shared/components/layout/footer/FooterWordmark";
import ScrollingTicker from "@shared/components/layout/footer/ScrollingTicker";
import { colors } from "@shared/constants/colors";
import { footerContent } from "@shared/lib/footerContent";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) {
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        giantRef.current,
        { y: "8vh", opacity: 0 },
        {
          y: "0vh",
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: { trigger: wrapperRef.current, start: "top 80%", end: "bottom bottom", scrub: 1.2 }
        }
      );
      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: wrapperRef.current, start: "top 45%", end: "bottom bottom", scrub: 1 }
        }
      );
    }, wrapperRef);

    const resizeObserver = new ResizeObserver(() => ScrollTrigger.refresh());
    resizeObserver.observe(document.body);

    return () => {
      resizeObserver.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={wrapperRef} style={{ position: "relative", height: "100vh", clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}>
      <footer
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          backgroundColor: colors.bgFooter,
          color: colors.cream,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden"
        }}
      >
        <FooterAuroraGlow />
        <FooterGridOverlay />
        <FooterWordmark innerRef={giantRef} />

        <div style={{ position: "relative", zIndex: 10, marginTop: "clamp(6rem, 12vw, 8rem)" }}>
          <ScrollingTicker items={footerContent.tickerItems} speed={40} />
        </div>

        <FooterHero headingRef={headingRef} linksRef={linksRef} />

        <FooterCredits />
      </footer>
    </div>
  );
}
