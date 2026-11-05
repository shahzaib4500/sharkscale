import BlogCover from "@features/blog/components/BlogCover";
import { CategoryTag } from "@features/blog/components/BlogMeta";
import { blogContent } from "@features/blog/lib/blogContent";
import { BOOK_SECTION_ID } from "@shared/lib/scrollToSection";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function BlogEmptyState() {
  const { empty } = blogContent;
  return (
    <div className="group relative overflow-hidden rounded-[22px] bg-tertiary text-white shadow-[0_28px_80px_-24px_rgba(47,91,255,0.5)]">
      <BlogCover slug="sharkscale-journal" className="absolute inset-0" />
      <div className="absolute inset-0 bg-linear-to-r from-tertiary via-tertiary/85 to-tertiary/10" />
      <div className="relative flex max-w-xl flex-col items-start gap-5 p-8 sm:p-12 lg:min-h-[24rem] lg:justify-center">
        <CategoryTag tone="solid">{empty.label}</CategoryTag>
        <h2 className="text-[clamp(30px,4vw,52px)] leading-[0.98] font-extrabold tracking-[-0.05em]">{empty.title}</h2>
        <p className="text-[16px] leading-relaxed text-white/72">{empty.message}</p>
        <Link
          href={`/#${BOOK_SECTION_ID}`}
          className="mt-2 inline-flex items-center gap-3 rounded-full bg-secondary py-1.5 pr-1.5 pl-5 text-sm font-semibold text-tertiary transition-transform hover:-translate-y-0.5"
        >
          {empty.action}
          <span className="flex size-8 items-center justify-center rounded-full bg-tertiary text-secondary">
            <ArrowRight className="size-4" strokeWidth={2.25} aria-hidden />
          </span>
        </Link>
      </div>
    </div>
  );
}
