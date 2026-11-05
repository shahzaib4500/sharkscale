"use client";
import { colors } from "@shared/constants/colors";
import { BOOK_SECTION_ID, SECTION_LINK_HREF, handleSectionNavClick } from "@shared/lib/scrollToSection";

export default function FooterCTA() {
  return (
    <div className="relative">
      <div className="max-w-[60ch]">
        <p className="text-[clamp(21px,2.5vw,34px)] leading-[1.28] tracking-[-0.03em]" style={{ color: colors.tertiary }}>
          Make more from every customer you acquire.
        </p>

        <div className="mt-11 flex flex-wrap gap-11 sm:gap-20">
          <div>
            <div className="text-[clamp(38px,4.4vw,58px)] leading-none font-extrabold tracking-[-0.04em]" style={{ color: colors.tertiary }}>
              36.58%
            </div>
            <div className="mt-2 text-sm" style={{ color: `${colors.tertiary}99` }}>
              of total revenue from email
            </div>
          </div>
          <div>
            <div className="text-[clamp(38px,4.4vw,58px)] leading-none font-extrabold tracking-[-0.04em]" style={{ color: colors.tertiary }}>
              72.94%
            </div>
            <div className="mt-2 text-sm" style={{ color: `${colors.tertiary}99` }}>
              of email revenue from flows
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[clamp(90px,13vw,180px)] text-center">
        <h2 className="text-[clamp(30px,4vw,56px)] leading-[1.1] font-bold tracking-[-0.035em] text-white">Your next 30% could already be in your list.</h2>
        <a
          href={SECTION_LINK_HREF}
          onClick={handleSectionNavClick(BOOK_SECTION_ID)}
          className="mt-8 inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-extrabold tracking-[0.06em] uppercase transition-transform hover:scale-105"
          style={{ backgroundColor: colors.secondary, color: colors.tertiary }}
        >
          Let&apos;s find it →
        </a>
      </div>
    </div>
  );
}
