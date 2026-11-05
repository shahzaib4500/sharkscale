/** SharkScale's blog lives next to SharkStack's in one Supabase project, so every object is prefixed. */
export const BLOG_TABLES = {
  posts: "scale_blog_posts",
  admins: "scale_blog_admins",
  categories: "scale_blog_categories"
} as const;

export const BLOG_IMAGE_BUCKET = "scale-blog-images";

/** Used for canonical links and link previews. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.sharkscale.co";

export const BLOG_IMAGE_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
export const BLOG_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
