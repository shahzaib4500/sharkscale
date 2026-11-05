import type { BlogNode, BlogPost, BlogPostRow, BlogHeading } from "./blog.types";

const WORDS_PER_MINUTE = 200;
const SAFE_LINK = /^(https?:\/\/|mailto:)/i;
const BARE_DOMAIN = /^[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}([/?#]\S*)?$/i;

/** Gets a node's plain text. Block children are spaced so their words stay separate. */
export function nodeText(node: BlogNode | null | undefined): string {
  if (!node) {
    return "";
  }
  if (node.type === "text") {
    return node.text ?? "";
  }
  if (node.type === "hardBreak") {
    return " ";
  }
  const children = node.content ?? [];
  const separator = children.some((child) => child.type === "text") ? "" : " ";
  return children.map(nodeText).join(separator);
}

/** Counts the words across a post's body. */
export function countWords(body: BlogNode[] | null | undefined): number {
  return (body ?? []).map(nodeText).join(" ").trim().split(/\s+/).filter(Boolean).length;
}

/** Estimates reading time in whole minutes, rounding up, with a minimum of one. */
export function getReadTimeMinutes(body: BlogNode[] | null | undefined): number {
  return Math.max(1, Math.ceil(countWords(body) / WORDS_PER_MINUTE));
}

/** Turns a post slug into a stable number, so its generated cover never changes. */
export function getCoverSeed(slug = ""): number {
  return [...slug].reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) % 233280, 7);
}

/** Returns a repeatable value from 0 up to 1 for a seed and position. */
export function seededValue(seed: number, index: number): number {
  return (((seed + index * 7919) * 9301 + 49297) % 233280) / 233280;
}

/** Formats a stored date for display, or returns an empty string if there isn't a valid one. */
export function formatPostDate(value: string | null | undefined): string {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(date);
}

/** Maps a database row to the shape the blog pages use. */
export function mapPostRow(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    category: row.category,
    author: row.author_name,
    coverImageUrl: row.cover_image_url ?? null,
    body: row.body ?? [],
    featured: Boolean(row.featured),
    status: row.status,
    publishedAt: row.published_at ?? null,
    date: formatPostDate(row.published_at)
  };
}

/** Builds a URL-safe slug from a title. */
export function slugify(value = ""): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Returns a link only if it is http, https or mailto, which blocks script links in post content. */
export function safeHref(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const href = value.trim();
  return SAFE_LINK.test(href) ? href : null;
}

/** Cleans up a link typed into the editor. Bare domains get https://, and anything unsafe returns null. */
export function normalizeLink(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const link = value.trim();
  if (/^[a-z][a-z0-9+.-]*:/i.test(link)) {
    return safeHref(link);
  }
  return BARE_DOMAIN.test(link) ? `https://${link}` : null;
}

/** Trims a category name and collapses repeated spaces. */
export function cleanCategoryName(value = ""): string {
  return value.trim().replace(/\s+/g, " ");
}

/** Combines category lists in order, treating names that differ only by case as the same category. */
export function mergeCategories(...lists: Array<Array<string | null | undefined>>): string[] {
  const seen = new Map<string, string>();
  lists.flat().forEach((value) => {
    const name = cleanCategoryName(value ?? "");
    if (name && !seen.has(name.toLowerCase())) {
      seen.set(name.toLowerCase(), name);
    }
  });
  return [...seen.values()];
}

/** Lists a post's non-empty H1 to H3 headings with ids for the contents links. */
export function getHeadings(body: BlogNode[] | null | undefined): BlogHeading[] {
  return (body ?? []).flatMap((node, index) => {
    const text = node.type === "heading" && node.attrs?.level !== 4 ? nodeText(node).trim() : "";
    return text ? [{ id: `section-${index}`, text, index }] : [];
  });
}

/** Picks the featured post, or none, and lists the rest in their original order. */
export function splitFeatured<T extends { featured: boolean }>(posts: T[]): { featured: T | null; rest: T[] } {
  const featured = posts.find((post) => post.featured) ?? null;
  return { featured, rest: posts.filter((post) => post !== featured) };
}

/** Orders related posts: same category first, then the newest of the rest. */
export function pickRelatedPosts<T extends { slug: string; category: string }>(posts: T[], current: T, count = 3): T[] {
  const others = posts.filter((post) => post.slug !== current.slug);
  return [...others.filter((post) => post.category === current.category), ...others.filter((post) => post.category !== current.category)].slice(0, count);
}

const searchable = (value: string) => value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** True if every word in the query appears in the post's title or category, ignoring case and accents. */
export function matchesSearch(post: { title: string; category: string }, query: string): boolean {
  const haystack = searchable(`${post.title} ${post.category}`);
  return searchable(query)
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}
