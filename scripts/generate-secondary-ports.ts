/**
 * Script to generate all secondary ports (repositories & adapters) for the ACMP Connector bounded context
 *
 * Run with: npx tsx scripts/generate-secondary-ports.ts
 */

import * as fs from "fs";
import * as path from "path";

const BC_PATH =
  "packages/business/bounded-contexts/acmp-connector-bounded-context/src/application/ports/secondary";

// ============================================================================
// REPOSITORY DEFINITIONS
// ============================================================================

interface QueryRepositoryMethod {
  name: string;
  description: string;
  params: string;
  returnType: string;
}

interface WriteRepositoryMethod {
  name: string;
  description: string;
  params: string;
  returnType: string;
}

interface QueryRepositoryDefinition {
  name: string; // e.g., 'client'
  fileName: string; // e.g., 'client.query-repository'
  interfaceName: string; // e.g., 'ClientQueryRepositorySecondaryPort'
  description: string;
  imports: string;
  filterType?: string;
  methods: QueryRepositoryMethod[];
}

interface WriteRepositoryDefinition {
  name: string;
  fileName: string;
  interfaceName: string;
  description: string;
  imports: string;
  methods: WriteRepositoryMethod[];
}

// ============================================================================
// CLIENTS REPOSITORY
// ============================================================================

const clientQueryRepository: QueryRepositoryDefinition = {
  name: "client",
  fileName: "client.query-repository",
  interfaceName: "ClientQueryRepositorySecondaryPort",
  description:
    "Query repository for reading client data from ACMP MSSQL database.",
  imports: `import {
  AcmpClientReadModel,
} from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';`,
  filterType: `export type FindPaginatedClientsFilters = {
  searchTerm?: string;
  tenantId?: string;
};`,
  methods: [
    {
      name: "findPaginatedClients",
      description: "Find paginated list of clients",
      params:
        "pagination: PaginationOption, filters?: FindPaginatedClientsFilters",
      returnType: "Promise<PaginatedData<AcmpClientReadModel>>",
    },
    {
      name: "findClientById",
      description: "Find client by ID",
      params: "id: string",
      returnType: "Promise<AcmpClientReadModel | null>",
    },
    {
      name: "findClientCount",
      description: "Count clients with optional filters",
      params: "filters?: FindPaginatedClientsFilters",
      returnType: "Promise<number>",
    },
  ],
};

const clientHardDriveQueryRepository: QueryRepositoryDefinition = {
  name: "client-hard-drive",
  fileName: "client-hard-drive.query-repository",
  interfaceName: "ClientHardDriveQueryRepositorySecondaryPort",
  description:
    "Query repository for reading client hard drive data from ACMP MSSQL database.",
  imports: `import {
  AcmpClientHardDriveListItemReadModel,
} from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';`,
  methods: [
    {
      name: "findPaginatedClientHardDrives",
      description: "Find paginated list of hard drives for a client",
      params: "clientId: string, pagination: PaginationOption",
      returnType:
        "Promise<PaginatedData<AcmpClientHardDriveListItemReadModel>>",
    },
    {
      name: "findClientHardDriveCount",
      description: "Count hard drives for a client",
      params: "clientId: string",
      returnType: "Promise<number>",
    },
  ],
};

const clientNetworkCardQueryRepository: QueryRepositoryDefinition = {
  name: "client-network-card",
  fileName: "client-network-card.query-repository",
  interfaceName: "ClientNetworkCardQueryRepositorySecondaryPort",
  description:
    "Query repository for reading client network card data from ACMP MSSQL database.",
  imports: `import {
  AcmpClientNetworkCardListItemReadModel,
} from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';`,
  methods: [
    {
      name: "findPaginatedClientNetworkCards",
      description: "Find paginated list of network cards for a client",
      params: "clientId: string, pagination: PaginationOption",
      returnType:
        "Promise<PaginatedData<AcmpClientNetworkCardListItemReadModel>>",
    },
    {
      name: "findClientNetworkCardCount",
      description: "Count network cards for a client",
      params: "clientId: string",
      returnType: "Promise<number>",
    },
  ],
};

const clientInstalledSoftwareQueryRepository: QueryRepositoryDefinition = {
  name: "client-installed-software",
  fileName: "client-installed-software.query-repository",
  interfaceName: "ClientInstalledSoftwareQueryRepositorySecondaryPort",
  description:
    "Query repository for reading client installed software data from ACMP MSSQL database.",
  imports: `import {
  AcmpClientInstalledSoftwareListItemReadModel,
} from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';`,
  filterType: `export type FindPaginatedClientInstalledSoftwareFilters = {
  searchTerm?: string;
};`,
  methods: [
    {
      name: "findPaginatedClientInstalledSoftware",
      description: "Find paginated list of installed software for a client",
      params:
        "clientId: string, pagination: PaginationOption, filters?: FindPaginatedClientInstalledSoftwareFilters",
      returnType:
        "Promise<PaginatedData<AcmpClientInstalledSoftwareListItemReadModel>>",
    },
    {
      name: "findClientInstalledSoftwareCount",
      description: "Count installed software for a client",
      params:
        "clientId: string, filters?: FindPaginatedClientInstalledSoftwareFilters",
      returnType: "Promise<number>",
    },
  ],
};

// ============================================================================
// JOBS REPOSITORY
// ============================================================================

const jobQueryRepository: QueryRepositoryDefinition = {
  name: "job",
  fileName: "job.query-repository",
  interfaceName: "JobQueryRepositorySecondaryPort",
  description:
    "Query repository for reading job data from ACMP MSSQL database.",
  imports: `import {
  AcmpJobReadModel,
} from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';`,
  filterType: `export type FindPaginatedJobsFilters = {
  searchTerm?: string;
  kind?: string;
  origin?: string;
};`,
  methods: [
    {
      name: "findPaginatedJobs",
      description: "Find paginated list of jobs",
      params:
        "pagination: PaginationOption, filters?: FindPaginatedJobsFilters",
      returnType: "Promise<PaginatedData<AcmpJobReadModel>>",
    },
    {
      name: "findJobById",
      description: "Find job by ID",
      params: "id: string",
      returnType: "Promise<AcmpJobReadModel | null>",
    },
    {
      name: "findJobCount",
      description: "Count jobs with optional filters",
      params: "filters?: FindPaginatedJobsFilters",
      returnType: "Promise<number>",
    },
  ],
};

// ============================================================================
// TICKETS REPOSITORY
// ============================================================================

const ticketQueryRepository: QueryRepositoryDefinition = {
  name: "ticket",
  fileName: "ticket.query-repository",
  interfaceName: "TicketQueryRepositorySecondaryPort",
  description:
    "Query repository for reading ticket data from ACMP MSSQL database.",
  imports: `import {
  AcmpTicketListItemReadModel,
  AcmpTicketDetailsReadModel,
} from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';`,
  filterType: `export type FindPaginatedTicketsFilters = {
  searchTerm?: string;
};`,
  methods: [
    {
      name: "findPaginatedTickets",
      description: "Find paginated list of tickets",
      params:
        "pagination: PaginationOption, filters?: FindPaginatedTicketsFilters",
      returnType: "Promise<PaginatedData<AcmpTicketListItemReadModel>>",
    },
    {
      name: "findTicketById",
      description: "Find ticket by ID",
      params: "id: string",
      returnType: "Promise<AcmpTicketListItemReadModel | null>",
    },
    {
      name: "findTicketDetailsById",
      description: "Find ticket details by ID",
      params: "id: string",
      returnType: "Promise<AcmpTicketDetailsReadModel | null>",
    },
    {
      name: "findTicketCount",
      description: "Count tickets with optional filters",
      params: "filters?: FindPaginatedTicketsFilters",
      returnType: "Promise<number>",
    },
  ],
};

// ============================================================================
// ASSETS REPOSITORY
// ============================================================================

const assetQueryRepository: QueryRepositoryDefinition = {
  name: "asset",
  fileName: "asset.query-repository",
  interfaceName: "AssetQueryRepositorySecondaryPort",
  description:
    "Query repository for reading asset data from ACMP MSSQL database.",
  imports: `import {
  AcmpAssetListItemReadModel,
  AcmpAssetTypeListItemReadModel,
} from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';`,
  filterType: `export type FindPaginatedAssetsFilters = {
  searchTerm?: string;
  assetType?: string;
};`,
  methods: [
    {
      name: "findPaginatedAssets",
      description: "Find paginated list of assets",
      params:
        "pagination: PaginationOption, filters?: FindPaginatedAssetsFilters",
      returnType: "Promise<PaginatedData<AcmpAssetListItemReadModel>>",
    },
    {
      name: "findAssetById",
      description: "Find asset by ID",
      params: "id: string",
      returnType: "Promise<AcmpAssetListItemReadModel | null>",
    },
    {
      name: "findAssetCount",
      description: "Count assets with optional filters",
      params: "filters?: FindPaginatedAssetsFilters",
      returnType: "Promise<number>",
    },
    {
      name: "findAssetTypes",
      description: "Find all asset types",
      params: "",
      returnType: "Promise<AcmpAssetTypeListItemReadModel[]>",
    },
  ],
};

// ============================================================================
// CLIENT COMMANDS REPOSITORY
// ============================================================================

const clientCommandQueryRepository: QueryRepositoryDefinition = {
  name: "client-command",
  fileName: "client-command.query-repository",
  interfaceName: "ClientCommandQueryRepositorySecondaryPort",
  description:
    "Query repository for reading client command data from ACMP MSSQL database.",
  imports: `import {
  AcmpClientCommandReadModel,
} from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';`,
  filterType: `export type FindPaginatedClientCommandsFilters = {
  searchTerm?: string;
};`,
  methods: [
    {
      name: "findPaginatedClientCommands",
      description: "Find paginated list of client commands",
      params:
        "pagination: PaginationOption, filters?: FindPaginatedClientCommandsFilters",
      returnType: "Promise<PaginatedData<AcmpClientCommandReadModel>>",
    },
    {
      name: "findClientCommandById",
      description: "Find client command by ID",
      params: "id: string",
      returnType: "Promise<AcmpClientCommandReadModel | null>",
    },
    {
      name: "findClientCommandCount",
      description: "Count client commands with optional filters",
      params: "filters?: FindPaginatedClientCommandsFilters",
      returnType: "Promise<number>",
    },
  ],
};

const clientCommandWriteRepository: WriteRepositoryDefinition = {
  name: "client-command",
  fileName: "client-command.write-repository",
  interfaceName: "ClientCommandWriteRepositorySecondaryPort",
  description: "Write repository for pushing client commands via SICS API.",
  imports: ``,
  methods: [
    {
      name: "pushClientCommand",
      description: "Push a client command to selected clients via SICS API",
      params: "commandId: string, clientIds: string[]",
      returnType: "Promise<{ success: boolean; jobId?: string }>",
    },
  ],
};

// ============================================================================
// ROLLOUT TEMPLATES REPOSITORY
// ============================================================================

const rolloutTemplateQueryRepository: QueryRepositoryDefinition = {
  name: "rollout-template",
  fileName: "rollout-template.query-repository",
  interfaceName: "RolloutTemplateQueryRepositorySecondaryPort",
  description:
    "Query repository for reading rollout template data from ACMP MSSQL database.",
  imports: `import {
  AcmpRolloutTemplateListItemReadModel,
} from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';`,
  filterType: `export type FindPaginatedRolloutTemplatesFilters = {
  searchTerm?: string;
  os?: string;
};`,
  methods: [
    {
      name: "findPaginatedRolloutTemplates",
      description: "Find paginated list of rollout templates",
      params:
        "pagination: PaginationOption, filters?: FindPaginatedRolloutTemplatesFilters",
      returnType:
        "Promise<PaginatedData<AcmpRolloutTemplateListItemReadModel>>",
    },
    {
      name: "findRolloutTemplateById",
      description: "Find rollout template by ID",
      params: "id: string",
      returnType: "Promise<AcmpRolloutTemplateListItemReadModel | null>",
    },
    {
      name: "findRolloutTemplateCount",
      description: "Count rollout templates with optional filters",
      params: "filters?: FindPaginatedRolloutTemplatesFilters",
      returnType: "Promise<number>",
    },
  ],
};

const rolloutTemplateWriteRepository: WriteRepositoryDefinition = {
  name: "rollout-template",
  fileName: "rollout-template.write-repository",
  interfaceName: "RolloutTemplateWriteRepositorySecondaryPort",
  description: "Write repository for pushing rollout templates via SICS API.",
  imports: ``,
  methods: [
    {
      name: "pushRolloutTemplate",
      description: "Push a rollout template to selected clients via SICS API",
      params: "rolloutTemplateId: string, clientIds: string[]",
      returnType: "Promise<{ success: boolean; jobId?: string }>",
    },
  ],
};

// ============================================================================
// SICS API ADAPTER
// ============================================================================

const sicsApiAdapter = {
  fileName: "sics-api.adapter",
  interfaceName: "SicsApiAdapterSecondaryPort",
  description: "Adapter for communicating with the SICS external API.",
  imports: ``,
  methods: [
    {
      name: "pushClientCommand",
      description: "Push a client command to selected clients",
      params: "commandId: string, clientIds: string[]",
      returnType: "Promise<{ success: boolean; jobId?: string }>",
    },
    {
      name: "pushRolloutTemplate",
      description: "Push a rollout template to selected clients",
      params: "rolloutTemplateId: string, clientIds: string[]",
      returnType: "Promise<{ success: boolean; jobId?: string }>",
    },
  ],
};

// ============================================================================
// GROUP ALL DEFINITIONS
// ============================================================================

interface RepositoryGroup {
  folder: string;
  queryRepositories: QueryRepositoryDefinition[];
  writeRepositories: WriteRepositoryDefinition[];
}

const repositoryGroups: RepositoryGroup[] = [
  {
    folder: "clients",
    queryRepositories: [
      clientQueryRepository,
      clientHardDriveQueryRepository,
      clientNetworkCardQueryRepository,
      clientInstalledSoftwareQueryRepository,
    ],
    writeRepositories: [],
  },
  {
    folder: "jobs",
    queryRepositories: [jobQueryRepository],
    writeRepositories: [],
  },
  {
    folder: "tickets",
    queryRepositories: [ticketQueryRepository],
    writeRepositories: [],
  },
  {
    folder: "assets",
    queryRepositories: [assetQueryRepository],
    writeRepositories: [],
  },
  {
    folder: "client-commands",
    queryRepositories: [clientCommandQueryRepository],
    writeRepositories: [clientCommandWriteRepository],
  },
  {
    folder: "rollout-templates",
    queryRepositories: [rolloutTemplateQueryRepository],
    writeRepositories: [rolloutTemplateWriteRepository],
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

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
// GENERATORS
// ============================================================================

function generateQueryRepository(repo: QueryRepositoryDefinition): string {
  const methodDocs = repo.methods
    .map(
      (m) => `  /**
   * ${m.description}
   */
  ${m.name}(${m.params}): ${m.returnType};`,
    )
    .join("\n\n");

  const filterType = repo.filterType ? `${repo.filterType}\n\n` : "";

  return `${repo.imports}

${filterType}/**
 * ${repo.description}
 */
export interface ${repo.interfaceName} {
${methodDocs}
}
`;
}

function generateWriteRepository(repo: WriteRepositoryDefinition): string {
  const methodDocs = repo.methods
    .map(
      (m) => `  /**
   * ${m.description}
   */
  ${m.name}(${m.params}): ${m.returnType};`,
    )
    .join("\n\n");

  return `${repo.imports}
/**
 * ${repo.description}
 */
export interface ${repo.interfaceName} {
${methodDocs}
}
`;
}

function generateRepositoryFolderIndex(group: RepositoryGroup): string {
  const exports: string[] = [];

  for (const repo of group.queryRepositories) {
    exports.push(`export * from './${repo.fileName}';`);
  }

  for (const repo of group.writeRepositories) {
    exports.push(`export * from './${repo.fileName}';`);
  }

  return exports.join("\n") + "\n";
}

function generateRepositoriesIndex(): string {
  return (
    repositoryGroups.map((g) => `export * from './${g.folder}';`).join("\n") +
    "\n"
  );
}

function generateAdaptersIndex(): string {
  return `export * from './sics-api';\n`;
}

function generateSicsApiAdapterIndex(): string {
  return `export * from './${sicsApiAdapter.fileName}';\n`;
}

function generateSicsApiAdapter(): string {
  const methodDocs = sicsApiAdapter.methods
    .map(
      (m) => `  /**
   * ${m.description}
   */
  ${m.name}(${m.params}): ${m.returnType};`,
    )
    .join("\n\n");

  return `${sicsApiAdapter.imports}
/**
 * ${sicsApiAdapter.description}
 */
export interface ${sicsApiAdapter.interfaceName} {
${methodDocs}
}
`;
}

function generateSecondaryIndex(): string {
  return `export * from './adapters';
export * from './repositories';
`;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main(): void {
  console.log("🚀 Generating Secondary Ports for ACMP Connector BC\n");

  // Create secondary ports directories
  const repositoriesPath = path.join(BC_PATH, "repositories");
  const adaptersPath = path.join(BC_PATH, "adapters");

  ensureDir(repositoriesPath);
  ensureDir(adaptersPath);

  // Generate repositories
  for (const group of repositoryGroups) {
    console.log(`\n📦 Processing repository group: ${group.folder}`);

    const groupPath = path.join(repositoriesPath, group.folder);
    ensureDir(groupPath);

    // Generate query repositories
    for (const repo of group.queryRepositories) {
      writeFile(
        path.join(groupPath, `${repo.fileName}.ts`),
        generateQueryRepository(repo),
      );
    }

    // Generate write repositories
    for (const repo of group.writeRepositories) {
      writeFile(
        path.join(groupPath, `${repo.fileName}.ts`),
        generateWriteRepository(repo),
      );
    }

    // Generate folder index
    writeFile(
      path.join(groupPath, "index.ts"),
      generateRepositoryFolderIndex(group),
    );
  }

  // Generate repositories/index.ts
  writeFile(
    path.join(repositoriesPath, "index.ts"),
    generateRepositoriesIndex(),
  );

  // Generate SICS API adapter
  console.log(`\n📦 Processing adapter: sics-api`);
  const sicsApiPath = path.join(adaptersPath, "sics-api");
  ensureDir(sicsApiPath);
  writeFile(
    path.join(sicsApiPath, `${sicsApiAdapter.fileName}.ts`),
    generateSicsApiAdapter(),
  );
  writeFile(path.join(sicsApiPath, "index.ts"), generateSicsApiAdapterIndex());

  // Generate adapters/index.ts
  writeFile(path.join(adaptersPath, "index.ts"), generateAdaptersIndex());

  // Generate secondary/index.ts
  writeFile(path.join(BC_PATH, "index.ts"), generateSecondaryIndex());

  console.log("\n✅ Generation complete!");

  // Summary
  const totalQueryRepos = repositoryGroups.reduce(
    (acc, g) => acc + g.queryRepositories.length,
    0,
  );
  const totalWriteRepos = repositoryGroups.reduce(
    (acc, g) => acc + g.writeRepositories.length,
    0,
  );

  console.log(`\n📊 Summary:`);
  console.log(`   Query Repositories: ${totalQueryRepos}`);
  console.log(`   Write Repositories: ${totalWriteRepos}`);
  console.log(`   Adapters: 1 (SICS API)`);
}

main();
