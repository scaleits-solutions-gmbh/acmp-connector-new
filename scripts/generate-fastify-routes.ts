import * as fs from 'fs';
import * as path from 'path';

const APP_PATH = path.join(__dirname, '../apps/fastify/api/src');

interface RouteConfig {
  resource: string;
  folder: string;
  operations: {
    name: string;
    type: 'query' | 'command';
    httpMethod: 'GET' | 'POST' | 'PUT' | 'DELETE';
    hasPathParams: boolean;
    pathParam?: string;
    metadataImport: string;
    schemaImport?: string;
    primaryPortImport: string;
    mapperImports: { request: string; response: string };
  }[];
}

const routes: RouteConfig[] = [
  {
    resource: 'clients',
    folder: 'clients',
    operations: [
      {
        name: 'find-paginated-clients',
        type: 'query',
        httpMethod: 'GET',
        hasPathParams: false,
        metadataImport: 'getClientsHttpMetadata',
        schemaImport: 'getClientsHttpQueryParamsRequestSchema',
        primaryPortImport: 'FindPaginatedClientsQueryPrimaryPort',
        mapperImports: {
          request: 'findPaginatedClientsHttpRequestMapper',
          response: 'findPaginatedClientsHttpResponseMapper',
        },
      },
      {
        name: 'find-client-by-id',
        type: 'query',
        httpMethod: 'GET',
        hasPathParams: true,
        pathParam: 'id',
        metadataImport: 'getClientByIdHttpMetadata',
        primaryPortImport: 'FindClientByIdQueryPrimaryPort',
        mapperImports: {
          request: 'findClientByIdHttpRequestMapper',
          response: 'findClientByIdHttpResponseMapper',
        },
      },
    ],
  },
  {
    resource: 'client-hard-drives',
    folder: 'clients',
    operations: [
      {
        name: 'find-paginated-client-hard-drives',
        type: 'query',
        httpMethod: 'GET',
        hasPathParams: true,
        pathParam: 'clientId',
        metadataImport: 'getClientHardDrivesHttpMetadata',
        schemaImport: 'getClientHardDrivesHttpQueryParamsRequestSchema',
        primaryPortImport: 'FindPaginatedClientHardDrivesQueryPrimaryPort',
        mapperImports: {
          request: 'findPaginatedClientHardDrivesHttpRequestMapper',
          response: 'findPaginatedClientHardDrivesHttpResponseMapper',
        },
      },
    ],
  },
  {
    resource: 'client-network-cards',
    folder: 'clients',
    operations: [
      {
        name: 'find-paginated-client-network-cards',
        type: 'query',
        httpMethod: 'GET',
        hasPathParams: true,
        pathParam: 'clientId',
        metadataImport: 'getClientNetworkCardsHttpMetadata',
        schemaImport: 'getClientNetworkCardsHttpQueryParamsRequestSchema',
        primaryPortImport: 'FindPaginatedClientNetworkCardsQueryPrimaryPort',
        mapperImports: {
          request: 'findPaginatedClientNetworkCardsHttpRequestMapper',
          response: 'findPaginatedClientNetworkCardsHttpResponseMapper',
        },
      },
    ],
  },
  {
    resource: 'client-installed-software',
    folder: 'clients',
    operations: [
      {
        name: 'find-paginated-client-installed-software',
        type: 'query',
        httpMethod: 'GET',
        hasPathParams: true,
        pathParam: 'clientId',
        metadataImport: 'getClientInstalledSoftwareHttpMetadata',
        schemaImport: 'getClientInstalledSoftwareHttpQueryParamsRequestSchema',
        primaryPortImport: 'FindPaginatedClientInstalledSoftwareQueryPrimaryPort',
        mapperImports: {
          request: 'findPaginatedClientInstalledSoftwareHttpRequestMapper',
          response: 'findPaginatedClientInstalledSoftwareHttpResponseMapper',
        },
      },
    ],
  },
  {
    resource: 'jobs',
    folder: 'jobs',
    operations: [
      {
        name: 'find-paginated-jobs',
        type: 'query',
        httpMethod: 'GET',
        hasPathParams: false,
        metadataImport: 'getJobsHttpMetadata',
        schemaImport: 'getJobsHttpQueryParamsRequestSchema',
        primaryPortImport: 'FindPaginatedJobsQueryPrimaryPort',
        mapperImports: {
          request: 'findPaginatedJobsHttpRequestMapper',
          response: 'findPaginatedJobsHttpResponseMapper',
        },
      },
    ],
  },
  {
    resource: 'tickets',
    folder: 'tickets',
    operations: [
      {
        name: 'find-paginated-tickets',
        type: 'query',
        httpMethod: 'GET',
        hasPathParams: false,
        metadataImport: 'getTicketsHttpMetadata',
        schemaImport: 'getTicketsHttpQueryParamsRequestSchema',
        primaryPortImport: 'FindPaginatedTicketsQueryPrimaryPort',
        mapperImports: {
          request: 'findPaginatedTicketsHttpRequestMapper',
          response: 'findPaginatedTicketsHttpResponseMapper',
        },
      },
      {
        name: 'find-ticket-by-id',
        type: 'query',
        httpMethod: 'GET',
        hasPathParams: true,
        pathParam: 'id',
        metadataImport: 'getTicketByIdHttpMetadata',
        primaryPortImport: 'FindTicketByIdQueryPrimaryPort',
        mapperImports: {
          request: 'findTicketByIdHttpRequestMapper',
          response: 'findTicketByIdHttpResponseMapper',
        },
      },
    ],
  },
  {
    resource: 'assets',
    folder: 'assets',
    operations: [
      {
        name: 'find-paginated-assets',
        type: 'query',
        httpMethod: 'GET',
        hasPathParams: false,
        metadataImport: 'getAssetsHttpMetadata',
        schemaImport: 'getAssetsHttpQueryParamsRequestSchema',
        primaryPortImport: 'FindPaginatedAssetsQueryPrimaryPort',
        mapperImports: {
          request: 'findPaginatedAssetsHttpRequestMapper',
          response: 'findPaginatedAssetsHttpResponseMapper',
        },
      },
      {
        name: 'find-asset-by-id',
        type: 'query',
        httpMethod: 'GET',
        hasPathParams: true,
        pathParam: 'id',
        metadataImport: 'getAssetByIdHttpMetadata',
        primaryPortImport: 'FindAssetByIdQueryPrimaryPort',
        mapperImports: {
          request: 'findAssetByIdHttpRequestMapper',
          response: 'findAssetByIdHttpResponseMapper',
        },
      },
      {
        name: 'find-asset-types',
        type: 'query',
        httpMethod: 'GET',
        hasPathParams: false,
        metadataImport: 'getAssetTypesHttpMetadata',
        primaryPortImport: 'FindAssetTypesQueryPrimaryPort',
        mapperImports: {
          request: 'findAssetTypesHttpRequestMapper',
          response: 'findAssetTypesHttpResponseMapper',
        },
      },
    ],
  },
  {
    resource: 'client-commands',
    folder: 'client-commands',
    operations: [
      {
        name: 'find-paginated-client-commands',
        type: 'query',
        httpMethod: 'GET',
        hasPathParams: false,
        metadataImport: 'getClientCommandsHttpMetadata',
        schemaImport: 'getClientCommandsHttpQueryParamsRequestSchema',
        primaryPortImport: 'FindPaginatedClientCommandsQueryPrimaryPort',
        mapperImports: {
          request: 'findPaginatedClientCommandsHttpRequestMapper',
          response: 'findPaginatedClientCommandsHttpResponseMapper',
        },
      },
      {
        name: 'find-client-command-by-id',
        type: 'query',
        httpMethod: 'GET',
        hasPathParams: true,
        pathParam: 'id',
        metadataImport: 'getClientCommandByIdHttpMetadata',
        primaryPortImport: 'FindClientCommandByIdQueryPrimaryPort',
        mapperImports: {
          request: 'findClientCommandByIdHttpRequestMapper',
          response: 'findClientCommandByIdHttpResponseMapper',
        },
      },
    ],
  },
  {
    resource: 'rollout-templates',
    folder: 'rollout-templates',
    operations: [
      {
        name: 'find-paginated-rollout-templates',
        type: 'query',
        httpMethod: 'GET',
        hasPathParams: false,
        metadataImport: 'getRolloutsHttpMetadata',
        schemaImport: 'getRolloutsHttpQueryParamsRequestSchema',
        primaryPortImport: 'FindPaginatedRolloutTemplatesQueryPrimaryPort',
        mapperImports: {
          request: 'findPaginatedRolloutTemplatesHttpRequestMapper',
          response: 'findPaginatedRolloutTemplatesHttpResponseMapper',
        },
      },
      {
        name: 'find-rollout-template-by-id',
        type: 'query',
        httpMethod: 'GET',
        hasPathParams: true,
        pathParam: 'id',
        metadataImport: 'getRolloutByIdHttpMetadata',
        primaryPortImport: 'FindRolloutTemplateByIdQueryPrimaryPort',
        mapperImports: {
          request: 'findRolloutTemplateByIdHttpRequestMapper',
          response: 'findRolloutTemplateByIdHttpResponseMapper',
        },
      },
    ],
  },
];

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

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function generateHandler(op: RouteConfig['operations'][0]): string {
  const pascalName = toPascalCase(op.name);
  const camelName = toCamelCase(op.name);

  const requestMapperArg = op.hasPathParams
    ? `{
      pathParams: { ${op.pathParam}: request.params.${op.pathParam} },
      queryParams: request.query as Record<string, unknown>,
    }`
    : `{
      queryParams: request.query as Record<string, unknown>,
    }`;

  return `import { FastifyReply, FastifyRequest } from 'fastify';
import {
  ${op.mapperImports.request},
  ${op.mapperImports.response},
} from '@repo/business/boundaries';
import { ${op.primaryPortImport} } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';

export function create${pascalName}Handler(
  query: ${op.primaryPortImport},
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const input = ${op.mapperImports.request}(${requestMapperArg});

    const output = await query.execute(input);
    const response = ${op.mapperImports.response}(output);

    return reply.status(response.statusCode).send(response.body);
  };
}
`;
}

function generateRouteFile(config: RouteConfig): string {
  const imports: string[] = [
    `import { FastifyInstance } from 'fastify';`,
    `import { ZodTypeProvider } from 'fastify-type-provider-zod';`,
  ];

  // Collect all imports from common-kit
  const commonKitImports: string[] = [];
  config.operations.forEach((op) => {
    commonKitImports.push(op.metadataImport);
    if (op.schemaImport) {
      commonKitImports.push(op.schemaImport);
    }
  });
  imports.push(
    `import {\n  ${commonKitImports.join(',\n  ')},\n} from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';`
  );

  // Collect all BC imports
  const bcImports: string[] = config.operations.map((op) => op.primaryPortImport);
  imports.push(
    `import {\n  ${bcImports.join(',\n  ')},\n} from '@repo/business/bounded-contexts/acmp-connector-bounded-context';`
  );

  // Handler imports
  const handlerImports = config.operations.map((op) => {
    const pascalName = toPascalCase(op.name);
    return `import { create${pascalName}Handler } from '../../handlers/${config.folder}/${op.name}.handler';`;
  });
  imports.push(...handlerImports);

  // Generate route function params
  const paramTypes = config.operations.map((op) => {
    const camelName = toCamelCase(op.name);
    return `${camelName}Query: ${op.primaryPortImport}`;
  });

  // Generate route registrations
  const routeRegistrations = config.operations.map((op) => {
    const camelName = toCamelCase(op.name);
    const schemaBlock = op.schemaImport
      ? `
    schema: {
      querystring: ${op.schemaImport},
    },`
      : '';

    return `  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: ${op.metadataImport}.method,
    url: ${op.metadataImport}.path,${schemaBlock}
    handler: create${toPascalCase(op.name)}Handler(${camelName}Query),
  });`;
  });

  const resourceName = toCamelCase(config.resource.replace(/-/g, ' ').replace(/ /g, ''));

  return `${imports.join('\n')}

export async function ${resourceName}Routes(
  fastify: FastifyInstance,
  ${paramTypes.join(',\n  ')},
) {
${routeRegistrations.join('\n\n')}
}
`;
}

function main(): void {
  console.log('🚀 Generating Fastify routes and handlers\n');

  // Group routes by folder
  const byFolder = routes.reduce(
    (acc, config) => {
      if (!acc[config.folder]) acc[config.folder] = [];
      acc[config.folder].push(config);
      return acc;
    },
    {} as Record<string, RouteConfig[]>
  );

  for (const [folder, configs] of Object.entries(byFolder)) {
    console.log(`📦 Processing folder: ${folder}`);

    // Create handlers directory
    const handlersDir = path.join(APP_PATH, 'presentation', 'handlers', folder);
    ensureDir(handlersDir);

    // Create routes directory
    const routesDir = path.join(APP_PATH, 'presentation', 'routes', folder);
    ensureDir(routesDir);

    // Generate handlers
    for (const config of configs) {
      for (const op of config.operations) {
        const handlerPath = path.join(handlersDir, `${op.name}.handler.ts`);
        if (!fs.existsSync(handlerPath)) {
          fs.writeFileSync(handlerPath, generateHandler(op));
          console.log(`  ✅ Created handler: ${op.name}.handler.ts`);
        } else {
          console.log(`  ⏭️  Skipped handler (exists): ${op.name}.handler.ts`);
        }
      }
    }

    // Generate handlers index
    const handlerExports = configs
      .flatMap((c) => c.operations)
      .map((op) => `export * from './${op.name}.handler';`)
      .join('\n');
    fs.writeFileSync(path.join(handlersDir, 'index.ts'), handlerExports + '\n');
    console.log(`  ✅ Created handlers/index.ts`);

    // Generate route file (one per folder)
    const routeFileName = `${folder}.routes.ts`;
    const routePath = path.join(routesDir, routeFileName);

    // Merge all configs for this folder into one route file
    const mergedConfig: RouteConfig = {
      resource: folder,
      folder: folder,
      operations: configs.flatMap((c) => c.operations),
    };

    fs.writeFileSync(routePath, generateRouteFile(mergedConfig));
    console.log(`  ✅ Created route: ${routeFileName}`);

    // Generate routes index
    fs.writeFileSync(path.join(routesDir, 'index.ts'), `export * from './${folder}.routes';\n`);
    console.log(`  ✅ Created routes/index.ts`);
  }

  // Generate main routes index
  const folders = Object.keys(byFolder);
  const mainRoutesIndex = folders.map((f) => `export * from './${f}';`).join('\n') + '\n';
  fs.writeFileSync(path.join(APP_PATH, 'presentation', 'routes', 'index.ts'), mainRoutesIndex);
  console.log(`\n✅ Created main routes/index.ts`);

  // Generate main handlers index
  const mainHandlersIndex = folders.map((f) => `export * from './${f}';`).join('\n') + '\n';
  fs.writeFileSync(path.join(APP_PATH, 'presentation', 'handlers', 'index.ts'), mainHandlersIndex);
  console.log(`✅ Created main handlers/index.ts`);

  console.log('\n✨ Done! Generated all routes and handlers.');
}

main();

