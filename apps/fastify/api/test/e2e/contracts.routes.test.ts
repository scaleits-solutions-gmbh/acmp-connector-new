import { describe, expect, it } from 'vitest';
import { getE2eApiKey, getE2eBaseUrl } from './_helpers/e2e-env';

describe('Contracts (e2e)', () => {
  it('exposes all implemented contract routes under /api (not 404)', async () => {
    const baseUrl = getE2eBaseUrl();
    const apiKey = getE2eApiKey();

    const apiExports = (await import(
      '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit'
    )) as Record<string, unknown>;

    const contractMetas = Object.values(apiExports).filter((v) => {
      if (!v || typeof v !== 'object') return false;
      const o = v as Record<string, unknown>;
      return typeof o.method === 'string' && typeof o.servicePath === 'string';
    }) as Array<{ method: string; servicePath: string }>;

    // This Fastify API currently implements a subset of the overall connector contracts.
    const implementedRouteRegex =
      /^\/api\/(health|clients|jobs|tickets|assets|client-commands|rollout-templates)(\/|$)/;

    const expected = contractMetas.filter(
      (m) =>
        m.servicePath.startsWith('/api/') &&
        implementedRouteRegex.test(m.servicePath) &&
        // Not implemented yet by this Fastify API
        !m.servicePath.includes('/details'),
    );

    for (const m of expected) {
      const method = m.method.toUpperCase();
      const url = m.servicePath.replace(/\{[^}]+\}/g, 'test-id'); // substitute any path param

      const headers: Record<string, string> = {};
      if (url !== '/api/health') headers['x-api-key'] = apiKey;

      // We don't want this contract route smoke test to mutate anything.
      // So we only probe non-GET routes for existence with an empty body (expecting 400/401/405 etc, but not 404).
      const isGet = method === 'GET';
      const res = await fetch(`${baseUrl}${url}`, {
        method,
        headers: {
          ...headers,
          ...(isGet ? {} : { 'content-type': 'application/json' }),
        },
        body: isGet ? undefined : JSON.stringify({}),
      });

      expect(
        res.status,
        `Expected route to exist (not 404): ${method} ${url}. Got ${res.status}.`,
      ).not.toBe(404);
    }
  });
});


