import type { BlogPost, BlogPostRow } from "@features/blog/lib/blog.types";
import { BLOG_TABLES } from "@features/blog/lib/blogConfig";
import { mapPostRow } from "@features/blog/lib/blogUtils";
import { createServerSupabase } from "@shared/lib/supabase";

/** Published posts for the public blog, newest first. Returns an empty list if Supabase isn't configured. */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  const supabase = createServerSupabase();
  if (!supabase) {
    return [];
  }
  const { data, error } = await supabase
    .from(BLOG_TABLES.posts)
    .select("*")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });
  if (error) {
    throw new Error(`Couldn't load blog posts: ${error.message}`);
  }
  return (data as BlogPostRow[]).map(mapPostRow);
}
