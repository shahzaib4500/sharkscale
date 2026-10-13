"use client";
import { colors } from "@shared/constants/colors";
import { cn } from "@shared/lib/utils";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

interface DotsToPlusIconProps {
  onClick?: () => void;
  className?: string;
  color?: string;
}

export default function DotsToPlusIcon({ onClick, className, color = colors.white }: DotsToPlusIconProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const verticalDotsRef = useRef<HTMLDivElement>(null);
  const horizontalDotsRef = useRef<HTMLDivElement>(null);
  const centerThreeDotsRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const animateToPlus = () => {
    const duration = 0.5;
    const ease = "power2.out";

    gsap.to(centerThreeDotsRef.current, { rotation: 90, duration: duration * 0.6, ease });
    gsap.to(centerThreeDotsRef.current, { opacity: 0, scale: 0, duration: duration * 0.4, delay: duration * 0.3, ease });
    gsap.to(verticalDotsRef.current, { opacity: 1, scale: 1, duration: duration * 0.6, delay: duration * 0.2, ease });
    gsap.to(horizontalDotsRef.current, { opacity: 1, scale: 1, duration: duration * 0.6, delay: duration * 0.2, ease });
  };

  const animateToDots = () => {
    const duration = 0.5;
    const ease = "power2.out";

    gsap.to(verticalDotsRef.current, { opacity: 0, scale: 0.5, duration: duration * 0.4, ease });
    gsap.to(horizontalDotsRef.current, { opacity: 0, scale: 0.5, duration: duration * 0.4, ease });
    gsap.to(centerThreeDotsRef.current, { opacity: 1, scale: 1, duration: duration * 0.6, delay: duration * 0.1, ease });
    gsap.to(centerThreeDotsRef.current, { rotation: 0, duration: duration * 0.6, delay: duration * 0.1, ease });
  };

  const handleClick = () => {
    onClick?.();
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative flex size-6 items-center justify-center", className)}
      onMouseEnter={!isMobile ? animateToPlus : undefined}
      onMouseLeave={!isMobile ? animateToDots : undefined}
      onClick={handleClick}
    >
      <div ref={centerThreeDotsRef} className="absolute flex items-center gap-1">
        <span className="size-1 rounded-full" style={{ backgroundColor: color }} />
        <span className="size-1 rounded-full" style={{ backgroundColor: color }} />
        <span className="size-1 rounded-full" style={{ backgroundColor: color }} />
      </div>

      <div ref={verticalDotsRef} className="absolute flex flex-col items-center gap-0.5 opacity-0" style={{ transform: "scale(0.5)" }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={`v-${i}`} className="size-[3px] rounded-full" style={{ backgroundColor: color }} />
        ))}
      </div>

      <div ref={horizontalDotsRef} className="absolute flex items-center gap-0.5 opacity-0" style={{ transform: "scale(0.5)" }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={`h-${i}`} className="size-[3px] rounded-full" style={{ backgroundColor: color }} />
        ))}
      </div>
    </div>
  );
}
