import { describe, expect, it } from 'vitest';
import { createAcmpConnectorClient } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { getE2eBaseUrl } from './_helpers/e2e-env';

describe('Auth routes (e2e)', () => {
  it('rejects /api routes without x-api-key when API_KEY is configured', async () => {
    const client = createAcmpConnectorClient({ baseUrl: getE2eBaseUrl() });

    await expect(
      client.getClients({
        queryParams: { page: 1, pageSize: 10 },
      }),
    ).rejects.toMatchObject({ status: 401 });
  });
});


