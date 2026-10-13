"use client";
import { colors } from "@shared/constants/colors";
import { footerContent } from "@shared/lib/footerContent";
import { ArrowUp } from "lucide-react";

export default function FooterCredits() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div
      style={{
        position: "relative",
        zIndex: 20,
        width: "100%",
        padding: "clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 6vw, 5rem)",
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem"
      }}
    >
      <span
        style={{
          fontFamily: "Inter Variable, sans-serif",
          fontSize: "0.72rem",
          color: `${colors.cream}55`,
          letterSpacing: "0.05em"
        }}
      >
        {footerContent.address}
      </span>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1.1rem" }}>
          <span
            style={{
              fontFamily: "Inter Variable, sans-serif",
              fontSize: "0.65rem",
              color: `${colors.cream}35`,
              letterSpacing: "0.1em",
              textTransform: "uppercase"
            }}
          >
            {footerContent.copyright}
          </span>
        </div>

        <button
          type="button"
          onClick={scrollToTop}
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: `1px solid ${colors.cream}20`,
            background: `${colors.cream}06`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: `${colors.cream}50`,
            transition: "color 0.25s, border-color 0.25s",
            flexShrink: 0,
            cursor: "pointer"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = colors.cream;
            e.currentTarget.style.borderColor = `${colors.cream}50`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = `${colors.cream}50`;
            e.currentTarget.style.borderColor = `${colors.cream}20`;
          }}
        >
          <ArrowUp size={15} />
        </button>
      </div>
    </div>
  );
}
