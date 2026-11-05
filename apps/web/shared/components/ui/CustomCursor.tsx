"use client";
import { colors } from "@shared/constants/colors";
import { useEffect, useRef, useState } from "react";

function isTouch(): boolean {
  return typeof window !== "undefined" && (window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window || navigator.maxTouchPoints > 0);
}

export default function CustomCursor() {
  const [touchDevice, setTouchDevice] = useState(true);
  const [cursorText, setCursorText] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const followerPos = useRef({ x: -100, y: -100 });
  const targetPos = useRef({ x: -100, y: -100 });
  const magneticElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const isTouchDev = isTouch();
    setTouchDevice(isTouchDev);
    if (isTouchDev) {
      return;
    }

    document.documentElement.classList.add("custom-cursor-active");

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) {
        return;
      }

      // 1. Check if over form inputs or cursor-none elements
      const isInput = Boolean(target.closest("input, textarea, select, [contenteditable='true'], [data-cursor-none]"));
      if (isInput) {
        setIsVisible(false);
        return;
      }

      setIsVisible(true);

      // 2. Check for contextual tag text
      const textEl = target.closest<HTMLElement>("[data-cursor-text]");
      if (textEl) {
        const text = textEl.getAttribute("data-cursor-text");
        setCursorText(text);
      } else {
        setCursorText(null);
      }

      // 3. Check for magnetic element
      const magEl = target.closest<HTMLElement>("[data-cursor-magnetic]");
      magneticElement.current = magEl;

      // 4. Check for interactive clickables
      const isInteractive = Boolean(target.closest("a, button, [role='button'], input[type='submit'], [data-cursor-pointer]"));
      setIsHovered(isInteractive || Boolean(textEl) || Boolean(magEl));
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    // Smooth animation loop (rAF)
    let animationFrameId: number;

    const animate = () => {
      const mouse = mousePos.current;

      if (magneticElement.current) {
        const rect = magneticElement.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        // Blend towards the magnetic center with slight pull
        targetPos.current = {
          x: centerX + (mouse.x - centerX) * 0.28,
          y: centerY + (mouse.y - centerY) * 0.28
        };
      } else {
        targetPos.current = { ...mouse };
      }

      // Lerp follower position
      const ease = 0.16;
      followerPos.current.x += (targetPos.current.x - followerPos.current.x) * ease;
      followerPos.current.y += (targetPos.current.y - followerPos.current.y) * ease;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
      }

      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${followerPos.current.x}px, ${followerPos.current.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  if (touchDevice) {
    return null;
  }

  const isBadge = Boolean(cursorText);

  return (
    <div className="pointer-events-none fixed inset-0 z-99999 overflow-hidden">
      {/* Precision Center Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 will-change-transform pointer-events-none transition-opacity duration-200"
        style={{
          opacity: isVisible && !isBadge ? (isHovered ? 0.4 : 1) : 0
        }}
      >
        <div
          className="rounded-full transition-all duration-200"
          style={{
            width: isHovered ? 4 : 6,
            height: isHovered ? 4 : 6,
            backgroundColor: colors.secondary,
            boxShadow: "0 0 10px rgba(255, 210, 31, 0.8)"
          }}
        />
      </div>

      {/* Fluid Follower / Contextual Badge */}
      <div
        ref={followerRef}
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 will-change-transform pointer-events-none transition-opacity duration-200"
        style={{
          opacity: isVisible ? 1 : 0
        }}
      >
        <div
          className="flex items-center justify-center transition-all duration-300 ease-out"
          style={{
            transform: isClicking ? "scale(0.88)" : isBadge ? "scale(1)" : isHovered ? "scale(1.25)" : "scale(1)",
            transformOrigin: "center center"
          }}
        >
          {isBadge ? (
            /* Contextual Pill Badge */
            <div
              className="flex items-center rounded-full px-3.5 py-1.5 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-200"
              style={{
                backgroundColor: colors.secondary,
                color: colors.primary,
                border: "1px solid rgba(255, 210, 31, 0.4)",
                boxShadow: "0 8px 28px rgba(255, 210, 31, 0.35)"
              }}
            >
              <span className="text-[11px] font-extrabold uppercase tracking-widest whitespace-nowrap">{cursorText}</span>
            </div>
          ) : (
            /* Sleek Follower Ring */
            <div
              className="rounded-full transition-all duration-300"
              style={{
                width: isHovered ? 44 : 28,
                height: isHovered ? 44 : 28,
                borderWidth: isHovered ? "2px" : "1.5px",
                borderStyle: "solid",
                borderColor: isHovered ? colors.secondary : "rgba(255, 210, 31, 0.4)",
                backgroundColor: isHovered ? "rgba(255, 210, 31, 0.15)" : "transparent",
                boxShadow: isHovered ? "0 0 20px rgba(255, 210, 31, 0.3)" : "none"
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
