# Plan

1. Locate the current config bootstrap and `.env` usage in the Fastify app entrypoints (e.g., `apps/fastify-api/src/index.ts`) so we know exactly where environment variables are loaded today.
2. Add a dev-only path that loads `.env` when `NODE_ENV=development` (or a similar flag), keeping local macOS workflows unchanged while avoiding `.env` usage in production builds.
3. Add a production config loader that reads `%PROGRAMDATA%\ACMPConnector\config.json` on Windows, maps it into the same runtime config shape as env vars, and provides a clear fallback when the file is missing.
4. Update service-management handlers/use-cases to use the new config loader (instead of direct `process.env` reads) so the admin panel routes reflect the real stored configuration.
5. Validate the two modes (dev `.env` vs. prod JSON) with a quick sanity check, then update any installer/readme notes to reflect the new config location.
