import { BLOG_TABLES } from "@features/blog/lib/blogConfig";
import { createServerSupabase } from "@shared/lib/supabase";
import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Refreshes cached blog pages after an admin change. Only signed-in blog admins can trigger it. */
export async function POST(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const supabase = token ? createServerSupabase(token) : null;
  if (!token || !supabase) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // The database rules only show a user their own admin row, so this is empty for non-admins.
  const { data: adminRows, error: adminError } = await supabase.from(BLOG_TABLES.admins).select("user_id").eq("user_id", userData.user.id);
  if (adminError || !adminRows?.length) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body: unknown = await request.json().catch(() => ({}));
  const slugs = Array.isArray((body as { slugs?: unknown }).slugs)
    ? ((body as { slugs: unknown[] }).slugs.filter((slug) => typeof slug === "string" && SLUG_PATTERN.test(slug)) as string[])
    : [];

  revalidatePath("/blog");
  slugs.slice(0, 20).forEach((slug) => revalidatePath(`/blog/${slug}`));
  return NextResponse.json({ revalidated: true });
}
