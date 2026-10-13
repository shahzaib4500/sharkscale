"use client";
import { colors } from "@shared/constants/colors";

interface ScrollingTickerProps {
  items: string[];
  speed?: number;
}

export default function ScrollingTicker({ items, speed = 40 }: ScrollingTickerProps) {
  const repeated = [...items, ...items];
  const duration = (items.length * speed) / items.length;

  return (
    <div style={{ overflow: "hidden", width: "100%", position: "relative" }}>
      <div
        style={{
          display: "flex",
          gap: "3rem",
          animation: `ticker-scroll ${duration}s linear infinite`,
          width: "max-content"
        }}
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: "Inter Variable, sans-serif",
              fontWeight: 700,
              fontSize: "clamp(0.9rem, 2vw, 1.2rem)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: `${colors.cream}40`,
              whiteSpace: "nowrap",
              flexShrink: 0
            }}
          >
            {item}
            <span style={{ marginLeft: "3rem", color: colors.secondary, opacity: 0.5 }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
