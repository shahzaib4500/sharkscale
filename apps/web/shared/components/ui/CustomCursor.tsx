"use client";
import { colors } from "@shared/constants/colors";
import { useEffect, useRef, useState } from "react";

type Direction = "left" | "right" | "center";

const SHINE_COLOR = colors.secondary;

function lighten(hex: string, percent: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const channel = (value: number) => Math.min(255, Math.floor(value + ((255 - value) * percent) / 100));
  return `rgb(${channel(r)}, ${channel(g)}, ${channel(b)})`;
}

function getBoxShadow(direction: Direction): string {
  const l20 = lighten(SHINE_COLOR, 20);
  const l10 = lighten(SHINE_COLOR, 10);
  const l5 = lighten(SHINE_COLOR, 5);
  const c = SHINE_COLOR;

  const shadows: Record<Direction, string> = {
    left: `0 0 1vh .5vh ${l20}, -1vh 0 2vh 1vh ${l20}, -4vh 0 5vh 1vh ${l10}, -10vh 0 10vh 1vh ${l5}, -15vh 0 20vh 1vh ${c}, -25vh 0 25vh 0 ${c}, -50vh 0 50vh 0 ${c}`,
    right: `0 0 1vh .5vh ${l20}, 1vh 0 2vh 1vh ${l20}, 4vh 0 5vh 1vh ${l10}, 10vh 0 10vh 1vh ${l5}, 15vh 0 20vh 1vh ${c}, 25vh 0 25vh 0 ${c}, 50vh 0 50vh 0 ${c}`,
    center: `0 0 1vh .5vh ${l20}, 0 0 2vh 1vh ${l20}, 0 0 5vh 1vh ${l10}, 0 0 10vh 1vh ${l5}, 0 0 20vh 1vh ${c}, 0 0 25vh 1vh ${c}, 0 0 50vh 1vh ${c}`
  };

  return shadows[direction];
}

function isTouch(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
}

export default function CustomCursor() {
  const lampRef = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState<Direction>("center");
  const [ready, setReady] = useState(false);
  const lastXRef = useRef(0);
  const directionRef = useRef<Direction>("center");
  const [touchDevice, setTouchDevice] = useState(false);

  useEffect(() => {
    setTouchDevice(isTouch());
  }, []);

  useEffect(() => {
    if (touchDevice) {
      return;
    }

    document.documentElement.classList.add("custom-cursor-active");
    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [touchDevice]);

  useEffect(() => {
    if (touchDevice) {
      return;
    }

    const lamp = lampRef.current;
    if (!lamp) {
      return;
    }

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    lamp.style.transform = `translate(${cx}px, ${cy}px)`;

    const t1 = setTimeout(() => {
      lamp.style.transform = `translate(${cx * 1.8 - lamp.offsetWidth / 2}px, ${cy * 1.5 - lamp.offsetHeight / 2}px)`;
    }, 100);
    const t2 = setTimeout(() => {
      lamp.style.transform = `translate(${cx * 0.5 - lamp.offsetWidth / 2}px, ${cy * 0.3 - lamp.offsetHeight / 2}px)`;
    }, 2000);
    const t3 = setTimeout(() => setReady(true), 2000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [touchDevice]);

  useEffect(() => {
    if (touchDevice) {
      return;
    }

    const lamp = lampRef.current;
    if (!lamp) {
      return;
    }

    const halfW = lamp.offsetWidth / 2;
    const halfH = lamp.offsetHeight / 2;

    let rafId: number | null = null;
    let pendingEvent: MouseEvent | null = null;

    const onMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      lamp.style.opacity = target?.closest("[data-cursor-none]") ? "0" : "1";
    };

    const process = () => {
      rafId = null;
      const event = pendingEvent;
      if (!event) {
        return;
      }

      const x = event.clientX;
      const lastX = lastXRef.current;

      if (ready) {
        const newDirection: Direction = x > lastX + 1 ? "right" : x < lastX - 1 ? "left" : "center";
        if (newDirection !== directionRef.current) {
          directionRef.current = newDirection;
          setDirection(newDirection);
        }
      }

      lamp.style.transform = `translate(${x - halfW}px, ${event.clientY - halfH}px)`;
      lastXRef.current = x;
    };

    const onMove = (event: MouseEvent) => {
      pendingEvent = event;
      if (rafId === null) {
        rafId = requestAnimationFrame(process);
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onMouseOver);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [ready, touchDevice]);

  if (touchDevice) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden">
      <div
        ref={lampRef}
        className="absolute transition-[box-shadow] duration-300"
        style={{
          width: "3vh",
          height: "3vh",
          top: 0,
          left: 0,
          backgroundColor: colors.white,
          borderRadius: "50%",
          boxShadow: getBoxShadow(direction),
          transitionDuration: "500ms",
          willChange: "transform"
        }}
      />
    </div>
  );
}
