"use client";
import { colors } from "@shared/constants/colors";
import { footerContent } from "@shared/lib/footerContent";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { RefObject } from "react";
import OutlinePill from "./OutlinePill";

function ArrowCircle() {
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "clamp(2.5rem, 5vw, 5rem)",
        height: "clamp(2.5rem, 5vw, 5rem)",
        border: `1.5px solid ${colors.cream}30`,
        borderRadius: "50%",
        flexShrink: 0,
        marginTop: "0.3rem",
        transition: "border-color 0.25s, background-color 0.25s"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = colors.secondary;
        e.currentTarget.style.backgroundColor = `${colors.secondary}18`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${colors.cream}30`;
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <ArrowUpRight size="36%" style={{ color: colors.cream }} />
    </span>
  );
}

interface FooterHeroProps {
  headingRef: RefObject<HTMLDivElement | null>;
  linksRef: RefObject<HTMLDivElement | null>;
}

export default function FooterHero({ headingRef, linksRef }: FooterHeroProps) {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 10,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(2rem, 5vw, 5rem) clamp(1.5rem, 5vw, 5rem)",
        marginTop: "4rem",
        gap: "clamp(2rem, 4vw, 3.5rem)"
      }}
    >
      <div ref={headingRef} style={{ display: "flex" }}>
        <Link
          href="#contactUs"
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "clamp(0.5rem, 1.5vw, 1.5rem)",
            textDecoration: "none"
          }}
        >
          <span
            style={{
              fontFamily: "Inter Variable, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(3rem, 10vw, 10rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              textAlign: "center",
              background: `linear-gradient(180deg, ${colors.white} 0%, ${colors.cream}66 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: `drop-shadow(0 0 20px ${colors.cream}26)`
            }}
          >
            Reach out to us.
          </span>
          <ArrowCircle />
        </Link>
      </div>

      <div ref={linksRef} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", width: "100%" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.75rem" }}>
          {footerContent.links.map(({ label, href }) => (
            <OutlinePill key={href} href={href}>
              {label}
            </OutlinePill>
          ))}
        </div>
      </div>
    </div>
  );
}
