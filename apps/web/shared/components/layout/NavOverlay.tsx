"use client";
import RollingText from "@shared/components/layout/RollingText";
import { colors } from "@shared/constants/colors";
import { navLinks } from "@shared/lib/navLinks";
import gsap from "gsap";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

interface NavOverlayProps {
  onClose: () => void;
}

export default function NavOverlay({ onClose }: NavOverlayProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = useCallback(() => {
    if (isExiting) {
      return;
    }
    setIsExiting(true);

    const card = cardRef.current;
    const backdrop = backdropRef.current;

    if (!card) {
      onClose();
      return;
    }

    gsap.killTweensOf([card, backdrop]);
    gsap
      .timeline({ defaults: { ease: "power3.in" }, onComplete: onClose })
      .to(card, { opacity: 0, scale: 0.92, y: -12, duration: 0.3 }, 0)
      .to(backdrop, { opacity: 0, duration: 0.3 }, 0);
  }, [isExiting, onClose]);

  useEffect(() => {
    const card = cardRef.current;
    const backdrop = backdropRef.current;

    if (card) {
      gsap.killTweensOf([card, backdrop]);
      gsap.set(card, { opacity: 0, scale: 0.92, y: -12, transformOrigin: "top right" });
      gsap.set(backdrop, { opacity: 0 });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(backdrop, { opacity: 1, duration: 0.3 }, 0)
        .to(card, { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: "back.out(1.4)" }, 0.05);
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleClose]);

  return (
    <>
      <div ref={backdropRef} className="fixed inset-0 z-[998]" style={{ opacity: 0 }} onClick={handleClose} />

      <div
        ref={cardRef}
        className="fixed right-4 top-24 z-[999] w-72 max-w-[calc(100vw-2rem)] rounded-2xl p-5 shadow-2xl"
        style={{ backgroundColor: colors.white }}
      >
        <p className="mb-3 text-xs font-medium uppercase tracking-widest" style={{ color: `${colors.tertiary}80` }}>
          Menu
        </p>

        <nav className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleClose}
              className="group inline-flex w-fit py-1 text-2xl font-semibold tracking-tight"
              style={{ color: colors.tertiary }}
            >
              <RollingText text={link.label} />
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
