"use client";
import { adminContent } from "@features/blog/admin/adminContent";
import { AdminButton, AdminCard, inputClass } from "@features/blog/admin/components/AdminUi";
import FeaturedPostPicker from "@features/blog/admin/components/FeaturedPostPicker";
import { blogAdminApi } from "@features/blog/api/blogAdminApi";
import type { BlogPostRow } from "@features/blog/lib/blog.types";
import { formatPostDate, matchesSearch } from "@features/blog/lib/blogUtils";
import { cn } from "@shared/lib/utils";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const copy = adminContent.posts;

type ListState = { status: "loading" } | { status: "error" } | { status: "ready"; posts: BlogPostRow[] };

export default function AdminPostsList() {
  const router = useRouter();
  const [state, setState] = useState<ListState>({ status: "loading" });
  const [query, setQuery] = useState("");
  const visiblePosts = state.status === "ready" ? state.posts.filter((post) => matchesSearch(post, query)) : [];

  const load = useCallback(async () => {
    try {
      setState({ status: "ready", posts: await blogAdminApi.listPosts() });
    } catch {
      setState({ status: "error" });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleFeaturedChange = (id: string | null) => {
    setState((current) =>
      current.status === "ready" ? { status: "ready", posts: current.posts.map((post) => ({ ...post, featured: post.id === id })) } : current
    );
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[clamp(30px,4vw,42px)] font-extrabold tracking-[-0.045em] text-[#12141F]">{copy.title}</h1>
        <AdminButton onClick={() => router.push("/admin/posts/new")}>
          <Plus className="size-4" aria-hidden />
          {copy.newPost}
        </AdminButton>
      </div>

      {state.status === "loading" && <div className="h-56 animate-pulse rounded-[20px] bg-black/6" />}

      {state.status === "error" && (
        <AdminCard className="p-8">
          <p className="text-black/60">{copy.loadError}</p>
          <AdminButton variant="ghost" className="mt-3 px-0" onClick={() => void load()}>
            {copy.retry}
          </AdminButton>
        </AdminCard>
      )}

      {state.status === "ready" && (
        <>
          {state.posts.some((post) => post.status === "published") && <FeaturedPostPicker posts={state.posts} onChange={handleFeaturedChange} />}
          {state.posts.length === 0 ? (
            <AdminCard className="px-6 py-16 text-center text-black/60">{copy.empty}</AdminCard>
          ) : (
            <>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <label className="relative block w-full sm:max-w-sm">
                  <span className="sr-only">{copy.searchPlaceholder}</span>
                  <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-black/40" aria-hidden />
                  <input
                    type="search"
                    name="postSearch"
                    autoComplete="off"
                    placeholder={copy.searchPlaceholder}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className={cn(inputClass, "pl-10")}
                  />
                </label>
                <span className="font-mono text-[11px] tracking-[0.12em] text-black/45 uppercase">
                  {visiblePosts.length} {visiblePosts.length === 1 ? copy.countSingular : copy.countPlural}
                </span>
              </div>
              {visiblePosts.length === 0 ? (
                <AdminCard className="px-6 py-14 text-center text-black/60">{copy.noMatches}</AdminCard>
              ) : (
                <AdminCard className="overflow-hidden">
                  <ul>
                    {visiblePosts.map((post, index) => {
                      const published = post.status === "published";
                      return (
                        <li key={post.id} className={cn(index > 0 && "border-t border-black/6")}>
                          <Link
                            href={`/admin/posts/${post.id}`}
                            className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-4 transition-colors hover:bg-[#f6f5f2] sm:px-6"
                          >
                            <div className="min-w-0 flex-[1_1_16rem]">
                              <p className="font-semibold text-[#12141F]">{post.title}</p>
                              <p className="mt-0.5 text-xs text-black/50">
                                {copy.updated} {formatPostDate(post.updated_at)} · {post.category}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {post.featured && published && (
                                <span className="bg-secondary px-1.5 py-0.5 font-mono text-[10px] tracking-[0.12em] text-tertiary uppercase">
                                  {copy.featured}
                                </span>
                              )}
                              <span
                                className={cn(
                                  "rounded-full px-2.5 py-1 text-[11px] font-bold",
                                  published ? "bg-[#1a7f4b]/12 text-[#1a7f4b]" : "bg-black/6 text-black/55"
                                )}
                              >
                                {published ? copy.published : copy.draft}
                              </span>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </AdminCard>
              )}
            </>
          )}
        </>
      )}
    </main>
  );
}
