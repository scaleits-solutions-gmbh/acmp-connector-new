import { describe, expect, it } from 'vitest';
import { createAcmpConnectorClient } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { getE2eApiKey, getE2eBaseUrl } from './_helpers/e2e-env';

describe('Health routes (e2e)', () => {
  const client = createAcmpConnectorClient({
    baseUrl: getE2eBaseUrl(),
    auth: { type: 'api-key', header: 'x-api-key', key: getE2eApiKey() },
  });

  it('GET /api/health returns contracted shape', async () => {
    const res = await client.getHealth({});
    expect(res.status).toBe(200);
    expect(res.data).toEqual({
      status: 'ok',
      timestamp: expect.any(String),
    });
  });
});


