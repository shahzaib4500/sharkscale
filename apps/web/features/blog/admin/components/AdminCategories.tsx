"use client";
import { adminContent } from "@features/blog/admin/adminContent";
import { AdminButton, AdminCard, AdminDialog, AdminField, AdminSelect, Notice } from "@features/blog/admin/components/AdminUi";
import CategoryNameDialog from "@features/blog/admin/components/CategoryNameDialog";
import { blogAdminApi } from "@features/blog/api/blogAdminApi";
import type { CategoryWithCount } from "@features/blog/lib/blog.types";
import { cn } from "@shared/lib/utils";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const copy = adminContent.categories;
const postCountLabel = (count: number) => `${count} ${count === 1 ? copy.postSingular : copy.postPlural}`;

type DialogState = { type: "create" } | { type: "edit"; category: CategoryWithCount } | { type: "delete"; category: CategoryWithCount } | null;

function DeleteCategoryDialog({
  category,
  categories,
  onDeleted,
  onClose
}: {
  category: CategoryWithCount;
  categories: CategoryWithCount[];
  onDeleted: () => Promise<void>;
  onClose: () => void;
}) {
  const others = categories.filter((item) => item.name !== category.name);
  const [moveTo, setMoveTo] = useState(others[0]?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasPosts = category.count > 0;

  const handleDelete = async () => {
    setSaving(true);
    setError(null);
    try {
      await blogAdminApi.deleteCategory(category.name, hasPosts ? moveTo : null);
      await onDeleted();
    } catch {
      setError(copy.errors.delete);
      setSaving(false);
    }
  };

  return (
    <AdminDialog
      title={copy.deleteDialog.title.replace("{name}", category.name)}
      message={hasPosts ? copy.deleteDialog.messageWithPosts.replace("{count}", postCountLabel(category.count)) : copy.deleteDialog.message}
      onClose={onClose}
    >
      {hasPosts && (
        <AdminField label={copy.deleteDialog.moveLabel}>
          <AdminSelect name="moveTo" value={moveTo} onChange={(event) => setMoveTo(event.target.value)}>
            {others.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </AdminSelect>
        </AdminField>
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-[#e5484d]">
          {error}
        </p>
      )}
      <div className={cn("flex flex-wrap justify-end gap-2.5", (hasPosts || error) && "mt-6")}>
        <AdminButton variant="secondary" disabled={saving} onClick={onClose}>
          {copy.cancel}
        </AdminButton>
        <AdminButton variant="danger" loading={saving} onClick={() => void handleDelete()}>
          {hasPosts ? copy.deleteDialog.moveAndDelete : copy.deleteDialog.delete}
        </AdminButton>
      </div>
    </AdminDialog>
  );
}

export default function AdminCategories() {
  const [state, setState] = useState<{ status: "loading" | "ready" | "error"; categories: CategoryWithCount[] }>({ status: "loading", categories: [] });
  const [dialog, setDialog] = useState<DialogState>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setState({ status: "ready", categories: await blogAdminApi.listCategoriesWithCounts() });
    } catch {
      setState({ status: "error", categories: [] });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const finish = async (message: string) => {
    await load();
    setDialog(null);
    setNotice(message);
  };

  const { categories } = state;

  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[clamp(30px,4vw,42px)] font-extrabold tracking-[-0.045em] text-[#12141F]">{copy.title}</h1>
        <AdminButton onClick={() => setDialog({ type: "create" })}>
          <Plus className="size-4" aria-hidden />
          {copy.newCategory}
        </AdminButton>
      </div>
      <p className="mt-2 text-[15px] text-black/60">{copy.subtitle}</p>
      <div className="mt-2 mb-4">
        <Notice tone="success">{notice}</Notice>
      </div>

      {state.status === "loading" && <div className="h-56 animate-pulse rounded-[20px] bg-black/6" />}
      {state.status === "error" && (
        <AdminCard className="p-8">
          <p className="text-black/60">{copy.errors.load}</p>
          <AdminButton variant="ghost" className="mt-3 px-0" onClick={() => void load()}>
            {copy.retry}
          </AdminButton>
        </AdminCard>
      )}
      {state.status === "ready" && (
        <AdminCard className="overflow-hidden">
          <ul>
            {categories.map((category, index) => (
              <li
                key={category.name}
                data-category={category.name}
                className={cn("flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-4 sm:px-6", index > 0 && "border-t border-black/6")}
              >
                <div className="min-w-0">
                  <p className="font-semibold break-words text-[#12141F]">{category.name}</p>
                  <p className="text-xs text-black/50">{postCountLabel(category.count)}</p>
                </div>
                <div className="flex gap-1">
                  <AdminButton variant="ghost" onClick={() => setDialog({ type: "edit", category })}>
                    {copy.edit}
                  </AdminButton>
                  <AdminButton
                    variant="ghost"
                    disabled={categories.length === 1}
                    title={categories.length === 1 ? copy.lastCategory : undefined}
                    onClick={() => setDialog({ type: "delete", category })}
                    className="text-[#e5484d] hover:text-[#e5484d]"
                  >
                    {copy.delete}
                  </AdminButton>
                </div>
              </li>
            ))}
          </ul>
        </AdminCard>
      )}

      {dialog?.type === "create" && (
        <CategoryNameDialog
          title={copy.newCategory}
          submitLabel={copy.create}
          onClose={() => setDialog(null)}
          onSubmit={async (name) => {
            await blogAdminApi.createCategory(name);
            await finish(copy.created);
          }}
        />
      )}
      {dialog?.type === "edit" && (
        <CategoryNameDialog
          title={copy.editDialog.title}
          message={copy.editDialog.message}
          submitLabel={copy.editDialog.save}
          initialValue={dialog.category.name}
          onClose={() => setDialog(null)}
          onSubmit={async (name) => {
            await blogAdminApi.renameCategory(dialog.category.name, name);
            await finish(copy.renamed);
          }}
        />
      )}
      {dialog?.type === "delete" && (
        <DeleteCategoryDialog category={dialog.category} categories={categories} onClose={() => setDialog(null)} onDeleted={() => finish(copy.deleted)} />
      )}
    </main>
  );
}
