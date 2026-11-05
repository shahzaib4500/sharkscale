import { getPublishedPosts } from "@features/blog/api/blogQueries";
import BlogEmptyState from "@features/blog/components/BlogEmptyState";
import BlogIndex from "@features/blog/components/BlogIndex";
import { SITE_URL } from "@features/blog/lib/blogConfig";
import { blogContent } from "@features/blog/lib/blogContent";
import FooterLazy from "@shared/components/layout/FooterLazy";
import Navbar from "@shared/components/layout/Navbar";
import type { Metadata } from "next";

// Pages refresh at least every minute, and right away after an admin saves (see /api/blog/revalidate).
export const revalidate = 60;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: blogContent.metaTitle,
  description: blogContent.metaDescription,
  alternates: { canonical: "/blog" },
  openGraph: { type: "website", url: "/blog", title: blogContent.metaTitle, description: blogContent.metaDescription, siteName: "SharkScale" },
  twitter: { card: "summary_large_image", title: blogContent.metaTitle, description: blogContent.metaDescription }
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <main className="relative">
      <Navbar />
      <section data-nav-theme="light" className="relative overflow-hidden bg-white px-6 pt-40 pb-16 text-[#12141F] sm:px-10 sm:pt-48 sm:pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_90%_-10%,rgba(255,210,31,0.26)_0%,transparent_60%),radial-gradient(ellipse_60%_50%_at_0%_10%,rgba(47,91,255,0.16)_0%,transparent_60%)]"
        />
        <div className="relative mx-auto grid w-full max-w-7xl items-end gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <span className="inline-flex bg-black/6 px-2 py-1 font-mono text-[11px] tracking-[0.12em] text-black/70 uppercase">{blogContent.eyebrow}</span>
            <h1 className="mt-6 text-[clamp(56px,10vw,132px)] leading-[0.84] font-extrabold tracking-[-0.06em]">
              {blogContent.headingLead}{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span aria-hidden className="hero-highlight absolute inset-x-0 bottom-[0.08em] -z-0 h-[0.32em] bg-secondary" />
                <span className="relative">{blogContent.headingAccent}</span>
              </span>
            </h1>
          </div>
          <p className="max-w-md pb-2 text-[clamp(17px,1.6vw,19px)] leading-relaxed text-black/62">{blogContent.subheading}</p>
        </div>
      </section>

      <section data-nav-theme="light" className="flow-root bg-white px-6 pb-24 sm:px-10 sm:pb-32">
        <div className="mx-auto w-full max-w-7xl">{posts.length > 0 ? <BlogIndex posts={posts} /> : <BlogEmptyState />}</div>
      </section>

      <FooterLazy />
    </main>
  );
}
