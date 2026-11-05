# GitHub Copilot Instructions - SharkScale

Full-stack monorepo powered by Turborepo and pnpm workspaces.

## Tech Stack & Architecture

- **Backend (`apps/api`)**: NestJS following Domain-Driven Design (DDD).
  - Structure inside modules: `domain/`, `infrastructure/`, `presentation/`, `services/`.
  - Database: PostgreSQL with Drizzle ORM.
  - Auth: JWT, bcrypt, and cuid2.
- **Frontend (`apps/web`)**: Next.js 16 (App Router) using Feature-Driven Architecture (FDA).
  - Structure: `features/<feature>/{api,components,types}` for domain logic, `shared/` for reusable code.
  - UI & Styling: Tailwind CSS v4, shadcn/ui.
  - State & Data: Zustand, TanStack Query, react-hook-form + Zod schemas, react-hot-toast, i18next.
- **Shared DTOs (`packages/dtos`)**: Shared `@repo/dtos` schemas written with Zod. Used across backend (`nestjs-zod`) and frontend.

## Essential Commands

Run commands from root using `pnpm`:

- **Development**: `pnpm dev`
- **Build**: `pnpm build`
- **Lint**: `pnpm lint` (or `pnpm lint:fix`)
- **Format**: `pnpm format` (or `pnpm format:fix`)
- **Typecheck**: `pnpm typecheck`
- **Database (Drizzle)**:
  - Generate migrations: `pnpm --filter nestjs db:generate`
  - Run migrations: `pnpm --filter nestjs db:migrate`
  - Push schema: `pnpm --filter nestjs db:push`
  - Drizzle studio: `pnpm --filter nestjs db:studio`

## Conventions & Rules

- **Shared Contracts**: Always define or update request/response schemas in `packages/dtos/src` before implementing cross-layer features.
- **Backend Architecture**: Enforce DDD boundaries in `apps/api`. Keep controllers in `presentation/`, entities/interfaces in `domain/`, database models/repositories in `infrastructure/`, and business logic in `services/`.
- **Frontend Architecture**: Keep feature-specific components, hooks, and types inside `apps/web/features/<feature>/`. Only place cross-cutting primitives in `apps/web/shared/`.
- **Type Safety**: Strictly avoid `any`. Ensure all TypeScript checks pass (`pnpm typecheck`).
- **Task Execution**: Never run `pnpm lint`, `pnpm format`, or `pnpm build` after tasks given by the user to save time; only run them when explicitly instructed or when making and executing a comprehensive plan.
