"use client";
import { colors } from "@shared/constants/colors";
import Link from "next/link";
import type { ReactNode } from "react";

interface OutlinePillProps {
  href: string;
  children: ReactNode;
}

export default function OutlinePill({ href, children }: OutlinePillProps) {
  const isExternal = href.startsWith("http");

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.45rem 1.1rem",
        borderRadius: "9999px",
        border: `1px solid ${colors.cream}25`,
        fontFamily: "Inter Variable, sans-serif",
        fontSize: "0.82rem",
        fontWeight: 500,
        color: `${colors.cream}80`,
        textDecoration: "none",
        transition: "border-color 0.25s, color 0.25s, background-color 0.25s"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = colors.secondary;
        e.currentTarget.style.color = colors.secondary;
        e.currentTarget.style.backgroundColor = `${colors.secondary}10`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${colors.cream}25`;
        e.currentTarget.style.color = `${colors.cream}80`;
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      {children}
    </Link>
  );
}
