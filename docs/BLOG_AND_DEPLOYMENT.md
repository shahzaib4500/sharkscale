# SharkScale: blog, admin panel and deployment

Reference for the blog and admin panel added in November 2026, and for how `sharkscale.co` is hosted after it was moved to company-owned accounts.

## At a glance

| What                         | Where                                                                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Public blog                  | `www.sharkscale.co/blog`, `www.sharkscale.co/blog/[slug]`                                                                      |
| Admin panel                  | `www.sharkscale.co/admin` (not linked anywhere on the site, `noindex`)                                                         |
| Source of truth              | GitHub `shahzaib4500/sharkscale`, branch `main`                                                                                |
| Hosting                      | Vercel project **`sharkscale`** in the `shibbal77-6147's projects` account (Hobby plan)                                        |
| Domain and DNS               | Spaceship (`sharkscale.co` redirects with a 308 to `www.sharkscale.co`)                                                        |
| Blog data, logins and images | Supabase project `sharkstack-blog` (ref `tkbpwtkwqykbiawracka`), shared with SharkStack, using SharkScale-only `scale_` tables |

`Khizer30/sharkscale` and the old `sharkscale-monorepo` Vercel project are **no longer used** for the live site. Khizer30 has left the company.

## Using the admin panel

Sign in at `/admin` with a Supabase account that has been made a SharkScale blog admin (see [Adding a writer](#adding-a-writer)).

- **Posts:** search the list; write in the editor (H1–H4, bold, italic, bullet and numbered lists, quotes, links, images), preview, save as draft, publish, unpublish, delete. The URL slug is generated from the title and locks once published. Read time is calculated automatically at 200 words a minute.
- **Cover images:** JPG, PNG or WebP up to 5 MB. Leave it empty to use generated on-brand artwork.
- **Featured article:** a searchable picker on the Posts page chooses one published post, or none, with a live preview.
- **Categories:** create, rename (posts follow automatically) and delete (posts must be moved to another category first). Starter categories: Email Marketing, Retention, Deliverability, Case Studies.
- Saving in the admin refreshes the public blog pages immediately.

## How it's built

- The blog pages are **server-rendered** by Next.js and cached. Each article has its own title, description, canonical link, Open Graph and Twitter tags, and `BlogPosting` structured data, so search engines and link previews work.
- Cached pages refresh at least every 60 seconds, and straight away after an admin saves: the admin calls `POST /api/blog/revalidate` with their Supabase session token, and the route checks they're in `scale_blog_admins` before refreshing.
- The admin panel runs in the browser and talks to Supabase with the **publishable/anon key**. Security is enforced by Postgres row-level security:
  - anyone can read posts with `status = 'published'` and a publish date in the past;
  - only users in `scale_blog_admins` can read drafts, write posts or categories, or upload images;
  - public sign-ups are disabled.
- Post bodies are stored as editor JSON (TipTap) and rendered by `PostContent.tsx` without raw HTML. Only `http`, `https` and `mailto` links and images are rendered.
- The navbar, mobile menu and footer have a **Blog** link. Homepage section links (Home, What We Do, Reviews, Book a Call) navigate back to the homepage when used from other pages.
- The admin panel uses the normal cursor instead of the custom one (`shared/components/ui/SiteCursor.tsx`).

### Database objects (Supabase)

Everything is prefixed so it can't collide with the SharkStack blog in the same project.

| Object                     | Purpose                                                                      |
| -------------------------- | ---------------------------------------------------------------------------- |
| `scale_blog_posts`         | Posts                                                                        |
| `scale_blog_categories`    | Category names. Renames cascade to posts; a category in use can't be deleted |
| `scale_blog_admins`        | Supabase user ids allowed to manage the SharkScale blog                      |
| `is_scale_blog_admin()`    | Helper used by the access rules                                              |
| `scale-blog-images` bucket | Public image bucket, admin-only writes, 5 MB limit                           |

The full definition is in [`supabase/sharkscale-blog-schema.sql`](../supabase/sharkscale-blog-schema.sql). It is safe to run again, and it was tested alongside the SharkStack schema to confirm each site's admins can only manage their own site's data.

### Key files (all under `apps/web`)

| Path                                            | What it does                                                           |
| ----------------------------------------------- | ---------------------------------------------------------------------- |
| `app/blog/page.tsx`, `app/blog/[slug]/page.tsx` | Public pages and their metadata                                        |
| `app/admin/**`                                  | Admin routes (login, posts, editor, categories)                        |
| `app/api/blog/revalidate/route.ts`              | Admin-only cache refresh                                               |
| `features/blog/api/blogQueries.ts`              | Server-side reads for the public pages                                 |
| `features/blog/api/blogAdminApi.ts`             | Admin reads and writes, image uploads, sign-in                         |
| `features/blog/components/*`                    | Public UI: cards, cover art, featured post, post renderer, empty state |
| `features/blog/admin/*`                         | Admin UI, session check and copy                                       |
| `features/blog/lib/*`                           | Types, config, copy, pure helpers, validation and unit tests           |
| `shared/lib/supabase.ts`                        | Supabase clients                                                       |

## Environment variables

Set in Vercel → project `sharkscale` → Settings → Environment Variables (Production and Preview). For local development, put them in `apps/web/.env.local` (never commit it).

| Name                            | Value                                                                       |
| ------------------------------- | --------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | `https://tkbpwtkwqykbiawracka.supabase.co`                                  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable key from Supabase → Project Settings → API Keys                 |
| `NEXT_PUBLIC_CALENDLY_URL`      | Book a Call calendar. Currently the same link as SharkStack's               |
| `NEXT_PUBLIC_SITE_URL`          | Optional. Used for canonical links; defaults to `https://www.sharkscale.co` |

Use the **publishable/anon** key only, never the `secret` or `service_role` key. These are built into the site, so after changing them, **redeploy**.

## Vercel project settings

- **Repository:** `shahzaib4500/sharkscale`, production branch `main`
- **Root Directory:** `apps/web`
- **Framework:** Next.js
- **Node.js version:** 24.x (the repo requires Node 24 or later)

Pushing or merging to `main` deploys automatically. On the free **Hobby** plan, Vercel may block deployments for commits authored by anyone other than the account owner. If a deploy doesn't start, someone signed in to the `shibbal77` Vercel account can click **Redeploy**, or upgrade to Pro and add team members. Vercel's Hobby plan is also intended for non-commercial use.

## Domain and DNS (Spaceship)

`sharkscale.co` uses Spaceship nameservers. In Spaceship → Domain Manager → `sharkscale.co` → Nameservers & DNS → **Advanced DNS**:

| Host                           | Type    | Value                                                                         | Purpose                    |
| ------------------------------ | ------- | ----------------------------------------------------------------------------- | -------------------------- |
| `@`                            | A       | `216.198.79.1`                                                                | Vercel                     |
| `www`                          | CNAME   | `702ea22d963297ab.vercel-dns-017.com.`                                        | Vercel                     |
| `_vercel`                      | TXT     | `vc-domain-verify=sharkscale.co,…` and `vc-domain-verify=www.sharkscale.co,…` | Proves ownership to Vercel |
| MX, SPF, DKIM, `_autodiscover` | various | Spacemail                                                                     | **Email. Don't touch**     |

The domain had previously been linked to another Vercel account, which is why Vercel asked for the `_vercel` TXT records. When pasting TXT values, make sure there are **no leading spaces**: that stopped verification the first time.

Two older `_vercel` TXT records (ending `d1ff0b…` and `88e98f…`) belong to the previous setup and can be deleted once everything is stable.

### Moving the domain to another Vercel project

1. Remove `www.sharkscale.co` and `sharkscale.co` from the old project (Settings → Domains). The site is offline from this point, so do the next step straight away.
2. Add `www.sharkscale.co` (Production) and `sharkscale.co` (308 redirect to `www.sharkscale.co`) to the new project.
3. If Vercel shows **Verification Required**, add the `_vercel` TXT records it shows in Spaceship, then click **Refresh**.

## Supabase setup (for reference)

1. Run [`supabase/sharkscale-blog-schema.sql`](../supabase/sharkscale-blog-schema.sql) in the SQL Editor of the shared project.
2. Public sign-ups are already disabled in that project (shared with SharkStack).

### Adding a writer

1. Supabase → **Authentication → Users → Add user → Create new user**, with **Auto Confirm User** ticked.
2. In the SQL Editor:

```sql
insert into public.scale_blog_admins (user_id)
select id from auth.users where email = 'writer@example.com'
on conflict (user_id) do nothing;
```

Logins are shared with SharkStack, but admin rights are separate: SharkStack admins are listed in `blog_admins`, SharkScale admins in `scale_blog_admins`.

## Testing

```sh
cd apps/web
node --experimental-strip-types --test features/blog/lib/blog.test.mjs
pnpm typecheck
```

The unit tests cover read time, slugs, safe links, categories, search and validation. They aren't run in CI yet. The full blog was also checked with a browser flow (58 checks) against a production build and a local Supabase stand-in; that script isn't in the repo.

**CI note:** the GitHub Actions `Lint Check` fails on two existing warnings in `shared/components/layout/DotsToPlusIcon.tsx`, which predate the blog. Because lint fails first, CI never reaches the format, type and build steps.

## History

- **Before November 2026:** code in `Khizer30/sharkscale`, served by the `sharkscale-monorepo` Vercel project.
- **5 November 2026:** blog merged into `Khizer30/sharkscale` (PR #2), but Vercel didn't deploy it. The full history, including the blog, was then pushed to `shahzaib4500/sharkscale` on top of its earlier snapshot, deployed as the new `sharkscale` Vercel project, and `sharkscale.co` was moved to it.

## Known issues and follow-ups

- **Supabase free plan:** inactive projects can be paused, which takes both blogs offline until restored.
- **Deleted images:** deleting a post doesn't delete its uploaded images from storage.
- **Old project:** delete the `sharkscale-monorepo` Vercel project once the new setup has been stable for a while.
- **Access:** remove Khizer30 from repos and accounts, and rotate any secrets he had.
- **Calendly:** replace the shared SharkStack link with a SharkScale-specific one when available.
