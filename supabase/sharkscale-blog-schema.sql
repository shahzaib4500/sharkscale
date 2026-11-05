-- SharkScale blog: tables, access rules and image storage.
-- Lives in the same Supabase project as the SharkStack blog, using separate, scale_-prefixed objects
-- so neither site can see or change the other's posts, admins or images.
-- Run this once in the Supabase SQL Editor. It is safe to re-run.

-- ─── Who can manage the blog ────────────────────────────────────────────────
create table if not exists public.scale_blog_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Runs with elevated rights so policies can check the admin list without exposing it.
create or replace function public.is_scale_blog_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.scale_blog_admins where user_id = auth.uid());
$$;

revoke all on function public.is_scale_blog_admin() from public, anon;
grant execute on function public.is_scale_blog_admin() to authenticated;

-- ─── Posts ──────────────────────────────────────────────────────────────────
create table if not exists public.scale_blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (length(trim(title)) > 0),
  excerpt text not null default '',
  category text not null,
  author_name text not null default 'SharkStack Team',
  cover_image_url text,
  body jsonb not null default '[]'::jsonb check (jsonb_typeof(body) = 'array'),
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_by uuid default auth.uid() references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_posts_have_a_date check (status = 'draft' or published_at is not null)
);

create index if not exists scale_blog_posts_published_idx on public.scale_blog_posts (published_at desc) where status = 'published';

create or replace function public.set_scale_blog_post_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists scale_blog_posts_set_updated_at on public.scale_blog_posts;
create trigger scale_blog_posts_set_updated_at
before update on public.scale_blog_posts
for each row execute function public.set_scale_blog_post_updated_at();

-- ─── Categories ─────────────────────────────────────────────────────────────
create table if not exists public.scale_blog_categories (
  name text primary key check (length(trim(name)) between 1 and 40),
  created_at timestamptz not null default now()
);

create unique index if not exists scale_blog_categories_name_unique_idx on public.scale_blog_categories (lower(name));

-- Keep every category already used by a post.
insert into public.scale_blog_categories (name)
select distinct category from public.scale_blog_posts
on conflict do nothing;

-- Starter categories for a brand-new blog. Deleted ones don't come back if this script runs again.
insert into public.scale_blog_categories (name)
select starter.name
from (values ('Email Marketing'), ('Retention'), ('Deliverability'), ('Case Studies')) as starter (name)
where not exists (select 1 from public.scale_blog_categories)
on conflict do nothing;

alter table public.scale_blog_posts alter column category drop default;

-- Renaming a category updates its posts. A category with posts can't be deleted until they're moved.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'scale_blog_posts_category_fkey') then
    alter table public.scale_blog_posts
      add constraint scale_blog_posts_category_fkey
      foreign key (category) references public.scale_blog_categories (name)
      on update cascade on delete restrict;
  end if;
end;
$$;

-- ─── Access rules ───────────────────────────────────────────────────────────
alter table public.scale_blog_admins enable row level security;
alter table public.scale_blog_posts enable row level security;
alter table public.scale_blog_categories enable row level security;

revoke all on public.scale_blog_admins from anon, authenticated;
revoke all on public.scale_blog_posts from anon, authenticated;
revoke all on public.scale_blog_categories from anon, authenticated;
grant select, insert, update, delete on public.scale_blog_categories to authenticated;
grant select on public.scale_blog_admins to authenticated;
grant select on public.scale_blog_posts to anon, authenticated;
grant insert, update, delete on public.scale_blog_posts to authenticated;

-- A signed-in person can only see whether they themselves are an admin.
drop policy if exists "SharkScale: Users can see their own admin row" on public.scale_blog_admins;
create policy "SharkScale: Users can see their own admin row"
on public.scale_blog_admins for select to authenticated
using (user_id = auth.uid());

-- Everyone can read published posts whose publish date has arrived.
drop policy if exists "SharkScale: Anyone can read published posts" on public.scale_blog_posts;
create policy "SharkScale: Anyone can read published posts"
on public.scale_blog_posts for select to anon, authenticated
using (status = 'published' and published_at <= now());

-- Only admins can see drafts and create, change or delete posts.
drop policy if exists "SharkScale: Admins can manage posts" on public.scale_blog_posts;
create policy "SharkScale: Admins can manage posts"
on public.scale_blog_posts for all to authenticated
using (public.is_scale_blog_admin())
with check (public.is_scale_blog_admin());

-- Only admins can see and manage the category list.
drop policy if exists "SharkScale: Admins can manage categories" on public.scale_blog_categories;
create policy "SharkScale: Admins can manage categories"
on public.scale_blog_categories for all to authenticated
using (public.is_scale_blog_admin())
with check (public.is_scale_blog_admin());

-- ─── Images ─────────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('scale-blog-images', 'scale-blog-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- Anyone can view images because the bucket is public. Only admins can change them.
drop policy if exists "SharkScale: Admins can view blog image records" on storage.objects;
create policy "SharkScale: Admins can view blog image records"
on storage.objects for select to authenticated
using (bucket_id = 'scale-blog-images' and public.is_scale_blog_admin());

drop policy if exists "SharkScale: Admins can upload blog images" on storage.objects;
create policy "SharkScale: Admins can upload blog images"
on storage.objects for insert to authenticated
with check (bucket_id = 'scale-blog-images' and public.is_scale_blog_admin());

drop policy if exists "SharkScale: Admins can update blog images" on storage.objects;
create policy "SharkScale: Admins can update blog images"
on storage.objects for update to authenticated
using (bucket_id = 'scale-blog-images' and public.is_scale_blog_admin())
with check (bucket_id = 'scale-blog-images' and public.is_scale_blog_admin());

drop policy if exists "SharkScale: Admins can delete blog images" on storage.objects;
create policy "SharkScale: Admins can delete blog images"
on storage.objects for delete to authenticated
using (bucket_id = 'scale-blog-images' and public.is_scale_blog_admin());
