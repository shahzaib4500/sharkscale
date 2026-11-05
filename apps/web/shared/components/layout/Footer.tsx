"use client";
import logo from "@shared/assets/logo.webp";
import FooterCTA from "@shared/components/layout/footer/FooterCTA";
import FooterNewsletter from "@shared/components/layout/footer/FooterNewsletter";
import FooterWordmark from "@shared/components/layout/footer/FooterWordmark";
import { colors } from "@shared/constants/colors";
import { footerContent } from "@shared/lib/footerContent";
import { HOME_SECTION_ID, SECTION_LINK_HREF, handleSectionNavClick } from "@shared/lib/scrollToSection";
import { ArrowUp } from "lucide-react";
import Image from "next/image";

// Matches the blue accent used across the landing sections (Hero, Process, PartnerBand).
const ACCENT_BLUE = "#2F5BFF";
const DEEP_BLUE = "#0B1A57";

export default function Footer() {
  return (
    <footer
      className="relative isolate overflow-hidden"
      style={{ background: `linear-gradient(180deg, #ffffff 0%, #dce7fb 10%, ${ACCENT_BLUE} 32%, ${DEEP_BLUE} 78%, ${DEEP_BLUE} 100%)` }}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        style={{ background: `radial-gradient(700px 480px at 85% 30%, ${colors.secondary}22, transparent 60%)` }}
      />

      <div className="mx-auto max-w-345 px-6 pt-24 sm:px-8 sm:pt-32">
        <FooterCTA />

        <span className="relative mt-16 mb-11 block size-2 sm:mt-20" style={{ backgroundColor: colors.secondary }} />

        <div className="grid grid-cols-1 gap-11 sm:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1fr]">
          <FooterNewsletter />

          <div className="flex gap-11 sm:justify-self-center lg:justify-self-auto">
            <FooterLinkColumn title="Navigation" links={footerContent.navLinks} />
          </div>

          <div className="flex justify-between gap-11">
            <FooterLinkColumn title="Get in touch" links={footerContent.connectLinks} />

            <a
              href={SECTION_LINK_HREF}
              onClick={handleSectionNavClick(HOME_SECTION_ID)}
              className="flex flex-col items-end gap-4 text-white/70 transition-colors hover:text-white"
            >
              <span className="font-mono text-[11px] tracking-[0.16em] whitespace-nowrap uppercase">Back to top</span>
              <span className="flex size-11 items-center justify-center border border-white/28 bg-white/8">
                <ArrowUp className="size-4" />
              </span>
            </a>
          </div>
        </div>

        <div className="mt-20 flex flex-wrap items-end justify-between gap-6 border-t border-white/12 pt-8">
          <div className="flex items-center gap-2.5">
            <span className="relative flex size-7 flex-none items-center justify-center rounded-lg bg-white">
              <Image src={logo} alt="SharkScale" className="size-4.5 object-contain" />
            </span>
            <span className="font-mono text-[11px] leading-relaxed tracking-[0.14em] text-white/60 uppercase">
              SharkScale
              <br />
              {footerContent.tagline}
            </span>
          </div>

          {footerContent.legalLinks.length > 0 && (
            <div className="flex gap-6 font-mono text-[11px] tracking-[0.12em] uppercase">
              {footerContent.legalLinks.map((link) => (
                <a key={link.label} href={link.href} className="border-b border-white/35 pb-0.5 text-white/70 transition-colors hover:text-white">
                  {link.label}
                </a>
              ))}
            </div>
          )}

          <div className="font-mono text-[11px] tracking-[0.12em] text-white/55 uppercase">{footerContent.copyright}</div>
        </div>

        <FooterWordmark />
      </div>
    </footer>
  );
}

function FooterLinkColumn({ title, links }: { title: string; links: readonly ({ label: string; sectionId: string } | { label: string; href: string })[] }) {
  return (
    <div>
      <div className="mb-5 font-mono text-[11px] tracking-[0.16em] text-white/50 uppercase">{title}</div>
      <div className="flex flex-col gap-2.5 text-lg font-medium">
        {links.map((link) => {
          if ("sectionId" in link) {
            return (
              <a
                key={link.label}
                href={SECTION_LINK_HREF}
                onClick={handleSectionNavClick(link.sectionId)}
                className="text-white transition-colors hover:text-white/75"
              >
                {link.label}
              </a>
            );
          }

          const isExternal = /^https?:\/\//.test(link.href);
          return (
            <a
              key={link.label}
              href={link.href}
              className="text-white transition-colors hover:text-white/75"
              {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {link.label}
            </a>
          );
        })}
      </div>
    </div>
  );
}
