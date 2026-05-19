## Project

TaskFlow — a real-time project management platform (think mini Jira/Linear). Built phase-by-phase as a deep learning project covering Node.js, TypeScript, PostgreSQL, MongoDB, Redis, Kafka, BullMQ, Docker, Kubernetes, and Prometheus/Grafana. AI features (RAG, agents, MCP server) are planned in later phases.

## Commands

```bash
pnpm dev          # Start dev server with hot reload (tsx watch)
pnpm build        # Compile TypeScript to dist/
pnpm start        # Run compiled output (production)
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

`@/*` maps to `src/*`. Use `@/features/tasks` not `../../features/tasks`. Both `tsconfig.json` paths and `tsconfig-paths` are required for this to work at runtime.

## Conventions

- `strict: true` is enforced — no implicit `any`, no unchecked nulls
- Prefix intentionally unused parameters with `_` (e.g. `_req`, `_next`)
- Use `??` over `||` for default values to avoid falsy-value bugs
- Environment variables are never read directly — always through the validated config module in `src/config/`
- The 404 catch-all handler in `app.ts` must remain the last middleware registered

## Current phase

**Phase 1 — Foundation.** Core Express setup and project structure complete. Next steps: environment config with Zod, structured logging with Pino, Docker + docker-compose, ESLint + Prettier + Husky.