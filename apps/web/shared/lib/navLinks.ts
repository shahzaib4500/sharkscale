export interface NavLink {
  label: string;
  sectionId: string;
}

export const navLinks: NavLink[] = [
  { label: "Home", sectionId: "home" },
  { label: "What We Do", sectionId: "what-we-do" },
  { label: "Reviews", sectionId: "reviews" }
];

export interface PageLink {
  label: string;
  href: string;
}

/** Links to separate pages, shown after the homepage section links. */
export const pageLinks: PageLink[] = [{ label: "Blog", href: "/blog" }];
