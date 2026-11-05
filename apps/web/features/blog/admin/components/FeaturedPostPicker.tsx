"use client";
import { adminContent } from "@features/blog/admin/adminContent";
import { AdminCard, Notice } from "@features/blog/admin/components/AdminUi";
import SearchSelect from "@features/blog/admin/components/SearchSelect";
import { blogAdminApi } from "@features/blog/api/blogAdminApi";
import FeaturedPost from "@features/blog/components/FeaturedPost";
import type { BlogPostRow } from "@features/blog/lib/blog.types";
import { mapPostRow } from "@features/blog/lib/blogUtils";
import { useState } from "react";

const copy = adminContent.featuredPicker;

export default function FeaturedPostPicker({ posts, onChange }: { posts: BlogPostRow[]; onChange: (id: string | null) => void }) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const published = posts.filter((post) => post.status === "published");
  const current = published.find((post) => post.featured) ?? null;

  const handleChange = async (value: string) => {
    const id = value || null;
    setSaving(true);
    setMessage(null);
    try {
      await blogAdminApi.setFeatured(id);
      onChange(id);
      setMessage({ text: id ? copy.saved : copy.cleared, isError: false });
    } catch {
      setMessage({ text: copy.error, isError: true });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminCard className="mb-8 p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 flex-[1_1_16rem]">
          <h2 className="text-lg font-bold tracking-[-0.02em] text-[#12141F]">{copy.title}</h2>
          <p className="mt-1 text-[13px] leading-snug text-black/55">{copy.hint}</p>
        </div>
        <div className="w-full flex-[1_1_18rem] sm:max-w-sm">
          <SearchSelect
            name="featuredPost"
            label={copy.title}
            value={current?.id ?? ""}
            disabled={saving}
            onChange={(value) => void handleChange(value)}
            searchPlaceholder={copy.searchPlaceholder}
            emptyText={copy.noMatches}
            options={[{ value: "", label: copy.none }, ...published.map((post) => ({ value: post.id, label: post.title, hint: post.category }))]}
          />
          <div className="mt-1.5">
            <Notice tone={message?.isError ? "error" : "success"}>{saving ? copy.saving : message?.text}</Notice>
          </div>
        </div>
      </div>
      <p className="mt-4 mb-3 font-mono text-[11px] tracking-[0.12em] text-black/45 uppercase">{copy.preview}</p>
      {current ? (
        <div inert className="pointer-events-none" data-testid="featured-preview">
          <FeaturedPost post={mapPostRow(current)} linked={false} compact />
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-black/15 bg-[#f6f5f2] px-4 py-8 text-center text-sm text-black/60">{copy.emptyPreview}</p>
      )}
    </AdminCard>
  );
}
