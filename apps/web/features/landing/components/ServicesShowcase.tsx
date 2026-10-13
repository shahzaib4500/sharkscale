"use client";
import automationFlows from "@shared/assets/automationAndFlows.webp";
import contentCreation from "@shared/assets/contentCreation.webp";
import designTemplates from "@shared/assets/designAndTemplates.webp";
import emailStrategy from "@shared/assets/emailStrategy.webp";
import useIsMobile from "@shared/hooks/useIsMobile";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CREAM = "#f5f0e8";
const WHITE = "#ffffff";

const services = [
  {
    id: "01",
    tag: "#service_01",
    image: emailStrategy as StaticImageData,
    eyebrow: "Strategy",
    title: "Email Strategy",
    description: "We design data-driven campaigns that maximize opens, clicks, and sales.",
    bg: "radial-gradient(ellipse 120% 90% at 70% 110%, #ffd21f28 0%, transparent 55%), linear-gradient(160deg, #1b0a50 0%, #2e1478 45%, #24106a 100%)",
    accent: "#ffd21f"
  },
  {
    id: "02",
    tag: "#service_02",
    image: contentCreation as StaticImageData,
    eyebrow: "Creative",
    title: "Content Creation",
    description: "Compelling copy and visuals that resonate with your audience and drive action.",
    bg: "radial-gradient(ellipse 100% 80% at 20% 80%, #00e5ff20 0%, transparent 50%), linear-gradient(150deg, #170842 0%, #241064 40%, #2c1680 100%)",
    accent: "#00e5ff"
  },
  {
    id: "03",
    tag: "#service_03",
    image: designTemplates as StaticImageData,
    eyebrow: "Design",
    title: "Design & Templates",
    description: "Beautiful, on-brand email templates optimized for Klaviyo and conversions.",
    bg: "radial-gradient(ellipse 110% 80% at 80% 20%, #ffd21f22 0%, transparent 50%), linear-gradient(145deg, #24106a 0%, #4a1aa5 55%, #2a1275 100%)",
    accent: "#ffd21f"
  },
  {
    id: "04",
    tag: "#service_04",
    image: automationFlows as StaticImageData,
    eyebrow: "Retention",
    title: "Automation & Flows",
    description: "Smart workflows that nurture leads, recover carts, and boost lifetime value.",
    bg: "radial-gradient(ellipse 100% 90% at 30% 90%, #a78bfa25 0%, transparent 55%), linear-gradient(155deg, #170842 0%, #2b1470 50%, #3a1a90 100%)",
    accent: "#a78bfa"
  }
] as const;

type Service = (typeof services)[number];

function ServiceSlide({ service, index }: { service: Service; index: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const container = containerRef.current;
    const bg = bgRef.current;
    if (!container || !bg) {
      return;
    }

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        gsap.set(bg, { yPercent: self.progress * 12 });
      }
    });

    return () => trigger.kill();
  }, []);

  const handleTiltMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const tilt = tiltRef.current;
    if (!tilt) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    gsap.to(tilt, {
      rotateY: px * 16,
      rotateX: -py * 16,
      scale: 1.05,
      transformPerspective: 1000,
      transformOrigin: "center",
      duration: 0.4,
      ease: "power2.out"
    });
  };

  const handleTiltLeave = () => {
    const tilt = tiltRef.current;
    if (!tilt) {
      return;
    }

    gsap.to(tilt, {
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      duration: 0.7,
      ease: "power3.out"
    });
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "hidden",
        clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)",
        zIndex: index + 1
      }}
    >
      {/* Blurry full-screen background image */}
      <div
        ref={bgRef}
        style={{
          position: "absolute",
          top: "-10%",
          left: "-5%",
          width: "110%",
          height: "120%",
          zIndex: 0
        }}
      >
        <Image
          src={service.image}
          alt=""
          fill
          placeholder="blur"
          aria-hidden
          sizes="100vw"
          style={{ objectFit: "cover", filter: "blur(14px) saturate(1.2)", transform: "scale(1.05)" }}
        />
      </div>

      {/* Color tint + darken overlays for legibility */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: service.bg,
          opacity: 0.72,
          zIndex: 1
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 70% 60% at 50% 45%, " + service.accent + "22 0%, transparent 65%)",
          zIndex: 1,
          pointerEvents: "none"
        }}
      />

      {/* Top corner labels */}
      <span
        style={{
          position: "absolute",
          top: "clamp(7rem, 10vw, 9rem)",
          left: "clamp(2rem, 5vw, 5rem)",
          zIndex: 4,
          fontFamily: "Inter Variable, sans-serif",
          fontSize: "0.78rem",
          fontWeight: 600,
          letterSpacing: "0.18em",
          color: CREAM + "70",
          textTransform: "uppercase"
        }}
      >
        {service.tag}
      </span>
      <span
        style={{
          position: "absolute",
          top: "clamp(7rem, 10vw, 9rem)",
          right: "clamp(2rem, 5vw, 5rem)",
          zIndex: 4,
          fontFamily: "Inter Variable, sans-serif",
          fontSize: "0.78rem",
          fontWeight: 600,
          letterSpacing: "0.18em",
          color: CREAM + "50",
          textTransform: "uppercase"
        }}
      >
        {service.id} / {String(services.length).padStart(2, "0")}
      </span>

      {isMobile ? (
        /* Mobile: clean vertical stack — title above image, then description */
        <div
          style={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(1.5rem, 6vw, 2.25rem)",
            padding: "6rem clamp(1.5rem, 8vw, 3rem) clamp(2rem, 8vw, 3.5rem)",
            textAlign: "center"
          }}
        >
          <span
            style={{
              display: "inline-flex",
              padding: "0.3rem 0.9rem",
              borderRadius: "9999px",
              border: "1px solid " + service.accent + "45",
              background: service.accent + "18",
              fontFamily: "Inter Variable, sans-serif",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: service.accent
            }}
          >
            {service.eyebrow}
          </span>

          <h2
            style={{
              fontFamily: "Inter Variable, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(2rem, 9vw, 3.25rem)",
              lineHeight: 1,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              color: WHITE,
              margin: 0,
              textShadow: "0 10px 40px rgba(0,0,0,0.45)"
            }}
          >
            {service.title}
          </h2>

          <div
            style={{
              position: "relative",
              width: "min(72vw, 320px)",
              aspectRatio: "4 / 5",
              borderRadius: "1.25rem",
              overflow: "hidden",
              border: "1px solid " + service.accent + "40",
              boxShadow: "0 30px 70px -25px " + service.accent + "66"
            }}
          >
            <Image src={service.image} alt={service.title} fill placeholder="blur" style={{ objectFit: "cover" }} sizes="(max-width: 1024px) 72vw, 320px" />
          </div>

          <p
            style={{
              fontFamily: "Inter Variable, sans-serif",
              fontSize: "clamp(0.9rem, 3.8vw, 1.05rem)",
              lineHeight: 1.7,
              color: CREAM + "cc",
              maxWidth: "28rem",
              margin: 0
            }}
          >
            {service.description}
          </p>
        </div>
      ) : (
        <>
          {/* Center stage: side details + thumbnail + overlaid title */}
          <div
            className="grid items-center"
            style={{
              position: "relative",
              zIndex: 2,
              height: "100%",
              gridTemplateColumns: "1fr min(78vw, 460px) 1fr",
              maxWidth: "1440px",
              margin: "0 auto",
              padding: "0 clamp(1.5rem, 5vw, 5rem)"
            }}
          >
            {/* Left detail — empty */}
            <div className="hidden lg:block" />

            {/* Center thumbnail with tilt */}
            <div
              onMouseMove={handleTiltMove}
              onMouseLeave={handleTiltLeave}
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "1 / 1",
                perspective: "1000px",
                marginInline: "auto"
              }}
            >
              <div
                ref={tiltRef}
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  borderRadius: "1.25rem",
                  overflow: "hidden",
                  border: "1px solid " + service.accent + "40",
                  boxShadow: "0 40px 90px -20px " + service.accent + "66",
                  willChange: "transform"
                }}
              >
                <Image src={service.image} alt={service.title} fill placeholder="blur" style={{ objectFit: "cover" }} sizes="(max-width: 1024px) 78vw, 460px" />
              </div>
            </div>

            {/* Right detail — empty */}
            <div className="hidden lg:block" />
          </div>

          {/* Big service title overlaid across the middle */}
          <h2
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 3,
              width: "100%",
              textAlign: "center",
              fontFamily: "Inter Variable, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(2.5rem, 8vw, 7rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              color: WHITE,
              margin: 0,
              padding: "0 1rem",
              pointerEvents: "none",
              mixBlendMode: "overlay",
              textShadow: "0 10px 40px rgba(0,0,0,0.35)"
            }}
          >
            {service.title}
          </h2>
        </>
      )}
    </div>
  );
}

export default function ServicesShowcase() {
  return (
    <section id="services" style={{ background: "#1b0a50" }}>
      <h1
        style={{
          position: "relative",
          zIndex: 10,
          fontFamily: "Inter Variable, sans-serif",
          fontWeight: 800,
          fontSize: "clamp(4rem, 14vw, 13rem)",
          lineHeight: 1,
          letterSpacing: "-0.04em",
          textAlign: "center",
          textTransform: "uppercase",
          color: WHITE,
          margin: 0,
          padding: "clamp(1.5rem, 3vw, 2.5rem) 0",
          pointerEvents: "none",
          background: "#1b0a50"
        }}
      >
        Services
      </h1>

      <div style={{ marginTop: "-4rem" }}>
        {services.map((service, index) => (
          <ServiceSlide key={service.id} service={service} index={index} />
        ))}
      </div>
    </section>
  );
}
