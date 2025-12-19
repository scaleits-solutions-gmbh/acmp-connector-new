# Repository Guidelines

## Project Structure & Module Organization
- `apps/fastify-api`: Fastify HTTP API server, service plugins, and e2e tests (`test/`, `vitest.e2e.config.ts`). Built output in `dist/` and release artifacts in `release/`.
- `apps/admin-panel`: Vite + React admin UI served under `/admin-panel`; source in `src/` and assets in `src/assets/`.
- `packages/modules/acmp-connector`: Domain boundary mappers, use-cases, and validators (TypeScript source in `src/`).
- `packages/infrastructure`: MSSQL/SICS repository implementations and bootstrap wiring.
- `packages/shared`: Shared tooling like ESLint and TypeScript configs.
- `packages/tooling/nsis-installer`: Windows installer scripts.

## Build, Test, and Development Commands
- `pnpm dev`: Run all apps in dev mode via Turborepo.
- `pnpm build`: Build all packages/apps.
- `pnpm lint`: Lint all packages.
- `pnpm check-types`: Type-check all packages.
- `pnpm -C apps/fastify-api dev`: Build and start the API locally.
- `pnpm -C apps/fastify-api test:e2e`: Run Fastify e2e tests (Vitest).
- `pnpm -C apps/admin-panel dev`: Start the admin UI locally.

## Coding Style & Naming Conventions
- TypeScript-first; ES modules in most packages.
- Use Prettier for formatting (2-space indentation, double quotes, semicolons).
- ESLint is enforced at the package level.
- Prefer kebab-case for route/service folders (e.g., `client-commands`) and PascalCase for classes (e.g., `FindPaginatedClientsQuery`).

## Testing Guidelines
- Framework: Vitest for API e2e tests.
- Tests live under `apps/fastify-api/test` and are executed with `pnpm -C apps/fastify-api test:e2e`.
- No explicit coverage targets found; add tests for new API routes or repository behavior.

## Commit & Pull Request Guidelines
- Commit messages follow Conventional Commits (`feat:`, `fix:`, `chore:`).
- PRs should include: a clear description, linked issue (if any), test results, and UI screenshots for admin-panel changes.

## Security & Configuration Tips
- API auth uses `x-api-key` when `API_KEY` is set; configure `PORT` and `HOST` as needed.
- Admin panel and service-management routes are local-only by default.
