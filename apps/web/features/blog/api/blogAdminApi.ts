import type { BlogPostRow, CategoryWithCount } from "@features/blog/lib/blog.types";
import { BLOG_IMAGE_BUCKET, BLOG_IMAGE_MAX_BYTES, BLOG_IMAGE_TYPES, BLOG_TABLES } from "@features/blog/lib/blogConfig";
import { getBrowserSupabase } from "@shared/lib/supabase";
import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

const UNIQUE_VIOLATION = "23505";

export class BlogAdminError extends Error {
  constructor(public readonly code: "slug-taken" | "category-taken" | "image-type" | "image-size" | "not-configured" | "failed") {
    super(code);
  }
}

export type PostInput = Omit<BlogPostRow, "id" | "created_at" | "updated_at">;

function client(): SupabaseClient {
  const supabase = getBrowserSupabase();
  if (!supabase) {
    throw new BlogAdminError("not-configured");
  }
  return supabase;
}

function check<T>({ data, error }: { data: T; error: PostgrestError | null }, takenCode?: "slug-taken" | "category-taken"): T {
  if (error?.code === UNIQUE_VIOLATION && takenCode) {
    throw new BlogAdminError(takenCode);
  }
  if (error) {
    throw new BlogAdminError("failed");
  }
  return data;
}

/** Asks the site to refresh its cached blog pages. Failure is harmless: pages also refresh on a timer. */
async function refreshPublicPages(slugs: string[] = []): Promise<void> {
  const { data } = await client().auth.getSession();
  const token = data.session?.access_token;
  if (!token) {
    return;
  }
  await fetch("/api/blog/revalidate", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ slugs })
  }).catch(() => undefined);
}

export const blogAdminApi = {
  signIn: async (email: string, password: string) => {
    const { error } = await client().auth.signInWithPassword({ email, password });
    if (error) {
      throw new BlogAdminError("failed");
    }
  },

  signOut: async () => {
    await client().auth.signOut();
  },

  isAdmin: async (userId: string): Promise<boolean> => {
    const rows = check(await client().from(BLOG_TABLES.admins).select("user_id").eq("user_id", userId));
    return (rows ?? []).length > 0;
  },

  listPosts: async (): Promise<BlogPostRow[]> => check(await client().from(BLOG_TABLES.posts).select("*").order("updated_at", { ascending: false })) ?? [],

  getPost: async (id: string): Promise<BlogPostRow> => {
    const row = check(await client().from(BLOG_TABLES.posts).select("*").eq("id", id).single()) as BlogPostRow | null;
    if (!row) {
      throw new BlogAdminError("failed");
    }
    return row;
  },

  savePost: async (id: string | null, values: PostInput, previousSlug?: string): Promise<BlogPostRow> => {
    const supabase = client();
    if (values.featured && values.status === "published") {
      const others = supabase.from(BLOG_TABLES.posts).update({ featured: false }).eq("featured", true);
      check(await (id ? others.neq("id", id) : others));
    }
    const query = id ? supabase.from(BLOG_TABLES.posts).update(values).eq("id", id) : supabase.from(BLOG_TABLES.posts).insert(values);
    const row = check(await query.select().single(), "slug-taken") as BlogPostRow;
    await refreshPublicPages([row.slug, ...(previousSlug && previousSlug !== row.slug ? [previousSlug] : [])]);
    return row;
  },

  deletePost: async (id: string, slug: string) => {
    check(await client().from(BLOG_TABLES.posts).delete().eq("id", id));
    await refreshPublicPages([slug]);
  },

  /** Marks the new article first, so a failure partway never leaves nothing featured by accident. */
  setFeatured: async (id: string | null) => {
    const supabase = client();
    if (id) {
      check(await supabase.from(BLOG_TABLES.posts).update({ featured: true }).eq("id", id));
    }
    const others = supabase.from(BLOG_TABLES.posts).update({ featured: false }).eq("featured", true);
    check(await (id ? others.neq("id", id) : others));
    await refreshPublicPages();
  },

  listCategories: async (): Promise<string[]> => {
    const rows = check(await client().from(BLOG_TABLES.categories).select("name").order("name")) ?? [];
    return rows.map((row: { name: string }) => row.name);
  },

  listCategoriesWithCounts: async (): Promise<CategoryWithCount[]> => {
    const supabase = client();
    const [categories, posts] = await Promise.all([
      supabase.from(BLOG_TABLES.categories).select("name").order("name"),
      supabase.from(BLOG_TABLES.posts).select("category")
    ]);
    const usage = (check(posts) ?? []) as Array<{ category: string }>;
    return ((check(categories) ?? []) as Array<{ name: string }>).map(({ name }) => ({ name, count: usage.filter((post) => post.category === name).length }));
  },

  createCategory: async (name: string) => {
    check(await client().from(BLOG_TABLES.categories).insert({ name }), "category-taken");
  },

  /** Posts follow the new name automatically through the database's foreign key. */
  renameCategory: async (name: string, nextName: string) => {
    if (name === nextName) {
      return;
    }
    check(await client().from(BLOG_TABLES.categories).update({ name: nextName }).eq("name", name), "category-taken");
    await refreshPublicPages();
  },

  deleteCategory: async (name: string, moveTo: string | null) => {
    const supabase = client();
    if (moveTo) {
      check(await supabase.from(BLOG_TABLES.posts).update({ category: moveTo }).eq("category", name));
    }
    check(await supabase.from(BLOG_TABLES.categories).delete().eq("name", name));
    await refreshPublicPages();
  },

  uploadImage: async (file: File): Promise<string> => {
    const extension = BLOG_IMAGE_TYPES[file.type];
    if (!extension) {
      throw new BlogAdminError("image-type");
    }
    if (file.size > BLOG_IMAGE_MAX_BYTES) {
      throw new BlogAdminError("image-size");
    }
    const supabase = client();
    const path = `${crypto.randomUUID()}.${extension}`;
    const { error } = await supabase.storage.from(BLOG_IMAGE_BUCKET).upload(path, file, { contentType: file.type, cacheControl: "31536000" });
    if (error) {
      throw new BlogAdminError("failed");
    }
    return supabase.storage.from(BLOG_IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
  }
};
