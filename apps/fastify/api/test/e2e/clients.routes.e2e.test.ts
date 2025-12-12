import { describe, expect, it } from 'vitest';
import { createAcmpConnectorClient } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { getE2eApiKey, getE2eBaseUrl } from './_helpers/e2e-env';

describe('Clients routes (e2e)', () => {
  const client = createAcmpConnectorClient({
    baseUrl: getE2eBaseUrl(),
    auth: { type: 'api-key', header: 'x-api-key', key: getE2eApiKey() },
  });

  it('GET /api/clients (paginated)', async () => {
    const res = await client.getClients({ queryParams: { page: 1, pageSize: 10 } });
    expect(res.status).toBe(200);
    // Zod validation happens inside the client; we only need basic sanity here.
    expect(res.data.page).toBe(1);
  });

  it('GET /api/clients/{id}', async () => {
    const res = await client.getClientById({ pathParams: { id: 'client-1' } });
    expect(res.status).toBe(200);
    expect(res.data.id).toBeDefined();
  });

  it('GET /api/clients/{clientId}/hard-drives (paginated)', async () => {
    const res = await client.getClientHardDrives({
      pathParams: { clientId: 'client-1' },
      queryParams: { page: 1, pageSize: 10 },
    });
    expect(res.status).toBe(200);
  });

  it('GET /api/clients/{clientId}/network-cards (paginated)', async () => {
    const res = await client.getClientNetworkCards({
      pathParams: { clientId: 'client-1' },
      queryParams: { page: 1, pageSize: 10 },
    });
    expect(res.status).toBe(200);
  });

  it('GET /api/clients/{clientId}/installed-software (paginated)', async () => {
    const res = await client.getClientInstalledSoftware({
      pathParams: { clientId: 'client-1' },
      queryParams: { page: 1, pageSize: 10 },
    });
    expect(res.status).toBe(200);
  });
});


