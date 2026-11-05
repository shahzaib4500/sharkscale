import type { MouseEvent } from "react";

export const BOOK_SECTION_ID = "book-a-call";
export const HOME_SECTION_ID = "home";
export const REVENUE_PROOF_SECTION_ID = "revenueProof";
export const PROCESS_SECTION_ID = "process";

/** Path-only URL (no hash) for in-page section links. */
export const SECTION_LINK_HREF = "/";

export function scrollToSection(sectionId: string): boolean {
  const el = document.getElementById(sectionId);
  if (!el) {
    return false;
  }
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

export function clearSectionHashFromUrl(): void {
  if (!window.location.hash) {
    return;
  }
  const url = `${window.location.pathname}${window.location.search}`;
  window.history.replaceState(null, "", url);
}

/** Scroll to a section id; retries while lazy chunks mount. Does not add a URL hash. */
export function navigateToSection(sectionId: string): void {
  // Sections live on the homepage, so from any other page go there first and let it scroll on load.
  if (window.location.pathname !== SECTION_LINK_HREF) {
    window.location.assign(`${SECTION_LINK_HREF}#${sectionId}`);
    return;
  }

  const finish = () => {
    clearSectionHashFromUrl();
  };

  if (scrollToSection(sectionId)) {
    finish();
    return;
  }

  let attempts = 0;
  const maxAttempts = 180;

  const tick = () => {
    if (scrollToSection(sectionId)) {
      finish();
      return;
    }
    attempts += 1;
    if (attempts < maxAttempts) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
}

export function handleSectionNavClick(sectionId: string) {
  return (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigateToSection(sectionId);
  };
}
