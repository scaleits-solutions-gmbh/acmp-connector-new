/**
 * Script to generate boundary mappers for ACMP Connector
 *
 * Run with: npx tsx scripts/generate-boundaries.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const BOUNDARIES_PATH = 'packages/business/boundaries/src';

// ============================================================================
// HELPERS
// ============================================================================

function toPascalCase(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`  📁 Created: ${dirPath}`);
  }
}

function writeFile(filePath: string, content: string): void {
  fs.writeFileSync(filePath, content);
  console.log(`  📄 Created: ${filePath}`);
}

// ============================================================================
// MAPPER DEFINITIONS
// ============================================================================

interface MapperDef {
  resource: string;
  operation: string;
  httpEndpoint: string;
  type: 'query' | 'command';
  bcInClass: string;
  bcOutClass: string;
  httpRequestType: string;
  httpResponseType: string;
  requestMapperBody: string;
  responseMapperBody: string;
}

const mappers: MapperDef[] = [
  // CLIENTS
  {
    resource: 'clients',
    operation: 'find-paginated-clients',
    httpEndpoint: 'get-clients',
    type: 'query',
    bcInClass: 'FindPaginatedClientsIn',
    bcOutClass: 'FindPaginatedClientsOut',
    httpRequestType: 'GetClientsHttpRequest',
    httpResponseType: 'GetClientsHttpResponse',
    requestMapperBody: `return FindPaginatedClientsIn.create({
    paginationOptions: {
      page: request.queryParams.page,
      pageSize: request.queryParams.pageSize,
    },
    filters: {
      searchTerm: request.queryParams.searchTerm,
      tenantId: request.queryParams.tenantId,
    },
  });`,
    responseMapperBody: `return {
    statusCode: 200,
    body: {
      data: response.data,
      total: response.total,
      page: response.page,
      pageSize: response.pageSize,
      totalPages: response.totalPages,
    },
  };`,
  },
  {
    resource: 'clients',
    operation: 'find-client-by-id',
    httpEndpoint: 'get-client-by-id',
    type: 'query',
    bcInClass: 'FindClientByIdIn',
    bcOutClass: 'FindClientByIdOut',
    httpRequestType: 'GetClientByIdHttpRequest',
    httpResponseType: 'GetClientByIdHttpResponse',
    requestMapperBody: `return FindClientByIdIn.create({
    id: request.pathParams.id,
  });`,
    responseMapperBody: `return {
    statusCode: 200,
    body: response.client,
  };`,
  },

  // CLIENT HARD DRIVES
  {
    resource: 'client-hard-drives',
    operation: 'find-paginated-client-hard-drives',
    httpEndpoint: 'get-client-hard-drives',
    type: 'query',
    bcInClass: 'FindPaginatedClientHardDrivesIn',
    bcOutClass: 'FindPaginatedClientHardDrivesOut',
    httpRequestType: 'GetClientHardDrivesHttpRequest',
    httpResponseType: 'GetClientHardDrivesHttpResponse',
    requestMapperBody: `return FindPaginatedClientHardDrivesIn.create({
    clientId: request.pathParams.clientId,
    paginationOptions: {
      page: request.queryParams.page,
      pageSize: request.queryParams.pageSize,
    },
  });`,
    responseMapperBody: `return {
    statusCode: 200,
    body: {
      data: response.data,
      total: response.total,
      page: response.page,
      pageSize: response.pageSize,
      totalPages: response.totalPages,
    },
  };`,
  },

  // CLIENT NETWORK CARDS
  {
    resource: 'client-network-cards',
    operation: 'find-paginated-client-network-cards',
    httpEndpoint: 'get-client-network-cards',
    type: 'query',
    bcInClass: 'FindPaginatedClientNetworkCardsIn',
    bcOutClass: 'FindPaginatedClientNetworkCardsOut',
    httpRequestType: 'GetClientNetworkCardsHttpRequest',
    httpResponseType: 'GetClientNetworkCardsHttpResponse',
    requestMapperBody: `return FindPaginatedClientNetworkCardsIn.create({
    clientId: request.pathParams.clientId,
    paginationOptions: {
      page: request.queryParams.page,
      pageSize: request.queryParams.pageSize,
    },
  });`,
    responseMapperBody: `return {
    statusCode: 200,
    body: {
      data: response.data,
      total: response.total,
      page: response.page,
      pageSize: response.pageSize,
      totalPages: response.totalPages,
    },
  };`,
  },

  // CLIENT INSTALLED SOFTWARE
  {
    resource: 'client-installed-software',
    operation: 'find-paginated-client-installed-software',
    httpEndpoint: 'get-client-installed-software',
    type: 'query',
    bcInClass: 'FindPaginatedClientInstalledSoftwareIn',
    bcOutClass: 'FindPaginatedClientInstalledSoftwareOut',
    httpRequestType: 'GetClientInstalledSoftwareHttpRequest',
    httpResponseType: 'GetClientInstalledSoftwareHttpResponse',
    requestMapperBody: `return FindPaginatedClientInstalledSoftwareIn.create({
    clientId: request.pathParams.clientId,
    paginationOptions: {
      page: request.queryParams.page,
      pageSize: request.queryParams.pageSize,
    },
    filters: {
      searchTerm: request.queryParams.search,
    },
  });`,
    responseMapperBody: `return {
    statusCode: 200,
    body: {
      data: response.data,
      total: response.total,
      page: response.page,
      pageSize: response.pageSize,
      totalPages: response.totalPages,
    },
  };`,
  },

  // JOBS
  {
    resource: 'jobs',
    operation: 'find-paginated-jobs',
    httpEndpoint: 'get-jobs',
    type: 'query',
    bcInClass: 'FindPaginatedJobsIn',
    bcOutClass: 'FindPaginatedJobsOut',
    httpRequestType: 'GetJobsHttpRequest',
    httpResponseType: 'GetJobsHttpResponse',
    requestMapperBody: `return FindPaginatedJobsIn.create({
    paginationOptions: {
      page: request.queryParams.page,
      pageSize: request.queryParams.pageSize,
    },
    filters: {
      searchTerm: request.queryParams.search,
    },
  });`,
    responseMapperBody: `return {
    statusCode: 200,
    body: {
      data: response.data,
      total: response.total,
      page: response.page,
      pageSize: response.pageSize,
      totalPages: response.totalPages,
    },
  };`,
  },

  // TICKETS
  {
    resource: 'tickets',
    operation: 'find-paginated-tickets',
    httpEndpoint: 'get-tickets',
    type: 'query',
    bcInClass: 'FindPaginatedTicketsIn',
    bcOutClass: 'FindPaginatedTicketsOut',
    httpRequestType: 'GetTicketsHttpRequest',
    httpResponseType: 'GetTicketsHttpResponse',
    requestMapperBody: `return FindPaginatedTicketsIn.create({
    paginationOptions: {
      page: request.queryParams.page,
      pageSize: request.queryParams.pageSize,
    },
    filters: {
      searchTerm: request.queryParams.search,
    },
  });`,
    responseMapperBody: `return {
    statusCode: 200,
    body: {
      data: response.data,
      total: response.total,
      page: response.page,
      pageSize: response.pageSize,
      totalPages: response.totalPages,
    },
  };`,
  },
  {
    resource: 'tickets',
    operation: 'find-ticket-by-id',
    httpEndpoint: 'get-ticket-by-id',
    type: 'query',
    bcInClass: 'FindTicketByIdIn',
    bcOutClass: 'FindTicketByIdOut',
    httpRequestType: 'GetTicketByIdHttpRequest',
    httpResponseType: 'GetTicketByIdHttpResponse',
    requestMapperBody: `return FindTicketByIdIn.create({
    id: request.pathParams.id,
  });`,
    responseMapperBody: `return {
    statusCode: 200,
    body: response.ticket,
  };`,
  },

  // ASSETS
  {
    resource: 'assets',
    operation: 'find-paginated-assets',
    httpEndpoint: 'get-assets',
    type: 'query',
    bcInClass: 'FindPaginatedAssetsIn',
    bcOutClass: 'FindPaginatedAssetsOut',
    httpRequestType: 'GetAssetsHttpRequest',
    httpResponseType: 'GetAssetsHttpResponse',
    requestMapperBody: `return FindPaginatedAssetsIn.create({
    paginationOptions: {
      page: request.queryParams.page,
      pageSize: request.queryParams.pageSize,
    },
    filters: {
      searchTerm: request.queryParams.search,
      assetType: request.queryParams.assetType,
    },
  });`,
    responseMapperBody: `return {
    statusCode: 200,
    body: {
      data: response.data,
      total: response.total,
      page: response.page,
      pageSize: response.pageSize,
      totalPages: response.totalPages,
    },
  };`,
  },
  {
    resource: 'assets',
    operation: 'find-asset-by-id',
    httpEndpoint: 'get-asset-by-id',
    type: 'query',
    bcInClass: 'FindAssetByIdIn',
    bcOutClass: 'FindAssetByIdOut',
    httpRequestType: 'GetAssetByIdHttpRequest',
    httpResponseType: 'GetAssetByIdHttpResponse',
    requestMapperBody: `return FindAssetByIdIn.create({
    id: request.pathParams.id,
  });`,
    responseMapperBody: `return {
    statusCode: 200,
    body: response.asset,
  };`,
  },
  {
    resource: 'assets',
    operation: 'find-asset-types',
    httpEndpoint: 'get-asset-types',
    type: 'query',
    bcInClass: 'FindAssetTypesIn',
    bcOutClass: 'FindAssetTypesOut',
    httpRequestType: 'GetAssetTypesHttpRequest',
    httpResponseType: 'GetAssetTypesHttpResponse',
    requestMapperBody: `return FindAssetTypesIn.create({});`,
    responseMapperBody: `return {
    statusCode: 200,
    body: response.assetTypes,
  };`,
  },

  // CLIENT COMMANDS
  {
    resource: 'client-commands',
    operation: 'find-paginated-client-commands',
    httpEndpoint: 'get-client-commands',
    type: 'query',
    bcInClass: 'FindPaginatedClientCommandsIn',
    bcOutClass: 'FindPaginatedClientCommandsOut',
    httpRequestType: 'GetClientCommandsHttpRequest',
    httpResponseType: 'GetClientCommandsHttpResponse',
    requestMapperBody: `return FindPaginatedClientCommandsIn.create({
    paginationOptions: {
      page: request.queryParams.page,
      pageSize: request.queryParams.pageSize,
    },
    filters: {
      searchTerm: request.queryParams.search,
    },
  });`,
    responseMapperBody: `return {
    statusCode: 200,
    body: {
      data: response.data,
      total: response.total,
      page: response.page,
      pageSize: response.pageSize,
      totalPages: response.totalPages,
    },
  };`,
  },
  {
    resource: 'client-commands',
    operation: 'find-client-command-by-id',
    httpEndpoint: 'get-client-command-by-id',
    type: 'query',
    bcInClass: 'FindClientCommandByIdIn',
    bcOutClass: 'FindClientCommandByIdOut',
    httpRequestType: 'GetClientCommandByIdHttpRequest',
    httpResponseType: 'GetClientCommandByIdHttpResponse',
    requestMapperBody: `return FindClientCommandByIdIn.create({
    id: request.pathParams.id,
  });`,
    responseMapperBody: `return {
    statusCode: 200,
    body: response.clientCommand,
  };`,
  },

  // ROLLOUT TEMPLATES
  {
    resource: 'rollout-templates',
    operation: 'find-paginated-rollout-templates',
    httpEndpoint: 'get-rollouts',
    type: 'query',
    bcInClass: 'FindPaginatedRolloutTemplatesIn',
    bcOutClass: 'FindPaginatedRolloutTemplatesOut',
    httpRequestType: 'GetRolloutsHttpRequest',
    httpResponseType: 'GetRolloutsHttpResponse',
    requestMapperBody: `return FindPaginatedRolloutTemplatesIn.create({
    paginationOptions: {
      page: request.queryParams.page,
      pageSize: request.queryParams.pageSize,
    },
    filters: {
      searchTerm: request.queryParams.search,
    },
  });`,
    responseMapperBody: `return {
    statusCode: 200,
    body: {
      data: response.data,
      total: response.total,
      page: response.page,
      pageSize: response.pageSize,
      totalPages: response.totalPages,
    },
  };`,
  },
  {
    resource: 'rollout-templates',
    operation: 'find-rollout-template-by-id',
    httpEndpoint: 'get-rollout-by-id',
    type: 'query',
    bcInClass: 'FindRolloutTemplateByIdIn',
    bcOutClass: 'FindRolloutTemplateByIdOut',
    httpRequestType: 'GetRolloutByIdHttpRequest',
    httpResponseType: 'GetRolloutByIdHttpResponse',
    requestMapperBody: `return FindRolloutTemplateByIdIn.create({
    id: request.pathParams.id,
  });`,
    responseMapperBody: `return {
    statusCode: 200,
    body: response.rolloutTemplate,
  };`,
  },
];

// ============================================================================
// GENERATORS
// ============================================================================

function generateRequestMapper(m: MapperDef): string {
  return `import { ${m.bcInClass} } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { ${m.httpRequestType} } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function ${toCamelCase(m.operation)}HttpRequestMapper(request: ${m.httpRequestType}): ${m.bcInClass} {
  ${m.requestMapperBody}
}
`;
}

function generateResponseMapper(m: MapperDef): string {
  return `import { ${m.bcOutClass} } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { ${m.httpResponseType} } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function ${toCamelCase(m.operation)}HttpResponseMapper(response: ${m.bcOutClass}): ${m.httpResponseType} {
  ${m.responseMapperBody}
}
`;
}

function generateHttpIndex(m: MapperDef): string {
  return `export * from './${m.operation}.http-request-mapper';
export * from './${m.operation}.http-response-mapper';
`;
}

function generateOperationIndex(): string {
  return `export * from './http';
`;
}

// ============================================================================
// MAIN
// ============================================================================

function main(): void {
  console.log('🚀 Generating Boundary Mappers for ACMP Connector\n');

  const mappersPath = path.join(BOUNDARIES_PATH, 'mappers');
  ensureDir(mappersPath);

  // Group mappers by resource
  const byResource = mappers.reduce((acc, m) => {
    if (!acc[m.resource]) acc[m.resource] = [];
    acc[m.resource].push(m);
    return acc;
  }, {} as Record<string, MapperDef[]>);

  const resources = Object.keys(byResource);

  for (const resource of resources) {
    console.log(`\n📦 Processing resource: ${resource}`);
    const resourceMappers = byResource[resource];

    const queriesPath = path.join(mappersPath, resource, 'queries');
    ensureDir(queriesPath);

    for (const m of resourceMappers) {
      console.log(`  📝 Creating mapper: ${m.operation}`);
      const operationPath = path.join(queriesPath, m.operation);
      const httpPath = path.join(operationPath, 'http');
      ensureDir(httpPath);

      // Write mapper files
      writeFile(path.join(httpPath, `${m.operation}.http-request-mapper.ts`), generateRequestMapper(m));
      writeFile(path.join(httpPath, `${m.operation}.http-response-mapper.ts`), generateResponseMapper(m));
      writeFile(path.join(httpPath, 'index.ts'), generateHttpIndex(m));
      writeFile(path.join(operationPath, 'index.ts'), generateOperationIndex());
    }

    // Resource queries index
    const queriesIndexContent = resourceMappers.map(m => `export * from './${m.operation}';`).join('\n') + '\n';
    writeFile(path.join(queriesPath, 'index.ts'), queriesIndexContent);

    // Resource index
    writeFile(path.join(mappersPath, resource, 'index.ts'), `export * from './queries';\n`);
  }

  // Main mappers index
  const mappersIndexContent = resources.map(r => `export * from './${r}';`).join('\n') + '\n';
  writeFile(path.join(mappersPath, 'index.ts'), mappersIndexContent);

  // Main src index
  writeFile(path.join(BOUNDARIES_PATH, 'index.ts'), `export * from './mappers';\n`);

  console.log('\n✅ Boundary mappers generation complete!');
  console.log(`\n📊 Summary:`);
  console.log(`   Resources: ${resources.length}`);
  console.log(`   Mappers: ${mappers.length}`);
}

main();
