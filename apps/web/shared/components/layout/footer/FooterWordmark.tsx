import { colors } from "@shared/constants/colors";
import type { RefObject } from "react";

interface FooterWordmarkProps {
  innerRef: RefObject<HTMLDivElement | null>;
}

export default function FooterWordmark({ innerRef }: FooterWordmarkProps) {
  return (
    <div
      ref={innerRef}
      style={{
        position: "absolute",
        bottom: "-2vh",
        left: "50%",
        transform: "translateX(-50%)",
        fontFamily: "Inter Variable, sans-serif",
        fontWeight: 800,
        fontSize: "17vw",
        lineHeight: 0.75,
        letterSpacing: "-0.05em",
        whiteSpace: "nowrap",
        color: "transparent",
        WebkitTextStroke: `1px ${colors.cream}0A`,
        background: `linear-gradient(180deg, ${colors.cream}18 0%, transparent 65%)`,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        userSelect: "none",
        pointerEvents: "none",
        zIndex: 0
      }}
    >
      SHARKSCALE
    </div>
  );
}
