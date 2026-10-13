"use client";
import { cn } from "@shared/lib/utils";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const PARALLAX_STRENGTH = 24;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    function handleMouseMove(event: MouseEvent) {
      const rect = section!.getBoundingClientRect();
      const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
      const relativeY = (event.clientY - rect.top) / rect.height - 0.5;
      setOffset({ x: relativeX * PARALLAX_STRENGTH, y: relativeY * PARALLAX_STRENGTH });
    }

    function handleMouseLeave() {
      setOffset({ x: 0, y: 0 });
    }

    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className={cn("relative flex min-h-screen w-full items-center justify-center overflow-hidden", "bg-tertiary text-tertiary-foreground")}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_-10%_40%,rgba(255,210,31,0.13)_0%,transparent_60%),radial-gradient(ellipse_120%_50%_at_50%_0%,rgba(18,0,58,0.95)_0%,transparent_100%)]" />
      <div className="relative mx-auto flex w-full max-w-7xl items-center justify-center px-6">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="pointer-events-none absolute top-1/2 right-0 w-[55%] max-w-2xl opacity-90 transition-transform duration-300 ease-out"
          style={{ transform: `translate3d(${offset.x}px, calc(-50% + ${offset.y}px), 0)` }}
        >
          <source src="/flyingPaperPlane.webm" type="video/webm" />
        </video>

        <div className="relative z-10 flex max-w-4xl flex-col items-center gap-6 text-center">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
            Turning emails into <span className="bg-linear-to-r from-amber-600 via-yellow-300 to-amber-200 bg-clip-text text-transparent">revenue</span>
          </h1>

          <p className="max-w-2xl text-base text-tertiary-foreground/80 sm:text-lg">
            We create high-converting Klaviyo campaigns that engage, retain, and scale your brand. From strategy to execution, SharkScale helps your emails make
            a measurable impact.
          </p>

          <a
            href="#contact"
            className={cn(
              "group inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold",
              "bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/90"
            )}
          >
            Get started
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
