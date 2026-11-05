export interface BlogMark {
  type: string;
  attrs?: { href?: string | null } & Record<string, unknown>;
}

/** A node in the editor's document format, which is also how post bodies are stored. */
export interface BlogNode {
  type: string;
  text?: string;
  marks?: BlogMark[];
  attrs?: { level?: number; src?: string | null; alt?: string | null } & Record<string, unknown>;
  content?: BlogNode[];
}

export type PostStatus = "draft" | "published";

export interface BlogPostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string;
  author_name: string;
  cover_image_url: string | null;
  body: BlogNode[] | null;
  featured: boolean;
  status: PostStatus;
  published_at: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  coverImageUrl: string | null;
  body: BlogNode[];
  featured: boolean;
  status: PostStatus;
  publishedAt: string | null;
  date: string;
}

export interface BlogHeading {
  id: string;
  text: string;
  index: number;
}

export interface CategoryWithCount {
  name: string;
  count: number;
}
