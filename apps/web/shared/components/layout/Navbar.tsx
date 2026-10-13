"use client";
import logo from "@shared/assets/logo.webp";
import DotsToPlusIcon from "@shared/components/layout/DotsToPlusIcon";
import NavOverlay from "@shared/components/layout/NavOverlay";
import { colors } from "@shared/constants/colors";
import { navLinks } from "@shared/lib/navLinks";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const homeHref = navLinks.find((link) => link.label === "Home")?.href ?? "#";
  const contactHref = "#contactUs";

  const [showOverlay, setShowOverlay] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const scrollTop = window.scrollY;
      const scrollThreshold = 100;
      const progress = Math.min(scrollTop / scrollThreshold, 1);
      setScrollProgress(progress);

      const probeY = 16 + (maxHeight - (maxHeight - minHeight) * progress) / 2;
      const lightSections = document.querySelectorAll<HTMLElement>('[data-nav-theme="light"]');
      let overLight = false;
      lightSections.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= probeY && rect.bottom >= probeY) {
          overLight = true;
        }
      });
      setIsLight(overLight);

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const minHeight = 60;
  const maxHeight = 88;

  const currentHeight = maxHeight - (maxHeight - minHeight) * scrollProgress;
  const horizontalInset = 16 + scrollProgress * 8;
  const minLogoHeight = 36;
  const maxLogoHeight = 56;
  const logoHeight = maxLogoHeight - (maxLogoHeight - minLogoHeight) * scrollProgress;
  const gapScale = 1 - scrollProgress * 0.3;

  const accent = isLight ? colors.tertiary : colors.white;
  const linkClass = isLight
    ? "text-sm font-medium text-tertiary/70 transition-colors hover:text-tertiary whitespace-nowrap"
    : "text-sm font-medium text-white/80 transition-colors hover:text-white whitespace-nowrap";

  return (
    <>
      <header
        className="fixed top-4 z-50 rounded-2xl"
        style={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          backgroundColor: isLight ? `${colors.white}B3` : "rgba(10, 10, 20, 0.55)",
          boxShadow: isLight ? "0 8px 24px rgba(27, 10, 80, 0.08)" : "0 4px 24px rgba(0, 0, 0, 0.35)",
          border: isLight ? "none" : "1px solid rgba(255, 255, 255, 0.08)",
          transition: "background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
          left: `${horizontalInset}px`,
          right: `${horizontalInset}px`,
          width: `calc(100% - ${horizontalInset * 2}px)`,
          height: `${currentHeight}px`,
          overflow: "hidden",
          display: "flex",
          alignItems: "center"
        }}
      >
        <div className="grid w-full grid-cols-[auto_1fr_auto] items-center px-6 h-full" style={{ gap: `${24 * gapScale}px` }}>
          <Link href={homeHref} className="flex items-center shrink-0">
            <Image src={logo} alt="SharkScale" priority draggable={false} className="w-auto" style={{ height: `${logoHeight}px` }} />
          </Link>

          <ul className="hidden items-center justify-center lg:flex shrink-0" style={{ gap: `${32 * gapScale}px` }}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-end gap-3 shrink-0">
            <Link
              href={contactHref}
              className="hidden items-center gap-2.5 rounded-full py-1.5 pl-4 pr-1.5 text-sm font-semibold transition-colors hover:bg-primary hover:text-white lg:inline-flex"
              style={{ backgroundColor: `${accent}1A`, color: accent }}
            >
              <span style={{ display: scrollProgress > 0.7 ? "none" : "inline" }}>Book a Call</span>
              <span className="flex size-7 items-center justify-center rounded-full shrink-0" style={{ backgroundColor: `${accent}1F`, color: accent }}>
                <ArrowRight className="size-3.5" />
              </span>
            </Link>

            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setShowOverlay(true)}
              className="flex size-10 items-center justify-center rounded-full transition-colors hover:bg-primary shrink-0"
              style={{ backgroundColor: `${accent}1A` }}
            >
              <DotsToPlusIcon color={accent} />
            </button>
          </div>
        </div>
      </header>

      {showOverlay && <NavOverlay onClose={() => setShowOverlay(false)} />}
    </>
  );
}
