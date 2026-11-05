"use client";
import { colors } from "@shared/constants/colors";
import { cn } from "@shared/lib/utils";
import gsap from "gsap";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

interface DotsToPlusIconProps {
  onClick?: () => void;
  className?: string;
  color?: string;
  /** Keep plus visible while the menu overlay is open. */
  menuOpen?: boolean;
}

export type DotsToPlusIconHandle = {
  animateToPlus: () => void;
  animateToDots: (options?: { force?: boolean }) => void;
};

const DotsToPlusIcon = forwardRef<DotsToPlusIconHandle, DotsToPlusIconProps>(function DotsToPlusIcon(
  { onClick, className, color = colors.white, menuOpen = false },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const verticalDotsRef = useRef<HTMLDivElement>(null);
  const horizontalDotsRef = useRef<HTMLDivElement>(null);
  const centerThreeDotsRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef(false);
  const wasMenuOpenRef = useRef(false);
  const menuOpenRef = useRef(menuOpen);
  menuOpenRef.current = menuOpen;

  const animationTargets = () =>
    [centerThreeDotsRef.current, verticalDotsRef.current, horizontalDotsRef.current].filter((el): el is HTMLDivElement => el !== null);

  const killAnimations = () => {
    gsap.killTweensOf(animationTargets());
  };

  const animateToPlus = () => {
    hoveredRef.current = true;
    killAnimations();

    const duration = 0.5;
    const ease = "power2.out";

    gsap.to(centerThreeDotsRef.current, { rotation: 90, duration: duration * 0.6, ease, overwrite: true });
    gsap.to(centerThreeDotsRef.current, {
      opacity: 0,
      scale: 0,
      duration: duration * 0.4,
      delay: duration * 0.3,
      ease,
      overwrite: true
    });
    gsap.to(verticalDotsRef.current, { opacity: 1, scale: 1, duration: duration * 0.6, delay: duration * 0.2, ease, overwrite: true });
    gsap.to(horizontalDotsRef.current, { opacity: 1, scale: 1, duration: duration * 0.6, delay: duration * 0.2, ease, overwrite: true });
  };

  const animateToDots = (options?: { force?: boolean }) => {
    if (!options?.force && menuOpenRef.current) {
      return;
    }
    hoveredRef.current = false;
    killAnimations();

    const duration = 0.5;
    const ease = "power2.out";

    gsap.to(verticalDotsRef.current, { opacity: 0, scale: 0.5, duration: duration * 0.4, ease, overwrite: true });
    gsap.to(horizontalDotsRef.current, { opacity: 0, scale: 0.5, duration: duration * 0.4, ease, overwrite: true });
    gsap.to(centerThreeDotsRef.current, {
      opacity: 1,
      scale: 1,
      rotation: 0,
      duration: duration * 0.6,
      delay: duration * 0.1,
      ease,
      overwrite: true,
      onComplete: () => {
        if (!hoveredRef.current && !menuOpenRef.current) {
          gsap.set(centerThreeDotsRef.current, { opacity: 1, scale: 1, rotation: 0 });
          gsap.set(verticalDotsRef.current, { opacity: 0, scale: 0.5 });
          gsap.set(horizontalDotsRef.current, { opacity: 0, scale: 0.5 });
        }
      }
    });
  };

  useEffect(() => {
    if (menuOpen) {
      wasMenuOpenRef.current = true;
      animateToPlus();
      return;
    }
    if (!wasMenuOpenRef.current) {
      return;
    }
    wasMenuOpenRef.current = false;
    animateToDots({ force: true });
  }, [menuOpen]);

  useImperativeHandle(ref, () => ({ animateToPlus, animateToDots }), []);

  const handleClick = () => {
    onClick?.();
  };

  return (
    <div ref={containerRef} className={cn("relative flex size-6 items-center justify-center", className)} onClick={handleClick}>
      <div ref={centerThreeDotsRef} className="absolute flex items-center gap-1">
        <span className="size-1 rounded-full" style={{ backgroundColor: color }} />
        <span className="size-1 rounded-full" style={{ backgroundColor: color }} />
        <span className="size-1 rounded-full" style={{ backgroundColor: color }} />
      </div>

      <div ref={verticalDotsRef} className="absolute flex flex-col items-center gap-0.5 opacity-0" style={{ transform: "scale(0.5)" }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={`v-${i}`} className="size-0.75 rounded-full" style={{ backgroundColor: color }} />
        ))}
      </div>

      <div ref={horizontalDotsRef} className="absolute flex items-center gap-0.5 opacity-0" style={{ transform: "scale(0.5)" }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={`h-${i}`} className="size-0.75 rounded-full" style={{ backgroundColor: color }} />
        ))}
      </div>
    </div>
  );
});

export default DotsToPlusIcon;
