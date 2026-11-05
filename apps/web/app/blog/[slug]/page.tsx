import { getPublishedPosts } from "@features/blog/api/blogQueries";
import BlogCard from "@features/blog/components/BlogCard";
import BlogCover from "@features/blog/components/BlogCover";
import BlogMeta, { CategoryTag } from "@features/blog/components/BlogMeta";
import PostContent from "@features/blog/components/PostContent";
import ReadingProgress from "@features/blog/components/ReadingProgress";
import { SITE_URL } from "@features/blog/lib/blogConfig";
import { blogContent } from "@features/blog/lib/blogContent";
import { getHeadings, pickRelatedPosts, safeHref } from "@features/blog/lib/blogUtils";
import FooterLazy from "@shared/components/layout/FooterLazy";
import Navbar from "@shared/components/layout/Navbar";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

// Pages refresh at least every minute, and right away after an admin saves (see /api/blog/revalidate).
export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

const loadPosts = cache(getPublishedPosts);

// No pages are built ahead of time; each article is rendered on its first visit and then cached like the blog page.
export function generateStaticParams() {
  return [];
}

async function loadPost(slug: string) {
  const posts = await loadPosts();
  return { post: posts.find((item) => item.slug === slug) ?? null, posts };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { post } = await loadPost(slug);
  if (!post) {
    return { title: "Article not found | SharkScale" };
  }
  const title = `${post.title} | SharkScale`;
  const image = safeHref(post.coverImageUrl);
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url: `/blog/${post.slug}`,
      title: post.title,
      description: post.excerpt,
      siteName: "SharkScale",
      publishedTime: post.publishedAt ?? undefined,
      authors: [post.author],
      section: post.category,
      images: image ? [{ url: image, alt: post.title }] : undefined
    },
    twitter: { card: image ? "summary_large_image" : "summary", title: post.title, description: post.excerpt, images: image ? [image] : undefined }
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const { post, posts } = await loadPost(slug);
  if (!post) {
    notFound();
  }

  const headings = getHeadings(post.body);
  const related = pickRelatedPosts(posts, post);
  const hasCoverImage = Boolean(safeHref(post.coverImageUrl));
  // Escaping "<" keeps any text in the post from closing the script tag early.
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: "SharkScale" },
    image: safeHref(post.coverImageUrl) ?? undefined,
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`
  }).replace(/</g, "\\u003c");

  return (
    <main className="relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      <ReadingProgress />
      <Navbar />

      <header
        className={`group relative overflow-hidden bg-tertiary px-6 pt-36 text-white sm:px-10 sm:pt-44 ${hasCoverImage ? "pb-40 sm:pb-56" : "pb-16 sm:pb-24"}`}
      >
        {!hasCoverImage && (
          <>
            <BlogCover slug={post.slug} className="absolute inset-0 opacity-80" />
            <div aria-hidden className="absolute inset-0 bg-linear-to-r from-tertiary via-tertiary/90 to-tertiary/20" />
          </>
        )}
        <div aria-hidden className="pointer-events-none absolute -top-40 -right-20 size-[34rem] rounded-full bg-[#2F5BFF]/25 blur-3xl" />
        <div className="relative mx-auto w-full max-w-[1100px]">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition-colors hover:text-white">
            <ArrowLeft className="size-4" aria-hidden />
            {blogContent.backLabel}
          </Link>
          <div className="mt-8">
            <CategoryTag tone="solid">{post.category}</CategoryTag>
          </div>
          <h1 className="mt-5 max-w-4xl text-[clamp(36px,5.2vw,68px)] leading-[0.98] font-extrabold tracking-[-0.055em] text-balance">{post.title}</h1>
          <p className="mt-6 max-w-2xl text-[clamp(17px,1.7vw,20px)] leading-relaxed text-white/72">{post.excerpt}</p>
          <BlogMeta post={post} showAuthor className="mt-6 text-white/55" />
        </div>
      </header>

      <article data-nav-theme="light" className="relative flow-root bg-white px-6 pb-24 sm:px-10 sm:pb-32">
        {hasCoverImage ? (
          <BlogCover
            slug={post.slug}
            imageUrl={post.coverImageUrl}
            title={post.title}
            priority
            sizes="(min-width: 1100px) 1100px, 100vw"
            className="relative mx-auto -mt-28 aspect-[16/9] w-full max-w-[1100px] rounded-[22px] shadow-[0_28px_80px_-24px_rgba(47,91,255,0.5)] sm:-mt-44 sm:aspect-[21/9]"
          />
        ) : null}

        <div className="mx-auto mt-14 grid w-full max-w-[1100px] gap-12 sm:mt-20 lg:grid-cols-[13rem_minmax(0,46rem)] lg:justify-center lg:gap-16">
          <aside className="hidden lg:block">
            {headings.length > 0 && (
              <nav aria-label={blogContent.contentsLabel} className="sticky top-32">
                <p className="font-mono text-[11px] tracking-[0.12em] text-black/50 uppercase">{blogContent.contentsLabel}</p>
                <ul className="mt-4 flex flex-col gap-3 border-l border-dashed border-black/15 pl-4">
                  {headings.map((heading) => (
                    <li key={heading.id}>
                      <a href={`#${heading.id}`} className="text-sm leading-snug text-black/60 transition-colors hover:text-[#12141F]">
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </aside>
          <PostContent body={post.body} />
        </div>
      </article>

      {related.length > 0 && (
        <section data-nav-theme="light" className="bg-[#f5f0e8] px-6 py-20 sm:px-10 sm:py-28">
          <div className="mx-auto w-full max-w-7xl">
            <span className="inline-flex bg-black/6 px-2 py-1 font-mono text-[11px] tracking-[0.12em] text-black/70 uppercase">
              {blogContent.relatedEyebrow}
            </span>
            <h2 className="mt-5 text-[clamp(40px,6vw,76px)] leading-[0.9] font-extrabold tracking-[-0.055em] text-[#12141F]">{blogContent.relatedHeading}</h2>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <BlogCard key={item.slug} post={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      <FooterLazy />
    </main>
  );
}
