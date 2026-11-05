import { navLinks, pageLinks } from "@shared/lib/navLinks";
import { BOOK_SECTION_ID } from "@shared/lib/scrollToSection";

export const footerContent = {
  navLinks: [...navLinks, ...pageLinks],
  connectLinks: [{ label: "Contact Us", sectionId: BOOK_SECTION_ID }],
  legalLinks: [] as { label: string; href: string }[],
  tagline: "Email & retention marketing, built to scale",
  copyright: `© ${new Date().getFullYear()} SharkScale. All rights reserved.`
};
