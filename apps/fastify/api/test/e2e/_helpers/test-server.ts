import type { FastifyInstance } from 'fastify';
import { bootstrapApp } from '../../../src/bootstrap/app.bootstrap';
import type { UseCases } from '../../../src/bootstrap/use-cases.bootstrap';

function createStub(output: unknown) {
  // We intentionally loosen typing in e2e fakes: the HTTP handlers map whatever
  // the use-cases return, and these tests focus on HTTP contract/auth wiring.
  return {
    async execute(_input: unknown) {
      return output as never;
    },
  };
}

export type StartedTestServer = {
  app: FastifyInstance;
  baseUrl: string;
  apiKey: string;
};

export async function startTestServer(): Promise<StartedTestServer> {
  const apiKey = process.env.API_KEY ?? 'e2e-test-key';
  process.env.API_KEY = apiKey;
  process.env.NODE_ENV = process.env.NODE_ENV ?? 'test';

  const emptyPage = {
    data: [] as unknown[],
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
  };

  const nowIso = new Date().toISOString();

  // Minimal valid read-model fixtures (enough to satisfy Zod contract schemas)
  const client = {
    id: 'client-1',
    clientNo: 1,
    domainFqdn: 'example.local',
    name: 'Client 1',
    tenantId: 'tenant-1',
    tenantName: 'Tenant 1',
    lastUpdate: nowIso,
    osInstallationDate: nowIso,
    manufacturer: 'ACME',
    model: 'Model X',
    cpu: 'CPU',
    cpuCoreCount: 4,
    cpuThreadCount: 8,
    ram: '16 GB',
    hasBattery: false,
    batteryName: 'N/A',
    osName: 'OS',
    osArchitecture: 'x64',
    osDisplayVersion: '1.0',
    osPatchLevel: 1,
    installedAcmpVersion: '1.0.0',
  };

  const asset = {
    id: 'asset-1',
    name: 'Asset 1',
    assetName: 'Asset 1',
    creationDate: nowIso,
    lastUpdate: nowIso,
    lastModifiedDate: nowIso,
    isLent: false,
  };

  const ticket = {
    id: 'ticket-1',
    intId: 1,
    caption: 'Ticket 1',
    creationDate: nowIso,
    lastModified: nowIso,
    priority: 1,
  };

  const clientCommand = {
    id: 'cmd-1',
    name: 'Command 1',
    version: 1,
  };

  const rolloutTemplate = {
    id: 'rt-1',
    name: 'Rollout Template 1',
    os: 'Windows',
  };

  // We inject fakes so e2e can run without MSSQL/SICS dependencies.
  const useCases: UseCases = {
    // Clients
    findPaginatedClientsQuery: createStub(emptyPage),
    findClientByIdQuery: createStub({ client }),
    findPaginatedClientHardDrivesQuery: createStub(emptyPage),
    findPaginatedClientNetworkCardsQuery: createStub(emptyPage),
    findPaginatedClientInstalledSoftwareQuery: createStub(emptyPage),

    // Jobs
    findPaginatedJobsQuery: createStub(emptyPage),

    // Tickets
    findPaginatedTicketsQuery: createStub(emptyPage),
    findTicketByIdQuery: createStub({ ticket }),

    // Assets
    findPaginatedAssetsQuery: createStub(emptyPage),
    findAssetByIdQuery: createStub({ asset }),
    findAssetTypesQuery: createStub({ assetTypes: [] }),

    // Client Commands
    findPaginatedClientCommandsQuery: createStub(emptyPage),
    findClientCommandByIdQuery: createStub({ clientCommand }),
    pushClientCommandCommand: createStub({ success: true, jobId: 'job-1' }),

    // Rollout Templates
    findPaginatedRolloutTemplatesQuery: createStub(emptyPage),
    findRolloutTemplateByIdQuery: createStub({ rolloutTemplate }),
    pushRolloutTemplateCommand: createStub({ success: true, jobId: 'job-1' }),
  };

  const app = await bootstrapApp({ useCases, logger: false });

  await app.listen({ host: '127.0.0.1', port: 0 });

  const address = app.server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Failed to determine server address');
  }

  return {
    app,
    baseUrl: `http://127.0.0.1:${address.port}`,
    apiKey,
  };
}

export async function stopTestServer(server: StartedTestServer) {
  await server.app.close();
}


