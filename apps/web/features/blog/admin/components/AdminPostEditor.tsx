"use client";
import { adminContent } from "@features/blog/admin/adminContent";
import { AdminButton, AdminCard, AdminDialog, AdminField, AdminInput, AdminSelect, AdminTextarea, Notice } from "@features/blog/admin/components/AdminUi";
import CategoryNameDialog from "@features/blog/admin/components/CategoryNameDialog";
import RichTextEditor from "@features/blog/admin/components/RichTextEditor";
import { BlogAdminError, blogAdminApi } from "@features/blog/api/blogAdminApi";
import BlogCover from "@features/blog/components/BlogCover";
import PostContent from "@features/blog/components/PostContent";
import type { BlogNode, BlogPostRow, PostStatus } from "@features/blog/lib/blog.types";
import { countWords, getReadTimeMinutes, mergeCategories, slugify } from "@features/blog/lib/blogUtils";
import { validateDraft, validatePublish, type FieldErrors } from "@features/blog/lib/blogValidation";
import { cn } from "@shared/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ChangeEvent, type MouseEvent } from "react";

const copy = adminContent.editor;
const NEW_CATEGORY = "__new_category__";

interface EditorValues {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  authorName: string;
  coverImageUrl: string | null;
  body: BlogNode[];
  featured: boolean;
  status: PostStatus;
  publishedAt: string | null;
}

type ErrorField = keyof EditorValues | "body";

const EMPTY_POST: EditorValues = {
  title: "",
  slug: "",
  excerpt: "",
  category: "",
  authorName: copy.defaultAuthor,
  coverImageUrl: null,
  body: [],
  featured: false,
  status: "draft",
  publishedAt: null
};

const rowToValues = (row: BlogPostRow): EditorValues => ({
  title: row.title,
  slug: row.slug,
  excerpt: row.excerpt ?? "",
  category: row.category,
  authorName: row.author_name,
  coverImageUrl: row.cover_image_url,
  body: row.body ?? [],
  featured: row.featured,
  status: row.status,
  publishedAt: row.published_at
});

const imageErrorMessage = (error: unknown) => {
  if (error instanceof BlogAdminError && error.code === "image-type") {
    return copy.errors.imageType;
  }
  if (error instanceof BlogAdminError && error.code === "image-size") {
    return copy.errors.imageSize;
  }
  return copy.errors.imageUpload;
};

export default function AdminPostEditor({ postId }: { postId?: string }) {
  const router = useRouter();
  const slugTouched = useRef(Boolean(postId));
  const coverInput = useRef<HTMLInputElement>(null);
  const [id, setId] = useState<string | null>(postId ?? null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">(postId ? "loading" : "ready");
  const [saved, setSaved] = useState<EditorValues>(EMPTY_POST);
  const [values, setValues] = useState<EditorValues>(EMPTY_POST);
  const [errors, setErrors] = useState<FieldErrors<ErrorField>>({});
  const [savedCategories, setSavedCategories] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);

  const categories = mergeCategories(savedCategories, [values.category]);
  const category = values.category || categories[0] || "";
  const words = countWords(values.body);
  const isPublished = values.status === "published";
  const dirty = JSON.stringify(values) !== JSON.stringify(saved);

  useEffect(() => {
    if (!postId) {
      return undefined;
    }
    let active = true;
    blogAdminApi
      .getPost(postId)
      .then((row) => {
        if (active) {
          const loaded = rowToValues(row);
          setSaved(loaded);
          setValues(loaded);
          setLoadState("ready");
        }
      })
      .catch(() => {
        if (active) {
          setLoadState("error");
        }
      });
    return () => {
      active = false;
    };
  }, [postId]);

  useEffect(() => {
    let active = true;
    blogAdminApi
      .listCategories()
      .then((list) => {
        if (active) {
          setSavedCategories(list);
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!dirty) {
      return undefined;
    }
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const update = <K extends keyof EditorValues>(field: K, value: EditorValues[K]) => {
    setNotice(null);
    setErrors((current) => ({ ...current, [field]: undefined }));
    setValues((current) => ({ ...current, [field]: value }));
  };

  const changeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    const title = event.target.value;
    setNotice(null);
    setErrors((current) => ({ ...current, title: undefined, slug: slugTouched.current ? current.slug : undefined }));
    setValues((current) => ({ ...current, title, slug: slugTouched.current ? current.slug : slugify(title) }));
  };

  const changeSlug = (event: ChangeEvent<HTMLInputElement>) => {
    slugTouched.current = true;
    update("slug", slugify(event.target.value));
  };

  const changeCategory = (event: ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === NEW_CATEGORY) {
      setCategoryDialogOpen(true);
      return;
    }
    update("category", event.target.value);
  };

  const addCategory = async (name: string) => {
    const existing = categories.find((item) => item.toLowerCase() === name.toLowerCase());
    if (!existing) {
      await blogAdminApi.createCategory(name);
      setSavedCategories((list) => [...list, name]);
    }
    update("category", existing ?? name);
    setCategoryDialogOpen(false);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    setError(null);
    setUploading(true);
    try {
      return await blogAdminApi.uploadImage(file);
    } catch (uploadError) {
      setError(imageErrorMessage(uploadError));
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleCover = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }
    const url = await uploadImage(file);
    if (url) {
      update("coverImageUrl", url);
    }
  };

  const save = async (status: PostStatus) => {
    setError(null);
    setNotice(null);
    const publishing = status === "published";
    const formValues = { ...values, category };
    const nextErrors: FieldErrors<ErrorField> = publishing ? validatePublish(formValues, words) : validateDraft(formValues);
    if (!category) {
      nextErrors.category = copy.noCategory;
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSaving(true);
    try {
      const row = await blogAdminApi.savePost(
        id,
        {
          title: values.title.trim(),
          slug: values.slug.trim(),
          excerpt: values.excerpt.trim(),
          category,
          author_name: values.authorName.trim(),
          cover_image_url: values.coverImageUrl,
          body: values.body,
          featured: values.featured,
          status,
          published_at: publishing ? (values.publishedAt ?? new Date().toISOString()) : values.publishedAt
        },
        saved.slug || undefined
      );
      const next = rowToValues(row);
      setSaved(next);
      setValues(next);
      setNotice(publishing && !isPublished ? copy.publishedNotice : !publishing && isPublished ? copy.unpublishedNotice : copy.saved);
      if (!id) {
        setId(row.id);
        window.history.replaceState(null, "", `/admin/posts/${row.id}`);
      }
    } catch (saveError) {
      if (saveError instanceof BlogAdminError && saveError.code === "slug-taken") {
        setErrors({ slug: copy.errors.slugTaken });
      } else {
        setError(copy.errors.save);
      }
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!id) {
      return;
    }
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    setSaving(true);
    try {
      await blogAdminApi.deletePost(id, saved.slug);
      setSaved(values);
      router.replace("/admin");
    } catch {
      setError(copy.errors.delete);
      setConfirmingDelete(false);
      setSaving(false);
    }
  };

  const leave = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!dirty) {
      return;
    }
    event.preventDefault();
    setLeaveDialogOpen(true);
  };

  if (loadState === "loading") {
    return <div className="mx-auto mt-10 h-[60vh] w-full max-w-6xl animate-pulse rounded-[20px] bg-black/6" />;
  }
  if (loadState === "error") {
    return <p className="px-6 py-20 text-center text-black/60">{copy.errors.load}</p>;
  }

  return (
    <main className="mx-auto grid w-full max-w-6xl gap-8 px-5 pt-8 pb-20 sm:px-8 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start">
      <div className="flex min-w-0 flex-col gap-5">
        <Link href="/admin" onClick={leave} className="inline-flex items-center gap-1.5 self-start text-sm font-semibold text-black/60 hover:text-[#12141F]">
          <ArrowLeft className="size-4" aria-hidden />
          {copy.back}
        </Link>

        <AdminField label={copy.title} error={errors.title}>
          <AdminInput
            name="title"
            value={values.title}
            onChange={changeTitle}
            placeholder={copy.titlePlaceholder}
            error={Boolean(errors.title)}
            className="py-3 text-[22px] font-bold tracking-[-0.025em]"
          />
        </AdminField>

        <div>
          <div className="mb-1.5 flex items-center justify-between gap-4">
            <span className="text-[13px] font-semibold text-[#12141F]">{copy.body}</span>
            <div className="flex gap-1 rounded-full bg-black/5 p-1">
              {(["write", "preview"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={mode === option}
                  onClick={() => setMode(option)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
                    mode === option ? "bg-white text-[#12141F] shadow-sm" : "text-black/55"
                  )}
                >
                  {copy[option]}
                </button>
              ))}
            </div>
          </div>

          {/* The editor stays mounted while previewing so undo history isn't lost. */}
          <div className={mode === "write" ? "block" : "hidden"}>
            <RichTextEditor initialBody={values.body} onChange={(body) => update("body", body)} onUploadImage={uploadImage} uploading={uploading} />
          </div>
          {mode === "preview" && (
            <AdminCard className="flex flex-col gap-6 p-5 sm:p-8">
              <BlogCover slug={values.slug} imageUrl={values.coverImageUrl} title={values.title} className="aspect-[21/9] rounded-2xl" />
              <h1 className="text-[clamp(30px,4vw,48px)] leading-[1.02] font-extrabold tracking-[-0.05em] text-[#12141F]">{values.title}</h1>
              <PostContent body={values.body} />
            </AdminCard>
          )}
          {errors.body && (
            <span role="alert" className="mt-1.5 block text-xs font-medium text-[#e5484d]">
              {errors.body}
            </span>
          )}
          <p className="mt-2 text-xs text-black/50">
            {words} {copy.wordsUnit} · {getReadTimeMinutes(values.body)} {copy.readTimeUnit}
          </p>
        </div>
      </div>

      <AdminCard className="flex flex-col gap-5 p-5 lg:sticky lg:top-24">
        <div className="flex flex-col gap-2.5">
          <AdminButton loading={saving} disabled={uploading} onClick={() => void save("published")} className="w-full py-3">
            {isPublished ? copy.saveChanges : copy.publish}
          </AdminButton>
          <AdminButton variant="secondary" disabled={saving || uploading} onClick={() => void save("draft")} className="w-full">
            {isPublished ? copy.unpublish : copy.saveDraft}
          </AdminButton>
          <div className="text-center">
            <Notice tone={error ? "error" : notice ? "success" : "muted"}>{saving ? copy.saving : (error ?? notice ?? (dirty ? copy.unsaved : ""))}</Notice>
          </div>
        </div>

        <AdminField label={copy.slug} hint={`${copy.slugPrefix}${values.slug}`} error={errors.slug}>
          <AdminInput name="slug" value={values.slug} onChange={changeSlug} disabled={isPublished} error={Boolean(errors.slug)} />
        </AdminField>
        <AdminField label={copy.excerpt} hint={copy.excerptHint} error={errors.excerpt}>
          <AdminTextarea
            name="excerpt"
            rows={3}
            value={values.excerpt}
            onChange={(event) => update("excerpt", event.target.value)}
            error={Boolean(errors.excerpt)}
          />
        </AdminField>
        <AdminField label={copy.category} error={errors.category}>
          <AdminSelect name="category" value={category} onChange={changeCategory} error={Boolean(errors.category)}>
            {categories.length === 0 && <option value="">—</option>}
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
            <option value={NEW_CATEGORY}>{copy.newCategoryOption}</option>
          </AdminSelect>
        </AdminField>
        <AdminField label={copy.author} error={errors.authorName}>
          <AdminInput
            name="authorName"
            value={values.authorName}
            onChange={(event) => update("authorName", event.target.value)}
            error={Boolean(errors.authorName)}
          />
        </AdminField>

        <div>
          <span className="mb-1.5 block text-[13px] font-semibold text-[#12141F]">{copy.cover}</span>
          {values.coverImageUrl && (
            <BlogCover slug={values.slug} imageUrl={values.coverImageUrl} title={values.title} className="mb-2 aspect-[16/10] rounded-xl" />
          )}
          <div className="flex flex-wrap gap-2">
            <AdminButton variant="secondary" disabled={uploading} onClick={() => coverInput.current?.click()}>
              {uploading ? copy.uploading : values.coverImageUrl ? copy.coverReplace : copy.coverUpload}
            </AdminButton>
            {values.coverImageUrl && (
              <AdminButton variant="secondary" onClick={() => update("coverImageUrl", null)}>
                {copy.coverRemove}
              </AdminButton>
            )}
          </div>
          <input ref={coverInput} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={handleCover} />
          <span className="mt-1.5 block text-xs leading-snug text-black/50">{copy.coverHint}</span>
        </div>

        <label className="flex items-start gap-2.5">
          <input
            type="checkbox"
            name="featured"
            checked={values.featured}
            onChange={(event) => update("featured", event.target.checked)}
            className="mt-1 accent-primary"
          />
          <span>
            <span className="block text-[13px] leading-snug font-semibold text-[#12141F]">{copy.featured}</span>
            <span className="mt-0.5 block text-xs leading-snug text-black/50">{copy.featuredHint}</span>
          </span>
        </label>

        {id && (
          <AdminButton
            variant="ghost"
            disabled={saving}
            onClick={() => void remove()}
            onBlur={() => setConfirmingDelete(false)}
            className="text-[#e5484d] hover:text-[#e5484d]"
          >
            {confirmingDelete ? copy.confirmDelete : copy.delete}
          </AdminButton>
        )}
      </AdminCard>

      {categoryDialogOpen && (
        <CategoryNameDialog
          title={adminContent.categories.newCategory}
          submitLabel={adminContent.categories.create}
          onSubmit={addCategory}
          onClose={() => setCategoryDialogOpen(false)}
        />
      )}
      {leaveDialogOpen && (
        <AdminDialog title={copy.leaveDialog.title} message={copy.leaveDialog.message} onClose={() => setLeaveDialogOpen(false)}>
          <div className="flex flex-wrap justify-end gap-2.5">
            <AdminButton
              variant="secondary"
              onClick={() => {
                setSaved(values);
                router.push("/admin");
              }}
            >
              {copy.leaveDialog.leave}
            </AdminButton>
            <AdminButton onClick={() => setLeaveDialogOpen(false)}>{copy.leaveDialog.stay}</AdminButton>
          </div>
        </AdminDialog>
      )}
    </main>
  );
}
