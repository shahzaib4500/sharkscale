import type { BlogPost } from "@features/blog/lib/blog.types";
import { blogContent } from "@features/blog/lib/blogContent";
import { getReadTimeMinutes } from "@features/blog/lib/blogUtils";
import { cn } from "@shared/lib/utils";

interface BlogMetaProps {
  post: Pick<BlogPost, "author" | "date" | "body">;
  showAuthor?: boolean;
  className?: string;
}

export default function BlogMeta({ post, showAuthor = false, className }: BlogMetaProps) {
  const readTime = `${getReadTimeMinutes(post.body)} ${blogContent.readTimeUnit}`;
  const items = [showAuthor ? post.author : null, post.date, readTime].filter(Boolean) as string[];

  return (
    <div className={cn("flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] font-medium", className)}>
      {items.map((item, index) => (
        <span key={item} className="flex items-center gap-2.5">
          {index > 0 && <span aria-hidden className="size-1 rounded-full bg-current opacity-40" />}
          {item}
        </span>
      ))}
    </div>
  );
}

export function CategoryTag({ children, tone = "light" }: { children: string; tone?: "light" | "dark" | "solid" }) {
  const toneClass = {
    light: "bg-black/6 text-[#12141F]/75",
    dark: "bg-white/12 text-white/85",
    solid: "bg-secondary text-tertiary"
  }[tone];
  return <span className={cn("inline-flex px-2 py-1 font-mono text-[11px] tracking-[0.12em] uppercase", toneClass)}>{children}</span>;
}
