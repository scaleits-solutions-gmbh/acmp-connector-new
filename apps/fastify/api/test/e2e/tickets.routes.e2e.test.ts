import { describe, expect, it } from 'vitest';
import { createAcmpConnectorClient } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { getE2eApiKey, getE2eBaseUrl } from './_helpers/e2e-env';

describe('Tickets routes (e2e)', () => {
  const client = createAcmpConnectorClient({
    baseUrl: getE2eBaseUrl(),
    auth: { type: 'api-key', header: 'x-api-key', key: getE2eApiKey() },
  });

  it('GET /api/tickets (paginated)', async () => {
    const res = await client.getTickets({ queryParams: { page: 1, pageSize: 10 } });
    expect(res.status).toBe(200);
  });

  it('GET /api/tickets/{id}', async () => {
    const res = await client.getTicketById({ pathParams: { id: 'ticket-1' } });
    expect(res.status).toBe(200);
    expect(res.data.id).toBeDefined();
  });
});


