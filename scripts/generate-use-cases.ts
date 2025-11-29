/**
 * Script to generate all use case implementations for the ACMP Connector bounded context
 *
 * Run with: npx tsx scripts/generate-use-cases.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const BC_PATH =
  'packages/business/bounded-contexts/acmp-connector-bounded-context/src/application/use-cases';

// ============================================================================
// HELPER FUNCTIONS
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
// USE CASE DEFINITIONS
// ============================================================================

interface QueryUseCaseDefinition {
  name: string; // e.g., 'find-paginated-clients'
  resource: string; // e.g., 'clients'
  repositoryType: string; // e.g., 'ClientQueryRepositorySecondaryPort'
  repositoryImportPath: string; // e.g., 'clients/client.query-repository'
  repositoryMethod: string; // e.g., 'findPaginatedClients'
  repositoryMethodParams: string; // e.g., 'paginationOption, input.filters'
  hasPagination: boolean;
  hasFilters: boolean;
  filtersMapping?: string; // e.g., '{ searchTerm: input.filters?.searchTerm, tenantId: input.filters?.tenantId }'
  resultProperty?: string; // e.g., 'client' for single item, undefined for direct return
  requiresClientId?: boolean; // For client sub-resources like hard drives
}

interface CommandUseCaseDefinition {
  name: string; // e.g., 'push-client-command'
  resource: string; // e.g., 'client-commands'
  repositoryType: string; // e.g., 'ClientCommandWriteRepositorySecondaryPort'
  repositoryImportPath: string;
  repositoryMethod: string;
  repositoryMethodParams: string;
}

// ============================================================================
// CLIENTS USE CASES
// ============================================================================

const clientsQueries: QueryUseCaseDefinition[] = [
  {
    name: 'find-paginated-clients',
    resource: 'clients',
    repositoryType: 'ClientQueryRepositorySecondaryPort',
    repositoryImportPath: 'clients/client.query-repository',
    repositoryMethod: 'findPaginatedClients',
    repositoryMethodParams: 'paginationOption, filters',
    hasPagination: true,
    hasFilters: true,
    filtersMapping: `{
      searchTerm: input.filters?.searchTerm,
      tenantId: input.filters?.tenantId,
    }`,
  },
  {
    name: 'find-client-by-id',
    resource: 'clients',
    repositoryType: 'ClientQueryRepositorySecondaryPort',
    repositoryImportPath: 'clients/client.query-repository',
    repositoryMethod: 'findClientById',
    repositoryMethodParams: 'input.id',
    hasPagination: false,
    hasFilters: false,
    resultProperty: 'client',
  },
  {
    name: 'find-client-count',
    resource: 'clients',
    repositoryType: 'ClientQueryRepositorySecondaryPort',
    repositoryImportPath: 'clients/client.query-repository',
    repositoryMethod: 'findClientCount',
    repositoryMethodParams: 'filters',
    hasPagination: false,
    hasFilters: true,
    filtersMapping: `{
      searchTerm: input.filters?.searchTerm,
      tenantId: input.filters?.tenantId,
    }`,
  },
  {
    name: 'find-paginated-client-hard-drives',
    resource: 'clients',
    repositoryType: 'ClientHardDriveQueryRepositorySecondaryPort',
    repositoryImportPath: 'clients/client-hard-drive.query-repository',
    repositoryMethod: 'findPaginatedClientHardDrives',
    repositoryMethodParams: 'input.clientId, paginationOption',
    hasPagination: true,
    hasFilters: false,
    requiresClientId: true,
  },
  {
    name: 'find-client-hard-drive-count',
    resource: 'clients',
    repositoryType: 'ClientHardDriveQueryRepositorySecondaryPort',
    repositoryImportPath: 'clients/client-hard-drive.query-repository',
    repositoryMethod: 'findClientHardDriveCount',
    repositoryMethodParams: 'input.clientId',
    hasPagination: false,
    hasFilters: false,
    requiresClientId: true,
  },
  {
    name: 'find-paginated-client-network-cards',
    resource: 'clients',
    repositoryType: 'ClientNetworkCardQueryRepositorySecondaryPort',
    repositoryImportPath: 'clients/client-network-card.query-repository',
    repositoryMethod: 'findPaginatedClientNetworkCards',
    repositoryMethodParams: 'input.clientId, paginationOption',
    hasPagination: true,
    hasFilters: false,
    requiresClientId: true,
  },
  {
    name: 'find-client-network-card-count',
    resource: 'clients',
    repositoryType: 'ClientNetworkCardQueryRepositorySecondaryPort',
    repositoryImportPath: 'clients/client-network-card.query-repository',
    repositoryMethod: 'findClientNetworkCardCount',
    repositoryMethodParams: 'input.clientId',
    hasPagination: false,
    hasFilters: false,
    requiresClientId: true,
  },
  {
    name: 'find-paginated-client-installed-software',
    resource: 'clients',
    repositoryType: 'ClientInstalledSoftwareQueryRepositorySecondaryPort',
    repositoryImportPath: 'clients/client-installed-software.query-repository',
    repositoryMethod: 'findPaginatedClientInstalledSoftware',
    repositoryMethodParams: 'input.clientId, paginationOption, filters',
    hasPagination: true,
    hasFilters: true,
    filtersMapping: `{ searchTerm: input.filters?.searchTerm }`,
    requiresClientId: true,
  },
  {
    name: 'find-client-installed-software-count',
    resource: 'clients',
    repositoryType: 'ClientInstalledSoftwareQueryRepositorySecondaryPort',
    repositoryImportPath: 'clients/client-installed-software.query-repository',
    repositoryMethod: 'findClientInstalledSoftwareCount',
    repositoryMethodParams: 'input.clientId, filters',
    hasPagination: false,
    hasFilters: true,
    filtersMapping: `{ searchTerm: input.filters?.searchTerm }`,
    requiresClientId: true,
  },
];

// ============================================================================
// JOBS USE CASES
// ============================================================================

const jobsQueries: QueryUseCaseDefinition[] = [
  {
    name: 'find-paginated-jobs',
    resource: 'jobs',
    repositoryType: 'JobQueryRepositorySecondaryPort',
    repositoryImportPath: 'jobs/job.query-repository',
    repositoryMethod: 'findPaginatedJobs',
    repositoryMethodParams: 'paginationOption, filters',
    hasPagination: true,
    hasFilters: true,
    filtersMapping: `{
      searchTerm: input.filters?.searchTerm,
      kind: input.filters?.kind,
      origin: input.filters?.origin,
    }`,
  },
  {
    name: 'find-job-by-id',
    resource: 'jobs',
    repositoryType: 'JobQueryRepositorySecondaryPort',
    repositoryImportPath: 'jobs/job.query-repository',
    repositoryMethod: 'findJobById',
    repositoryMethodParams: 'input.id',
    hasPagination: false,
    hasFilters: false,
    resultProperty: 'job',
  },
  {
    name: 'find-job-count',
    resource: 'jobs',
    repositoryType: 'JobQueryRepositorySecondaryPort',
    repositoryImportPath: 'jobs/job.query-repository',
    repositoryMethod: 'findJobCount',
    repositoryMethodParams: 'filters',
    hasPagination: false,
    hasFilters: true,
    filtersMapping: `{
      searchTerm: input.filters?.searchTerm,
      kind: input.filters?.kind,
      origin: input.filters?.origin,
    }`,
  },
];

// ============================================================================
// TICKETS USE CASES
// ============================================================================

const ticketsQueries: QueryUseCaseDefinition[] = [
  {
    name: 'find-paginated-tickets',
    resource: 'tickets',
    repositoryType: 'TicketQueryRepositorySecondaryPort',
    repositoryImportPath: 'tickets/ticket.query-repository',
    repositoryMethod: 'findPaginatedTickets',
    repositoryMethodParams: 'paginationOption, filters',
    hasPagination: true,
    hasFilters: true,
    filtersMapping: `{ searchTerm: input.filters?.searchTerm }`,
  },
  {
    name: 'find-ticket-by-id',
    resource: 'tickets',
    repositoryType: 'TicketQueryRepositorySecondaryPort',
    repositoryImportPath: 'tickets/ticket.query-repository',
    repositoryMethod: 'findTicketById',
    repositoryMethodParams: 'input.id',
    hasPagination: false,
    hasFilters: false,
    resultProperty: 'ticket',
  },
  {
    name: 'find-ticket-details-by-id',
    resource: 'tickets',
    repositoryType: 'TicketQueryRepositorySecondaryPort',
    repositoryImportPath: 'tickets/ticket.query-repository',
    repositoryMethod: 'findTicketDetailsById',
    repositoryMethodParams: 'input.id',
    hasPagination: false,
    hasFilters: false,
    resultProperty: 'ticketDetails',
  },
  {
    name: 'find-ticket-count',
    resource: 'tickets',
    repositoryType: 'TicketQueryRepositorySecondaryPort',
    repositoryImportPath: 'tickets/ticket.query-repository',
    repositoryMethod: 'findTicketCount',
    repositoryMethodParams: 'filters',
    hasPagination: false,
    hasFilters: true,
    filtersMapping: `{ searchTerm: input.filters?.searchTerm }`,
  },
];

// ============================================================================
// ASSETS USE CASES
// ============================================================================

const assetsQueries: QueryUseCaseDefinition[] = [
  {
    name: 'find-paginated-assets',
    resource: 'assets',
    repositoryType: 'AssetQueryRepositorySecondaryPort',
    repositoryImportPath: 'assets/asset.query-repository',
    repositoryMethod: 'findPaginatedAssets',
    repositoryMethodParams: 'paginationOption, filters',
    hasPagination: true,
    hasFilters: true,
    filtersMapping: `{
      searchTerm: input.filters?.searchTerm,
      assetType: input.filters?.assetType,
    }`,
  },
  {
    name: 'find-asset-by-id',
    resource: 'assets',
    repositoryType: 'AssetQueryRepositorySecondaryPort',
    repositoryImportPath: 'assets/asset.query-repository',
    repositoryMethod: 'findAssetById',
    repositoryMethodParams: 'input.id',
    hasPagination: false,
    hasFilters: false,
    resultProperty: 'asset',
  },
  {
    name: 'find-asset-count',
    resource: 'assets',
    repositoryType: 'AssetQueryRepositorySecondaryPort',
    repositoryImportPath: 'assets/asset.query-repository',
    repositoryMethod: 'findAssetCount',
    repositoryMethodParams: 'filters',
    hasPagination: false,
    hasFilters: true,
    filtersMapping: `{
      searchTerm: input.filters?.searchTerm,
      assetType: input.filters?.assetType,
    }`,
  },
  {
    name: 'find-asset-types',
    resource: 'assets',
    repositoryType: 'AssetQueryRepositorySecondaryPort',
    repositoryImportPath: 'assets/asset.query-repository',
    repositoryMethod: 'findAssetTypes',
    repositoryMethodParams: '',
    hasPagination: false,
    hasFilters: false,
  },
];

// ============================================================================
// CLIENT COMMANDS USE CASES
// ============================================================================

const clientCommandsQueries: QueryUseCaseDefinition[] = [
  {
    name: 'find-paginated-client-commands',
    resource: 'client-commands',
    repositoryType: 'ClientCommandQueryRepositorySecondaryPort',
    repositoryImportPath: 'client-commands/client-command.query-repository',
    repositoryMethod: 'findPaginatedClientCommands',
    repositoryMethodParams: 'paginationOption, filters',
    hasPagination: true,
    hasFilters: true,
    filtersMapping: `{ searchTerm: input.filters?.searchTerm }`,
  },
  {
    name: 'find-client-command-by-id',
    resource: 'client-commands',
    repositoryType: 'ClientCommandQueryRepositorySecondaryPort',
    repositoryImportPath: 'client-commands/client-command.query-repository',
    repositoryMethod: 'findClientCommandById',
    repositoryMethodParams: 'input.id',
    hasPagination: false,
    hasFilters: false,
    resultProperty: 'clientCommand',
  },
  {
    name: 'find-client-command-count',
    resource: 'client-commands',
    repositoryType: 'ClientCommandQueryRepositorySecondaryPort',
    repositoryImportPath: 'client-commands/client-command.query-repository',
    repositoryMethod: 'findClientCommandCount',
    repositoryMethodParams: 'filters',
    hasPagination: false,
    hasFilters: true,
    filtersMapping: `{ searchTerm: input.filters?.searchTerm }`,
  },
];

const clientCommandsCommands: CommandUseCaseDefinition[] = [
  {
    name: 'push-client-command',
    resource: 'client-commands',
    repositoryType: 'ClientCommandWriteRepositorySecondaryPort',
    repositoryImportPath: 'client-commands/client-command.write-repository',
    repositoryMethod: 'pushClientCommand',
    repositoryMethodParams: 'input.clientCommandId, input.clientIds',
  },
];

// ============================================================================
// ROLLOUT TEMPLATES USE CASES
// ============================================================================

const rolloutTemplatesQueries: QueryUseCaseDefinition[] = [
  {
    name: 'find-paginated-rollout-templates',
    resource: 'rollout-templates',
    repositoryType: 'RolloutTemplateQueryRepositorySecondaryPort',
    repositoryImportPath: 'rollout-templates/rollout-template.query-repository',
    repositoryMethod: 'findPaginatedRolloutTemplates',
    repositoryMethodParams: 'paginationOption, filters',
    hasPagination: true,
    hasFilters: true,
    filtersMapping: `{
      searchTerm: input.filters?.searchTerm,
      os: input.filters?.os,
    }`,
  },
  {
    name: 'find-rollout-template-by-id',
    resource: 'rollout-templates',
    repositoryType: 'RolloutTemplateQueryRepositorySecondaryPort',
    repositoryImportPath: 'rollout-templates/rollout-template.query-repository',
    repositoryMethod: 'findRolloutTemplateById',
    repositoryMethodParams: 'input.id',
    hasPagination: false,
    hasFilters: false,
    resultProperty: 'rolloutTemplate',
  },
  {
    name: 'find-rollout-template-count',
    resource: 'rollout-templates',
    repositoryType: 'RolloutTemplateQueryRepositorySecondaryPort',
    repositoryImportPath: 'rollout-templates/rollout-template.query-repository',
    repositoryMethod: 'findRolloutTemplateCount',
    repositoryMethodParams: 'filters',
    hasPagination: false,
    hasFilters: true,
    filtersMapping: `{
      searchTerm: input.filters?.searchTerm,
      os: input.filters?.os,
    }`,
  },
];

const rolloutTemplatesCommands: CommandUseCaseDefinition[] = [
  {
    name: 'push-rollout-template',
    resource: 'rollout-templates',
    repositoryType: 'RolloutTemplateWriteRepositorySecondaryPort',
    repositoryImportPath: 'rollout-templates/rollout-template.write-repository',
    repositoryMethod: 'pushRolloutTemplate',
    repositoryMethodParams: 'input.rolloutTemplateId, input.clientIds',
  },
];

// ============================================================================
// GENERATORS
// ============================================================================

function generateQueryUseCase(query: QueryUseCaseDefinition): string {
  const className = toPascalCase(query.name) + 'Query';
  const inClass = toPascalCase(query.name) + 'In';
  const outClass = toPascalCase(query.name) + 'Out';
  const portInterface = toPascalCase(query.name) + 'QueryPrimaryPort';
  const repoVarName = toCamelCase(query.repositoryType.replace('SecondaryPort', ''));

  // Build imports
  const primaryImportPath = `@/application/ports/primary/${query.resource}/queries/${query.name}`;
  const secondaryImportPath = `@/application/ports/secondary/repositories/${query.repositoryImportPath}`;

  let imports = `import { ${inClass} } from '${primaryImportPath}/${query.name}.in';
import { ${outClass} } from '${primaryImportPath}/${query.name}.out';
import { ${portInterface} } from '${primaryImportPath}/${query.name}.query.port';
import { ${query.repositoryType} } from '${secondaryImportPath}';`;

  if (query.hasPagination) {
    imports += `\nimport { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';`;
  }

  // Build execute body
  let executeBody = '';

  if (query.hasPagination) {
    executeBody += `    const paginationOption: PaginationOption = {
      page: input.paginationOptions.page,
      pageSize: input.paginationOptions.pageSize,
    };\n\n`;
  }

  if (query.hasFilters && query.filtersMapping) {
    executeBody += `    const filters = input.filters ? ${query.filtersMapping} : undefined;\n\n`;
  }

  // Repository call
  if (query.resultProperty) {
    // Single item query
    executeBody += `    const ${query.resultProperty} = await this.${repoVarName}.${query.repositoryMethod}(${query.repositoryMethodParams});

    if (!${query.resultProperty}) {
      throw new Error('${toPascalCase(query.resultProperty)} not found');
    }

    return ${outClass}.create(${query.resultProperty});`;
  } else if (query.name.includes('count')) {
    // Count query
    executeBody += `    const count = await this.${repoVarName}.${query.repositoryMethod}(${query.repositoryMethodParams});

    return ${outClass}.create({ count });`;
  } else if (query.name === 'find-asset-types') {
    // Special case for asset types (returns array)
    executeBody += `    const assetTypes = await this.${repoVarName}.${query.repositoryMethod}();

    return ${outClass}.create(assetTypes);`;
  } else {
    // Paginated query
    executeBody += `    const paginatedData = await this.${repoVarName}.${query.repositoryMethod}(${query.repositoryMethodParams});

    return ${outClass}.create(paginatedData);`;
  }

  return `${imports}

export class ${className} implements ${portInterface} {
  public constructor(private readonly ${repoVarName}: ${query.repositoryType}) {}

  public async execute(input: ${inClass}): Promise<${outClass}> {
${executeBody}
  }
}
`;
}

function generateCommandUseCase(command: CommandUseCaseDefinition): string {
  const className = toPascalCase(command.name) + 'Command';
  const inClass = toPascalCase(command.name) + 'CommandIn';
  const outClass = toPascalCase(command.name) + 'CommandOut';
  const portInterface = toPascalCase(command.name) + 'CommandPrimaryPort';
  const repoVarName = toCamelCase(command.repositoryType.replace('SecondaryPort', ''));

  const primaryImportPath = `@/application/ports/primary/${command.resource}/commands/${command.name}`;
  const secondaryImportPath = `@/application/ports/secondary/repositories/${command.repositoryImportPath}`;

  return `import { ${inClass} } from '${primaryImportPath}/${command.name}.command.in';
import { ${outClass} } from '${primaryImportPath}/${command.name}.command.out';
import { ${portInterface} } from '${primaryImportPath}/${command.name}.command.port';
import { ${command.repositoryType} } from '${secondaryImportPath}';

export class ${className} implements ${portInterface} {
  public constructor(private readonly ${repoVarName}: ${command.repositoryType}) {}

  public async execute(input: ${inClass}): Promise<${outClass}> {
    const result = await this.${repoVarName}.${command.repositoryMethod}(${command.repositoryMethodParams});

    return ${outClass}.create(result);
  }
}
`;
}

function generateQueriesIndex(queries: QueryUseCaseDefinition[]): string {
  return queries.map((q) => `export * from './${q.name}.query';`).join('\n') + '\n';
}

function generateCommandsIndex(commands: CommandUseCaseDefinition[]): string {
  return commands.map((c) => `export * from './${c.name}.command';`).join('\n') + '\n';
}

// ============================================================================
// RESOURCE GROUPS
// ============================================================================

interface ResourceGroup {
  name: string;
  queries: QueryUseCaseDefinition[];
  commands: CommandUseCaseDefinition[];
}

const resourceGroups: ResourceGroup[] = [
  { name: 'clients', queries: clientsQueries, commands: [] },
  { name: 'jobs', queries: jobsQueries, commands: [] },
  { name: 'tickets', queries: ticketsQueries, commands: [] },
  { name: 'assets', queries: assetsQueries, commands: [] },
  { name: 'client-commands', queries: clientCommandsQueries, commands: clientCommandsCommands },
  { name: 'rollout-templates', queries: rolloutTemplatesQueries, commands: rolloutTemplatesCommands },
];

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main(): void {
  console.log('🚀 Generating Use Cases for ACMP Connector BC\n');

  ensureDir(BC_PATH);

  let totalQueries = 0;
  let totalCommands = 0;

  for (const group of resourceGroups) {
    console.log(`\n📦 Processing resource: ${group.name}`);

    const resourcePath = path.join(BC_PATH, group.name);
    ensureDir(resourcePath);

    // Generate queries
    if (group.queries.length > 0) {
      const queriesPath = path.join(resourcePath, 'queries');
      ensureDir(queriesPath);

      for (const query of group.queries) {
        writeFile(
          path.join(queriesPath, `${query.name}.query.ts`),
          generateQueryUseCase(query)
        );
        totalQueries++;
      }

      writeFile(path.join(queriesPath, 'index.ts'), generateQueriesIndex(group.queries));
    }

    // Generate commands
    if (group.commands.length > 0) {
      const commandsPath = path.join(resourcePath, 'commands');
      ensureDir(commandsPath);

      for (const command of group.commands) {
        writeFile(
          path.join(commandsPath, `${command.name}.command.ts`),
          generateCommandUseCase(command)
        );
        totalCommands++;
      }

      writeFile(path.join(commandsPath, 'index.ts'), generateCommandsIndex(group.commands));
    }

    // Generate resource index
    const resourceExports: string[] = [];
    if (group.queries.length > 0) {
      resourceExports.push(`export * from './queries';`);
    }
    if (group.commands.length > 0) {
      resourceExports.push(`export * from './commands';`);
    }
    writeFile(path.join(resourcePath, 'index.ts'), resourceExports.join('\n') + '\n');
  }

  // Generate use-cases/index.ts
  const useCasesIndex = resourceGroups.map((g) => `export * from './${g.name}';`).join('\n') + '\n';
  writeFile(path.join(BC_PATH, 'index.ts'), useCasesIndex);

  console.log('\n✅ Generation complete!');
  console.log(`\n📊 Summary:`);
  console.log(`   Query Use Cases: ${totalQueries}`);
  console.log(`   Command Use Cases: ${totalCommands}`);
}

main();

