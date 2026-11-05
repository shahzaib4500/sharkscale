# Claude Code Guidelines - SharkScale

Full-stack monorepo with Turborepo and pnpm workspaces.

## Commands

- Install dependencies: `pnpm install`
- Dev mode: `pnpm dev`
- Build: `pnpm build`
- Typecheck: `pnpm typecheck`
- Lint: `pnpm lint` (`pnpm lint:fix` to autofix)
- Format: `pnpm format` (`pnpm format:fix` to autofix)
- Database:
  - Generate migrations: `pnpm --filter nestjs db:generate`
  - Migrate: `pnpm --filter nestjs db:migrate`
  - Push schema: `pnpm --filter nestjs db:push`
  - Studio: `pnpm --filter nestjs db:studio`

## Architecture & Conventions

- **Backend (`apps/api`)**: NestJS with Domain-Driven Design (DDD). Modules split into `domain/`, `infrastructure/`, `presentation/`, and `services/`. Drizzle ORM for PostgreSQL.
- **Frontend (`apps/web`)**: Next.js 16 App Router using Feature-Driven Architecture (FDA). Feature code goes in `features/<feature>/`, generic code in `shared/`. Tailwind CSS v4, shadcn/ui, Zustand, TanStack Query.
- **Shared DTOs (`packages/dtos`)**: All cross-boundary API contracts live in `@repo/dtos`. Always define or adjust shared Zod DTOs before modifying client/server integrations.
- **Type Safety**: Strictly avoid `any`. Ensure `pnpm typecheck` passes cleanly.
- **Task Execution**: Never run `pnpm lint`, `pnpm format`, or `pnpm build` after tasks given by the user to save time; only run them when explicitly instructed or when making and executing a comprehensive plan.
