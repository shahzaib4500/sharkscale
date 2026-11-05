// Run with: node --experimental-strip-types --test features/blog/lib/blog.test.mjs
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  cleanCategoryName,
  countWords,
  formatPostDate,
  getCoverSeed,
  getHeadings,
  getReadTimeMinutes,
  mapPostRow,
  matchesSearch,
  mergeCategories,
  nodeText,
  normalizeLink,
  pickRelatedPosts,
  safeHref,
  seededValue,
  slugify,
  splitFeatured
} from "./blogUtils.ts";
import { validateCategoryName, validateDraft, validateLogin, validatePublish } from "./blogValidation.ts";

const words = (count) => Array(count).fill("word").join(" ");
const paragraph = (text) => ({ type: "paragraph", content: [{ type: "text", text }] });
const publishable = { title: "A post", slug: "a-post", excerpt: "Summary", category: "Email", authorName: "Sam" };

test("nodeText joins nested text and skips images", () => {
  const list = {
    type: "bulletList",
    content: [
      { type: "listItem", content: [paragraph("one two")] },
      { type: "listItem", content: [paragraph("three")] }
    ]
  };
  assert.equal(nodeText(list).trim().split(/\s+/).length, 3);
  assert.equal(nodeText({ type: "image", attrs: { src: "x" } }), "");
});

test("countWords counts text across nested nodes and inline formatting once", () => {
  const body = [
    paragraph("one two three"),
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "four five" }] },
    { type: "blockquote", content: [paragraph("six")] },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "seven " },
        { type: "text", text: "eight", marks: [{ type: "bold" }] }
      ]
    }
  ];
  assert.equal(countWords(body), 8);
  assert.equal(countWords(undefined), 0);
  assert.equal(countWords([{ type: "paragraph" }]), 0);
});

test("getReadTimeMinutes rounds up at 200 words a minute with a one-minute minimum", () => {
  assert.equal(getReadTimeMinutes([paragraph(words(200))]), 1);
  assert.equal(getReadTimeMinutes([paragraph(words(201))]), 2);
  assert.equal(getReadTimeMinutes([]), 1);
});

test("cover seeds are stable, differ by slug and stay in range", () => {
  assert.equal(getCoverSeed("first"), getCoverSeed("first"));
  assert.notEqual(getCoverSeed("first"), getCoverSeed("second"));
  for (let index = 0; index < 100; index += 1) {
    const value = seededValue(getCoverSeed("a-long-slug"), index);
    assert.ok(value >= 0 && value < 1);
  }
});

test("formatPostDate handles valid, empty and invalid dates", () => {
  assert.equal(formatPostDate("2026-01-05T12:00:00Z"), "Jan 5, 2026");
  assert.equal(formatPostDate(null), "");
  assert.equal(formatPostDate("nope"), "");
});

test("mapPostRow maps rows and tolerates missing values", () => {
  const post = mapPostRow({
    id: "1",
    slug: "a",
    title: "A",
    excerpt: null,
    category: "Email",
    author_name: "Sam",
    cover_image_url: null,
    body: null,
    featured: true,
    status: "published",
    published_at: "2026-10-28T12:00:00Z"
  });
  assert.equal(post.author, "Sam");
  assert.equal(post.date, "Oct 28, 2026");
  assert.deepEqual(post.body, []);
  assert.equal(post.excerpt, "");
});

test("slugify makes URL-safe slugs", () => {
  assert.equal(slugify("Hello, World!"), "hello-world");
  assert.equal(slugify("  Café & Crème  "), "cafe-creme");
  assert.equal(slugify("Why Email's Not Dead"), "why-emails-not-dead");
  assert.equal(slugify("!!!"), "");
});

test("links: only safe protocols, and bare domains get https", () => {
  assert.equal(safeHref("https://sharkscale.co"), "https://sharkscale.co");
  assert.equal(safeHref("javascript:alert(1)"), null);
  assert.equal(safeHref(" JaVaScRiPt:alert(1)"), null);
  assert.equal(safeHref("/relative"), null);
  assert.equal(normalizeLink("sharkscale.co/blog"), "https://sharkscale.co/blog");
  assert.equal(normalizeLink("mailto:hi@sharkscale.co"), "mailto:hi@sharkscale.co");
  for (const value of ["javascript:alert(1)", "data:text/html,x", "not a link", "", undefined]) {
    assert.equal(normalizeLink(value), null, String(value));
  }
});

test("categories are cleaned and de-duplicated ignoring case", () => {
  assert.equal(cleanCategoryName("  Case   Studies "), "Case Studies");
  assert.deepEqual(mergeCategories(["Email", "Retention"], ["email", "Case Studies", " ", null, "RETENTION"]), ["Email", "Retention", "Case Studies"]);
});

test("getHeadings lists H1 to H3 with stable ids and leaves out H4 and empty headings", () => {
  const body = [
    paragraph("Intro"),
    { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "First" }] },
    { type: "heading", attrs: { level: 4 }, content: [{ type: "text", text: "Small" }] },
    { type: "heading", attrs: { level: 3 } }
  ];
  assert.deepEqual(getHeadings(body), [{ id: "section-1", text: "First", index: 1 }]);
});

test("splitFeatured returns no featured post when none is marked", () => {
  const posts = [
    { slug: "a", featured: false },
    { slug: "b", featured: true }
  ];
  assert.equal(splitFeatured(posts).featured.slug, "b");
  assert.deepEqual(
    splitFeatured(posts).rest.map((post) => post.slug),
    ["a"]
  );
  assert.equal(splitFeatured([{ slug: "a", featured: false }]).featured, null);
});

test("pickRelatedPosts prefers the same category and excludes the current post", () => {
  const posts = [
    { slug: "a", category: "X" },
    { slug: "b", category: "Y" },
    { slug: "c", category: "X" },
    { slug: "d", category: "Y" }
  ];
  assert.deepEqual(
    pickRelatedPosts(posts, posts[0], 2).map((post) => post.slug),
    ["c", "b"]
  );
});

test("matchesSearch finds words in any order, ignoring case and accents", () => {
  const post = { title: "The Welcome Flow That Converts", category: "Email Marketing" };
  assert.equal(matchesSearch(post, ""), true);
  assert.equal(matchesSearch(post, "   "), true);
  assert.equal(matchesSearch(post, "welcome"), true);
  assert.equal(matchesSearch(post, "FLOW welcome"), true);
  assert.equal(matchesSearch(post, "email"), true);
  assert.equal(matchesSearch({ title: "Café ideas", category: "x" }, "cafe"), true);
  assert.equal(matchesSearch(post, "retention"), false);
  assert.equal(matchesSearch(post, "welcome retention"), false);
});

test("validateDraft needs a title and a URL-safe slug", () => {
  assert.deepEqual(validateDraft({ title: "A", slug: "a-b" }), {});
  assert.equal(validateDraft({ title: " ", slug: "a" }).title, "Add a title");
  assert.equal(validateDraft({ title: "A", slug: "" }).slug, "Add a URL slug");
  for (const slug of ["Bad Slug", "UPPER", "-lead", "trail-", "two--dash"]) {
    assert.ok(validateDraft({ title: "A", slug }).slug, slug);
  }
});

test("validatePublish also needs a summary, category, author and some text", () => {
  assert.deepEqual(validatePublish(publishable, 10), {});
  const errors = validatePublish({ ...publishable, excerpt: " ", category: "", authorName: "" }, 0);
  assert.deepEqual(Object.keys(errors).sort(), ["authorName", "body", "category", "excerpt"]);
});

test("validateCategoryName and validateLogin", () => {
  assert.equal(validateCategoryName("Email"), null);
  assert.ok(validateCategoryName("   "));
  assert.ok(validateCategoryName("x".repeat(41)));
  assert.deepEqual(validateLogin("a@b.co", "x"), {});
  assert.ok(validateLogin("nope", "x").email);
  assert.ok(validateLogin("a@b.co", "").password);
});
