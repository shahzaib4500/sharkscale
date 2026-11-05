import BlogCover from "@features/blog/components/BlogCover";
import BlogMeta, { CategoryTag } from "@features/blog/components/BlogMeta";
import type { BlogPost } from "@features/blog/lib/blog.types";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-black/5 bg-white p-2 shadow-[0_12px_40px_-24px_rgba(15,23,42,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_-28px_rgba(47,91,255,0.45)]"
    >
      <BlogCover slug={post.slug} imageUrl={post.coverImageUrl} title={post.title} className="aspect-[16/10] rounded-[16px]" />
      <div className="flex flex-1 flex-col gap-3 px-3 pt-5 pb-3">
        <div>
          <CategoryTag>{post.category}</CategoryTag>
        </div>
        <h3 className="text-[21px] leading-[1.18] font-bold tracking-[-0.03em] text-[#12141F]">{post.title}</h3>
        <p className="line-clamp-3 text-[15px] leading-relaxed text-black/62">{post.excerpt}</p>
        <div className="mt-auto flex items-center justify-between gap-4 pt-3">
          <BlogMeta post={post} className="text-black/45" />
          <span className="flex size-10 flex-none items-center justify-center rounded-full bg-black/5 text-[#12141F] transition-all duration-300 group-hover:rotate-45 group-hover:bg-secondary group-hover:text-tertiary">
            <ArrowUpRight className="size-4" strokeWidth={2.25} aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}
