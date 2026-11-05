"use client";
import { adminContent } from "@features/blog/admin/adminContent";
import { AdminButton, AdminDialog, AdminField, AdminInput } from "@features/blog/admin/components/AdminUi";
import { BlogAdminError } from "@features/blog/api/blogAdminApi";
import { cleanCategoryName } from "@features/blog/lib/blogUtils";
import { validateCategoryName } from "@features/blog/lib/blogValidation";
import { useState, type FormEvent } from "react";

interface CategoryNameDialogProps {
  title: string;
  message?: string;
  submitLabel: string;
  initialValue?: string;
  onSubmit: (name: string) => Promise<void>;
  onClose: () => void;
}

export default function CategoryNameDialog({ title, message, submitLabel, initialValue = "", onSubmit, onClose }: CategoryNameDialogProps) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const copy = adminContent.categories;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const problem = validateCategoryName(value);
    if (problem) {
      setError(problem);
      return;
    }
    setSaving(true);
    try {
      await onSubmit(cleanCategoryName(value));
    } catch (saveError) {
      setError(saveError instanceof BlogAdminError && saveError.code === "category-taken" ? copy.errors.taken : copy.errors.save);
      setSaving(false);
    }
  };

  return (
    <AdminDialog title={title} message={message} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        <AdminField label={copy.nameLabel} error={error}>
          <AdminInput
            name="categoryName"
            autoComplete="off"
            maxLength={60}
            placeholder={copy.namePlaceholder}
            value={value}
            error={Boolean(error)}
            onChange={(event) => {
              setValue(event.target.value);
              setError(null);
            }}
          />
        </AdminField>
        <div className="mt-6 flex flex-wrap justify-end gap-2.5">
          <AdminButton variant="secondary" onClick={onClose}>
            {copy.cancel}
          </AdminButton>
          <AdminButton type="submit" loading={saving}>
            {submitLabel}
          </AdminButton>
        </div>
      </form>
    </AdminDialog>
  );
}
