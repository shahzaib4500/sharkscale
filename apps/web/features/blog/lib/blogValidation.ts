export type FieldErrors<T extends string> = Partial<Record<T, string>>;

export interface PostFormValues {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  authorName: string;
}

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CATEGORY_NAME_MAX = 40;

/** Checks the fields a post needs to be saved as a draft. */
export function validateDraft(values: Pick<PostFormValues, "title" | "slug">): FieldErrors<keyof PostFormValues> {
  const errors: FieldErrors<keyof PostFormValues> = {};
  const title = values.title.trim();
  const slug = values.slug.trim();
  if (!title) {
    errors.title = "Add a title";
  } else if (title.length > 160) {
    errors.title = "Keep the title under 160 characters";
  }
  if (!slug) {
    errors.slug = "Add a URL slug";
  } else if (!SLUG_PATTERN.test(slug)) {
    errors.slug = "Use lowercase letters, numbers and hyphens only";
  }
  return errors;
}

/** Checks everything a post needs before it can be published. */
export function validatePublish(values: PostFormValues, wordCount: number): FieldErrors<keyof PostFormValues | "body"> {
  const errors: FieldErrors<keyof PostFormValues | "body"> = { ...validateDraft(values) };
  const excerpt = values.excerpt.trim();
  if (!excerpt) {
    errors.excerpt = "Add a short summary before publishing";
  } else if (excerpt.length > 300) {
    errors.excerpt = "Keep the summary under 300 characters";
  }
  if (!values.category.trim()) {
    errors.category = "Choose a category";
  }
  if (!values.authorName.trim()) {
    errors.authorName = "Add an author name";
  }
  if (wordCount === 0) {
    errors.body = "Write something before publishing";
  }
  return errors;
}

/** Checks a category name. Returns an error message, or null if it's fine. */
export function validateCategoryName(value: string): string | null {
  const name = value.trim();
  if (!name) {
    return "Enter a category name";
  }
  if (name.length > CATEGORY_NAME_MAX) {
    return `Keep the name under ${CATEGORY_NAME_MAX} characters`;
  }
  return null;
}

/** Checks the sign-in form. */
export function validateLogin(email: string, password: string): FieldErrors<"email" | "password"> {
  const errors: FieldErrors<"email" | "password"> = {};
  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = "Enter a valid email";
  }
  if (!password) {
    errors.password = "Password is required";
  }
  return errors;
}
