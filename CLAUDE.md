## Project

TaskFlow — a real-time project management platform (think mini Jira/Linear). Built phase-by-phase as a deep learning project covering Node.js, TypeScript, PostgreSQL, MongoDB, Redis, Kafka, BullMQ, Docker, Kubernetes, and Prometheus/Grafana. AI features (RAG, agents, MCP server) are planned in later phases.

## Commands

```bash
pnpm dev                            # Start dev server with hot reload (tsx watch)
pnpm build                          # Compile TypeScript to dist/ (tsc + tsc-alias)
pnpm start                          # Run compiled output (production)
pnpm lint                           # Run ESLint across src/
pnpm format                         # Run Prettier across src/
pnpm prisma migrate dev --name <n>  # Create and apply a new migration
pnpm prisma studio                  # Open Prisma Studio at localhost:5555
pnpm prisma validate                # Validate schema without connecting to DB
```

## Architecture

### Entry point split

`src/index.ts` owns the server lifecycle (`app.listen`). `src/app.ts` owns the Express app setup and exports it without binding to a port. This separation allows tests to import `app` without starting a real server.

### Feature-based structure

Code is organised by domain, not by layer. Each feature folder is self-contained:

```
src/features/<feature>/
  <feature>.controller.ts   ← request/response handling only
  <feature>.service.ts      ← business logic
  <feature>.repository.ts   ← all database access
  <feature>.routes.ts       ← route definitions
  <feature>.schema.ts       ← zod validation schemas
```

Controllers must not contain business logic. Services must not import from other feature's controllers. Cross-feature communication goes through services only.

### Shared code

`src/shared/middleware/` — Express middleware (auth guards, request logging, etc.)
`src/shared/errors/` — typed error classes (`AppError`, `ValidationError`, `NotFoundError`)
`src/shared/utils/` — pure utility functions with no side effects
`src/config/` — environment config (validated with Zod at startup, fail-fast)
`src/types/` — global TypeScript types and interface augmentations

### Path aliases

`@/*` maps to `src/*`. Use `@/features/tasks` not `../../features/tasks`. The build pipeline runs `tsc && tsc-alias` to rewrite aliases in compiled output — do not use relative paths for cross-feature imports.

### Database

Prisma 7 with PostgreSQL. Schema at `prisma/schema.prisma`. Migrations at `prisma/migrations/`.

`prisma.config.ts` at the project root configures the datasource for the CLI — it loads `.env` via `dotenv` and passes `DATABASE_URL` programmatically. The schema's `datasource` block only declares the provider (no `url` — that's a Prisma 7 change).

The Prisma client is generated to `src/generated/prisma`.

## Infrastructure

### Docker

- `docker-compose.yml` runs `postgres`, `redis`, and `app` services.
- Local dev connects to Docker postgres on **port 5433** (`localhost:5433`) because a local PostgreSQL installation occupies port 5432.
- Inside Docker the app connects via the internal service name `postgres:5432` — the compose `environment` block overrides `DATABASE_URL` for the container.
- Redis is on the default port 6379 (no conflict).

### Environment

`.env` is never committed. `.env.example` documents all required keys. Variables are never read directly — always through `src/config/index.ts` which validates them with Zod at startup and exits immediately on any missing/invalid value.

Key variables:
```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5433/taskflow
REDIS_URL=redis://localhost:6379
JWT_SECRET=<64-byte hex string>
```

## Git

- Do not add `Co-Authored-By: Claude` or any Claude attribution to commit messages.

## Conventions

- `strict: true` is enforced — no implicit `any`, no unchecked nulls
- Prefix intentionally unused parameters with `_` (e.g. `_req`, `_next`)
- Use `??` over `||` for default values to avoid falsy-value bugs
- Environment variables are never read directly — always through the validated config module in `src/config/`
- The 404 catch-all handler in `app.ts` must remain the last middleware registered
- Use `import { env } from "node:process"` instead of the `process` global — avoids relying on `@types/node` globals
- Prisma schema field order: scalar fields first, then relations, then block attributes (`@@id`, `@@unique`, etc.)
- `ignoreDeprecations: "6.0"` is set in `tsconfig.json` to silence TypeScript 6 deprecation errors for `moduleResolution: node` and `baseUrl`

## Tooling

- **ESLint** — flat config (`eslint.config.js`), TypeScript plugin, `globals.node` for Node.js globals, Prettier integration via `eslint-config-prettier`
- **Prettier** — config at `.prettierrc`
- **Husky** — pre-commit hook runs `lint-staged` (ESLint + Prettier on staged `.ts` files)
- **pnpm-workspace.yaml** — `@prisma/engines` and `prisma` builds explicitly allowed

## Current phase

**Phase 1 — Complete.** Express foundation, Zod config, Pino logging, Docker, ESLint + Prettier + Husky, Prisma schema with initial migration all done.

**Phase 2 — Next.** Authentication (JWT), user registration/login, workspace and project CRUD.
