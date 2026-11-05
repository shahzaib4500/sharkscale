# AGENTS.md - SharkScale

Guidelines and operational rules for AI coding agents operating in this repository.

## Overview

SharkScale is a full-stack monorepo managed with Turborepo and pnpm workspaces.

- **Node Version**: `>= 24`
- **Package Manager**: `pnpm@11.10.0`

## Structure & Architecture

```
apps/
  api/          # NestJS backend using Domain-Driven Design (DDD) & Drizzle ORM
  web/          # Next.js 16 App Router using Feature-Driven Architecture (FDA)
packages/
  dtos/         # Shared Zod DTOs (@repo/dtos) consumed by both apps
  eslint-config/# Shared ESLint configurations
  typescript-config/ # Shared tsconfig bases
```

### Backend (`apps/api`)

- Follows DDD inside `src/modules/<module-name>/`:
  - `domain/`: Business entities and repository interfaces.
  - `infrastructure/`: Database schemas, repository implementations, third-party adapters.
  - `presentation/`: Controllers, guards, decorators, routes.
  - `services/`: Use cases, application and domain services.
- Database operations use Drizzle ORM (`drizzle.config.ts`, `src/database/schema/`).
- Validation uses `nestjs-zod` integrated with `@repo/dtos`.

### Frontend (`apps/web`)

- Feature-Driven Architecture (FDA):
  - `features/<feature-name>/`: Contains `api/`, `components/`, and `types/` specific to that domain feature.
  - `shared/`: Generic components, custom hooks, utilities, constants, stores, and providers.
- Styling: Tailwind CSS v4 and shadcn/ui.
- State & Data: TanStack Query for server state, Zustand for client state, `react-hook-form` + Zod for forms.

### Shared Contracts (`packages/dtos`)

- Shared schemas live in `packages/dtos/src/`.
- Export DTOs through `packages/dtos/package.json` exports mapping.
- Update shared DTOs first when altering API payloads.

## Common Commands

Always use `pnpm`:

```bash
# Workflow commands (from root)
pnpm dev              # Start all apps in watch mode
pnpm build            # Build all packages and apps via Turbo
pnpm lint             # Run ESLint across monorepo
pnpm lint:fix         # Fix lint issues across monorepo
pnpm format           # Verify formatting with Prettier
pnpm format:fix       # Fix formatting with Prettier
pnpm typecheck        # Typecheck all workspaces

# Database commands (run via filter or inside apps/api)
pnpm --filter nestjs db:generate   # Generate Drizzle migration files
pnpm --filter nestjs db:migrate    # Apply pending database migrations
pnpm --filter nestjs db:push       # Push schema changes directly
pnpm --filter nestjs db:studio     # Launch Drizzle Studio
```

## Agent Guidelines

- Never edit generated files directly (`drizzle/meta/`, build artifacts in `dist/`, `.next/`).
- Enforce strict typing—do not introduce `any` or disable ESLint rules without explicit justification.
- Never run `pnpm lint`, `pnpm format`, or `pnpm build` after tasks given by the user to save time; only run them when explicitly instructed or when making and executing a comprehensive plan.
