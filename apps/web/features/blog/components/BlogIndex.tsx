"use client";
import BlogCard from "@features/blog/components/BlogCard";
import FeaturedPost from "@features/blog/components/FeaturedPost";
import type { BlogPost } from "@features/blog/lib/blog.types";
import { blogContent } from "@features/blog/lib/blogContent";
import { splitFeatured } from "@features/blog/lib/blogUtils";
import { cn } from "@shared/lib/utils";
import { useState } from "react";

/** The featured article, category filters and the article grid. */
export default function BlogIndex({ posts }: { posts: BlogPost[] }) {
  const [activeCategory, setActiveCategory] = useState<string>(blogContent.allLabel);
  const { featured, rest } = splitFeatured(posts);
  const categories = [blogContent.allLabel, ...new Set(posts.map((post) => post.category))];
  const isAll = activeCategory === blogContent.allLabel;
  // "All" shows the featured article on its own above the grid. A category shows every matching article in the grid, featured or not.
  const visible = isAll ? rest : posts.filter((post) => post.category === activeCategory);
  const countLabel = `${visible.length} ${visible.length === 1 ? blogContent.articleSingular : blogContent.articlePlural}`;

  return (
    <>
      {featured && isAll && <FeaturedPost post={featured} />}

      {posts.length > 1 && (
        <div className={cn("flex flex-wrap items-center justify-between gap-4", featured && isAll ? "mt-14 sm:mt-20" : "mt-2")}>
          <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-1.5">
            {categories.map((category) => {
              const active = category === activeCategory;
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveCategory(category)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                    active ? "bg-primary text-white" : "bg-black/5 text-[#12141F]/70 hover:bg-black/8 hover:text-[#12141F]"
                  )}
                >
                  {category}
                </button>
              );
            })}
          </div>
          <span className="font-mono text-[11px] tracking-[0.12em] text-black/50 uppercase">{countLabel}</span>
        </div>
      )}

      {visible.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      ) : (
        posts.length > 1 && (
          <p className="mt-8 rounded-[22px] border border-dashed border-black/15 px-6 py-16 text-center text-[15px] text-black/55">
            {blogContent.emptyCategory}
          </p>
        )
      )}
    </>
  );
}
