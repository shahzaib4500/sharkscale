import BlogCover from "@features/blog/components/BlogCover";
import BlogMeta, { CategoryTag } from "@features/blog/components/BlogMeta";
import type { BlogPost } from "@features/blog/lib/blog.types";
import { blogContent } from "@features/blog/lib/blogContent";
import { cn } from "@shared/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface FeaturedPostProps {
  post: BlogPost;
  linked?: boolean;
  /** A smaller version for narrow spaces like the admin preview. */
  compact?: boolean;
}

export default function FeaturedPost({ post, linked = true, compact = false }: FeaturedPostProps) {
  const card = (
    <article
      className={cn(
        "group grid overflow-hidden rounded-[22px] border border-black/5 bg-white",
        compact
          ? "shadow-[0_18px_50px_-28px_rgba(47,91,255,0.45)] sm:grid-cols-[1fr_1.1fr]"
          : "shadow-[0_28px_80px_-24px_rgba(47,91,255,0.5),0_12px_40px_-20px_rgba(15,23,42,0.16)] md:grid-cols-[1.15fr_1fr]"
      )}
    >
      <BlogCover
        slug={post.slug}
        imageUrl={post.coverImageUrl}
        title={post.title}
        priority={!compact}
        sizes={compact ? "(min-width: 640px) 360px, 100vw" : "(min-width: 768px) 55vw, 100vw"}
        className={compact ? "aspect-[16/10] sm:aspect-auto sm:min-h-[15rem]" : "aspect-[16/10] md:aspect-auto md:min-h-[26rem]"}
      />
      <div className={cn("flex flex-col justify-center", compact ? "gap-3 p-6" : "gap-5 p-7 sm:p-10 lg:p-12")}>
        <div className="flex flex-wrap items-center gap-2">
          <CategoryTag tone="solid">{blogContent.featuredLabel}</CategoryTag>
          <CategoryTag>{post.category}</CategoryTag>
        </div>
        <h2
          className={cn(
            "font-extrabold text-[#12141F]",
            compact ? "line-clamp-3 text-[24px] leading-[1.08] tracking-[-0.035em]" : "text-[clamp(28px,3.4vw,44px)] leading-[1.02] tracking-[-0.045em]"
          )}
        >
          {post.title}
        </h2>
        <p className={cn("leading-relaxed text-black/62", compact ? "line-clamp-2 text-[14px]" : "text-[16px]")}>{post.excerpt}</p>
        <BlogMeta post={post} showAuthor className="text-black/45" />
        {!compact && (
          <span className="mt-2 inline-flex items-center gap-3 text-sm font-semibold text-[#12141F]">
            {blogContent.readArticle}
            <span className="flex size-10 items-center justify-center rounded-full bg-primary text-white transition-transform duration-300 group-hover:translate-x-1.5">
              <ArrowRight className="size-4" strokeWidth={2.25} aria-hidden />
            </span>
          </span>
        )}
      </div>
    </article>
  );

  if (!linked) {
    return card;
  }
  return (
    <Link href={`/blog/${post.slug}`} className="block">
      {card}
    </Link>
  );
}
