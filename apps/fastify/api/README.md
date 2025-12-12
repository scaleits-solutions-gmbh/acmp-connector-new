## Fastify API

This package contains the ACMP Connector HTTP API (Fastify) and its **end-to-end (e2e)** test suite.

### E2E tests

The e2e tests:
- **Boot the Fastify server** on an ephemeral port
- Call it using the generated **type-safe client** from `@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit`
- Validate key behaviors like **contracted health response** and **API key auth**

Run:

```bash
pnpm -C apps/fastify/api test:e2e
```

### Environment variables

- **`API_KEY`**: if set, `/api/*` routes require `x-api-key`. The e2e suite sets a default if you don't provide one.

### Notes

- The e2e suite injects **fake use-cases** so it can run without MSSQL/SICS dependencies.
- For “full stack” e2e (real MSSQL), we can add an additional suite that boots containers and uses the real repositories.


