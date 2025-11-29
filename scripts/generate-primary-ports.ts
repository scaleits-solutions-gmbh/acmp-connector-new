/**
 * Script to generate all primary ports for the ACMP Connector bounded context
 *
 * Run with: npx tsx scripts/generate-primary-ports.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const BC_PATH =
  'packages/business/bounded-contexts/acmp-connector-bounded-context/src/application/ports/primary';

// ============================================================================
// PORT DEFINITIONS
// ============================================================================

interface QueryDefinition {
  name: string;
  inFields: string; // Zod schema fields
  inGetters: string; // Getter methods
  outSchema: string; // Output schema
  outGetters: string; // Output getter methods
  outImports?: string; // Additional imports for output
}

interface CommandDefinition {
  name: string;
  inFields: string;
  inGetters: string;
  outSchema: string;
  outGetters: string;
  outImports?: string;
  inImports?: string;
}

interface ResourceDefinition {
  name: string;
  queries: QueryDefinition[];
  commands?: CommandDefinition[];
}

// Define all resources and their ports
const resources: ResourceDefinition[] = [
  // =========================================================================
  // CLIENTS
  // =========================================================================
  {
    name: 'clients',
    queries: [
      {
        name: 'find-paginated-clients',
        inFields: `
    paginationOptions: z.object({
      page: z.number().min(1),
      pageSize: z.number().min(1).max(100),
    }),
    filters: z.object({
      searchTerm: z.string().optional(),
      tenantId: z.string().optional(),
    }).optional(),`,
        inGetters: `
  public get paginationOptions() {
    return this._data.paginationOptions;
  }

  public get filters() {
    return this._data.filters;
  }`,
        outSchema: `paginatedDataSchema({
    dataItemSchema: acmpClientReadModelSchema,
    zodClient: z,
  })`,
        outGetters: `
  public get data() {
    return this._data.data;
  }

  public get total() {
    return this._data.total;
  }

  public get page() {
    return this._data.page;
  }

  public get pageSize() {
    return this._data.pageSize;
  }

  public get totalPages() {
    return this._data.totalPages;
  }`,
        outImports: `import { acmpClientReadModelSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { paginatedDataSchema } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';`,
      },
      {
        name: 'find-client-by-id',
        inFields: `
    id: z.string(),`,
        inGetters: `
  public get id() {
    return this._data.id;
  }`,
        outSchema: `acmpClientReadModelSchema`,
        outGetters: `
  public get client() {
    return this._data;
  }`,
        outImports: `import { acmpClientReadModelSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';`,
      },
      {
        name: 'find-client-count',
        inFields: `
    filters: z.object({
      searchTerm: z.string().optional(),
      tenantId: z.string().optional(),
    }).optional(),`,
        inGetters: `
  public get filters() {
    return this._data.filters;
  }`,
        outSchema: `z.object({
    count: z.number(),
  })`,
        outGetters: `
  public get count() {
    return this._data.count;
  }`,
      },
      {
        name: 'find-paginated-client-hard-drives',
        inFields: `
    clientId: z.string(),
    paginationOptions: z.object({
      page: z.number().min(1),
      pageSize: z.number().min(1).max(100),
    }),`,
        inGetters: `
  public get clientId() {
    return this._data.clientId;
  }

  public get paginationOptions() {
    return this._data.paginationOptions;
  }`,
        outSchema: `paginatedDataSchema({
    dataItemSchema: acmpClientHardDriveListItemReadModelSchema,
    zodClient: z,
  })`,
        outGetters: `
  public get data() {
    return this._data.data;
  }

  public get total() {
    return this._data.total;
  }

  public get page() {
    return this._data.page;
  }

  public get pageSize() {
    return this._data.pageSize;
  }

  public get totalPages() {
    return this._data.totalPages;
  }`,
        outImports: `import { acmpClientHardDriveListItemReadModelSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { paginatedDataSchema } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';`,
      },
      {
        name: 'find-client-hard-drive-count',
        inFields: `
    clientId: z.string(),`,
        inGetters: `
  public get clientId() {
    return this._data.clientId;
  }`,
        outSchema: `z.object({
    count: z.number(),
  })`,
        outGetters: `
  public get count() {
    return this._data.count;
  }`,
      },
      {
        name: 'find-paginated-client-network-cards',
        inFields: `
    clientId: z.string(),
    paginationOptions: z.object({
      page: z.number().min(1),
      pageSize: z.number().min(1).max(100),
    }),`,
        inGetters: `
  public get clientId() {
    return this._data.clientId;
  }

  public get paginationOptions() {
    return this._data.paginationOptions;
  }`,
        outSchema: `paginatedDataSchema({
    dataItemSchema: acmpClientNetworkCardListItemReadModelSchema,
    zodClient: z,
  })`,
        outGetters: `
  public get data() {
    return this._data.data;
  }

  public get total() {
    return this._data.total;
  }

  public get page() {
    return this._data.page;
  }

  public get pageSize() {
    return this._data.pageSize;
  }

  public get totalPages() {
    return this._data.totalPages;
  }`,
        outImports: `import { acmpClientNetworkCardListItemReadModelSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { paginatedDataSchema } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';`,
      },
      {
        name: 'find-client-network-card-count',
        inFields: `
    clientId: z.string(),`,
        inGetters: `
  public get clientId() {
    return this._data.clientId;
  }`,
        outSchema: `z.object({
    count: z.number(),
  })`,
        outGetters: `
  public get count() {
    return this._data.count;
  }`,
      },
      {
        name: 'find-paginated-client-installed-software',
        inFields: `
    clientId: z.string(),
    paginationOptions: z.object({
      page: z.number().min(1),
      pageSize: z.number().min(1).max(100),
    }),
    filters: z.object({
      searchTerm: z.string().optional(),
    }).optional(),`,
        inGetters: `
  public get clientId() {
    return this._data.clientId;
  }

  public get paginationOptions() {
    return this._data.paginationOptions;
  }

  public get filters() {
    return this._data.filters;
  }`,
        outSchema: `paginatedDataSchema({
    dataItemSchema: acmpClientInstalledSoftwareListItemReadModelSchema,
    zodClient: z,
  })`,
        outGetters: `
  public get data() {
    return this._data.data;
  }

  public get total() {
    return this._data.total;
  }

  public get page() {
    return this._data.page;
  }

  public get pageSize() {
    return this._data.pageSize;
  }

  public get totalPages() {
    return this._data.totalPages;
  }`,
        outImports: `import { acmpClientInstalledSoftwareListItemReadModelSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { paginatedDataSchema } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';`,
      },
      {
        name: 'find-client-installed-software-count',
        inFields: `
    clientId: z.string(),
    filters: z.object({
      searchTerm: z.string().optional(),
    }).optional(),`,
        inGetters: `
  public get clientId() {
    return this._data.clientId;
  }

  public get filters() {
    return this._data.filters;
  }`,
        outSchema: `z.object({
    count: z.number(),
  })`,
        outGetters: `
  public get count() {
    return this._data.count;
  }`,
      },
    ],
  },

  // =========================================================================
  // JOBS
  // =========================================================================
  {
    name: 'jobs',
    queries: [
      {
        name: 'find-paginated-jobs',
        inFields: `
    paginationOptions: z.object({
      page: z.number().min(1),
      pageSize: z.number().min(1).max(100),
    }),
    filters: z.object({
      searchTerm: z.string().optional(),
      kind: z.string().optional(),
      origin: z.string().optional(),
    }).optional(),`,
        inGetters: `
  public get paginationOptions() {
    return this._data.paginationOptions;
  }

  public get filters() {
    return this._data.filters;
  }`,
        outSchema: `paginatedDataSchema({
    dataItemSchema: acmpJobReadModelSchema,
    zodClient: z,
  })`,
        outGetters: `
  public get data() {
    return this._data.data;
  }

  public get total() {
    return this._data.total;
  }

  public get page() {
    return this._data.page;
  }

  public get pageSize() {
    return this._data.pageSize;
  }

  public get totalPages() {
    return this._data.totalPages;
  }`,
        outImports: `import { acmpJobReadModelSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { paginatedDataSchema } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';`,
      },
      {
        name: 'find-job-by-id',
        inFields: `
    id: z.string(),`,
        inGetters: `
  public get id() {
    return this._data.id;
  }`,
        outSchema: `acmpJobReadModelSchema`,
        outGetters: `
  public get job() {
    return this._data;
  }`,
        outImports: `import { acmpJobReadModelSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';`,
      },
      {
        name: 'find-job-count',
        inFields: `
    filters: z.object({
      searchTerm: z.string().optional(),
      kind: z.string().optional(),
      origin: z.string().optional(),
    }).optional(),`,
        inGetters: `
  public get filters() {
    return this._data.filters;
  }`,
        outSchema: `z.object({
    count: z.number(),
  })`,
        outGetters: `
  public get count() {
    return this._data.count;
  }`,
      },
    ],
  },

  // =========================================================================
  // TICKETS
  // =========================================================================
  {
    name: 'tickets',
    queries: [
      {
        name: 'find-paginated-tickets',
        inFields: `
    paginationOptions: z.object({
      page: z.number().min(1),
      pageSize: z.number().min(1).max(100),
    }),
    filters: z.object({
      searchTerm: z.string().optional(),
    }).optional(),`,
        inGetters: `
  public get paginationOptions() {
    return this._data.paginationOptions;
  }

  public get filters() {
    return this._data.filters;
  }`,
        outSchema: `paginatedDataSchema({
    dataItemSchema: acmpTicketListItemReadModelSchema,
    zodClient: z,
  })`,
        outGetters: `
  public get data() {
    return this._data.data;
  }

  public get total() {
    return this._data.total;
  }

  public get page() {
    return this._data.page;
  }

  public get pageSize() {
    return this._data.pageSize;
  }

  public get totalPages() {
    return this._data.totalPages;
  }`,
        outImports: `import { acmpTicketListItemReadModelSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { paginatedDataSchema } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';`,
      },
      {
        name: 'find-ticket-by-id',
        inFields: `
    id: z.string(),`,
        inGetters: `
  public get id() {
    return this._data.id;
  }`,
        outSchema: `acmpTicketListItemReadModelSchema`,
        outGetters: `
  public get ticket() {
    return this._data;
  }`,
        outImports: `import { acmpTicketListItemReadModelSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';`,
      },
      {
        name: 'find-ticket-details-by-id',
        inFields: `
    id: z.string(),`,
        inGetters: `
  public get id() {
    return this._data.id;
  }`,
        outSchema: `acmpTicketDetailsReadModelSchema`,
        outGetters: `
  public get ticketDetails() {
    return this._data;
  }`,
        outImports: `import { acmpTicketDetailsReadModelSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';`,
      },
      {
        name: 'find-ticket-count',
        inFields: `
    filters: z.object({
      searchTerm: z.string().optional(),
    }).optional(),`,
        inGetters: `
  public get filters() {
    return this._data.filters;
  }`,
        outSchema: `z.object({
    count: z.number(),
  })`,
        outGetters: `
  public get count() {
    return this._data.count;
  }`,
      },
    ],
  },

  // =========================================================================
  // ASSETS
  // =========================================================================
  {
    name: 'assets',
    queries: [
      {
        name: 'find-paginated-assets',
        inFields: `
    paginationOptions: z.object({
      page: z.number().min(1),
      pageSize: z.number().min(1).max(100),
    }),
    filters: z.object({
      searchTerm: z.string().optional(),
      assetType: z.string().optional(),
    }).optional(),`,
        inGetters: `
  public get paginationOptions() {
    return this._data.paginationOptions;
  }

  public get filters() {
    return this._data.filters;
  }`,
        outSchema: `paginatedDataSchema({
    dataItemSchema: acmpAssetListItemReadModelSchema,
    zodClient: z,
  })`,
        outGetters: `
  public get data() {
    return this._data.data;
  }

  public get total() {
    return this._data.total;
  }

  public get page() {
    return this._data.page;
  }

  public get pageSize() {
    return this._data.pageSize;
  }

  public get totalPages() {
    return this._data.totalPages;
  }`,
        outImports: `import { acmpAssetListItemReadModelSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { paginatedDataSchema } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';`,
      },
      {
        name: 'find-asset-by-id',
        inFields: `
    id: z.string(),`,
        inGetters: `
  public get id() {
    return this._data.id;
  }`,
        outSchema: `acmpAssetListItemReadModelSchema`,
        outGetters: `
  public get asset() {
    return this._data;
  }`,
        outImports: `import { acmpAssetListItemReadModelSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';`,
      },
      {
        name: 'find-asset-count',
        inFields: `
    filters: z.object({
      searchTerm: z.string().optional(),
      assetType: z.string().optional(),
    }).optional(),`,
        inGetters: `
  public get filters() {
    return this._data.filters;
  }`,
        outSchema: `z.object({
    count: z.number(),
  })`,
        outGetters: `
  public get count() {
    return this._data.count;
  }`,
      },
      {
        name: 'find-asset-types',
        inFields: ``,
        inGetters: ``,
        outSchema: `z.array(acmpAssetTypeListItemReadModelSchema)`,
        outGetters: `
  public get assetTypes() {
    return this._data;
  }`,
        outImports: `import { acmpAssetTypeListItemReadModelSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';`,
      },
    ],
  },

  // =========================================================================
  // CLIENT COMMANDS
  // =========================================================================
  {
    name: 'client-commands',
    queries: [
      {
        name: 'find-paginated-client-commands',
        inFields: `
    paginationOptions: z.object({
      page: z.number().min(1),
      pageSize: z.number().min(1).max(100),
    }),
    filters: z.object({
      searchTerm: z.string().optional(),
    }).optional(),`,
        inGetters: `
  public get paginationOptions() {
    return this._data.paginationOptions;
  }

  public get filters() {
    return this._data.filters;
  }`,
        outSchema: `paginatedDataSchema({
    dataItemSchema: acmpClientCommandReadModelSchema,
    zodClient: z,
  })`,
        outGetters: `
  public get data() {
    return this._data.data;
  }

  public get total() {
    return this._data.total;
  }

  public get page() {
    return this._data.page;
  }

  public get pageSize() {
    return this._data.pageSize;
  }

  public get totalPages() {
    return this._data.totalPages;
  }`,
        outImports: `import { acmpClientCommandReadModelSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { paginatedDataSchema } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';`,
      },
      {
        name: 'find-client-command-by-id',
        inFields: `
    id: z.string(),`,
        inGetters: `
  public get id() {
    return this._data.id;
  }`,
        outSchema: `acmpClientCommandReadModelSchema`,
        outGetters: `
  public get clientCommand() {
    return this._data;
  }`,
        outImports: `import { acmpClientCommandReadModelSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';`,
      },
      {
        name: 'find-client-command-count',
        inFields: `
    filters: z.object({
      searchTerm: z.string().optional(),
    }).optional(),`,
        inGetters: `
  public get filters() {
    return this._data.filters;
  }`,
        outSchema: `z.object({
    count: z.number(),
  })`,
        outGetters: `
  public get count() {
    return this._data.count;
  }`,
      },
    ],
    commands: [
      {
        name: 'push-client-command',
        inFields: `
    clientCommandId: z.string(),
    clientIds: z.array(z.string()),`,
        inGetters: `
  public get clientCommandId() {
    return this._data.clientCommandId;
  }

  public get clientIds() {
    return this._data.clientIds;
  }`,
        outSchema: `z.object({
    success: z.boolean(),
    jobId: z.string().optional(),
  })`,
        outGetters: `
  public get success() {
    return this._data.success;
  }

  public get jobId() {
    return this._data.jobId;
  }`,
      },
    ],
  },

  // =========================================================================
  // ROLLOUT TEMPLATES
  // =========================================================================
  {
    name: 'rollout-templates',
    queries: [
      {
        name: 'find-paginated-rollout-templates',
        inFields: `
    paginationOptions: z.object({
      page: z.number().min(1),
      pageSize: z.number().min(1).max(100),
    }),
    filters: z.object({
      searchTerm: z.string().optional(),
      os: z.string().optional(),
    }).optional(),`,
        inGetters: `
  public get paginationOptions() {
    return this._data.paginationOptions;
  }

  public get filters() {
    return this._data.filters;
  }`,
        outSchema: `paginatedDataSchema({
    dataItemSchema: acmpRolloutTemplateListItemReadModelSchema,
    zodClient: z,
  })`,
        outGetters: `
  public get data() {
    return this._data.data;
  }

  public get total() {
    return this._data.total;
  }

  public get page() {
    return this._data.page;
  }

  public get pageSize() {
    return this._data.pageSize;
  }

  public get totalPages() {
    return this._data.totalPages;
  }`,
        outImports: `import { acmpRolloutTemplateListItemReadModelSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { paginatedDataSchema } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';`,
      },
      {
        name: 'find-rollout-template-by-id',
        inFields: `
    id: z.string(),`,
        inGetters: `
  public get id() {
    return this._data.id;
  }`,
        outSchema: `acmpRolloutTemplateListItemReadModelSchema`,
        outGetters: `
  public get rolloutTemplate() {
    return this._data;
  }`,
        outImports: `import { acmpRolloutTemplateListItemReadModelSchema } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';`,
      },
      {
        name: 'find-rollout-template-count',
        inFields: `
    filters: z.object({
      searchTerm: z.string().optional(),
      os: z.string().optional(),
    }).optional(),`,
        inGetters: `
  public get filters() {
    return this._data.filters;
  }`,
        outSchema: `z.object({
    count: z.number(),
  })`,
        outGetters: `
  public get count() {
    return this._data.count;
  }`,
      },
    ],
    commands: [
      {
        name: 'push-rollout-template',
        inFields: `
    rolloutTemplateId: z.string(),
    clientIds: z.array(z.string()),`,
        inGetters: `
  public get rolloutTemplateId() {
    return this._data.rolloutTemplateId;
  }

  public get clientIds() {
    return this._data.clientIds;
  }`,
        outSchema: `z.object({
    success: z.boolean(),
    jobId: z.string().optional(),
  })`,
        outGetters: `
  public get success() {
    return this._data.success;
  }

  public get jobId() {
    return this._data.jobId;
  }`,
      },
    ],
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function toPascalCase(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
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
// GENERATORS
// ============================================================================

function generateQueryIn(query: QueryDefinition, resourceName: string): string {
  const className = toPascalCase(query.name) + 'In';

  return `import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';

export class ${className} {
  public static schema = z.object({${query.inFields}
  });

  private constructor(private readonly _data: z.infer<typeof ${className}.schema>) {}

  public static create(data: z.infer<typeof ${className}.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: ${className}.schema,
      failLogMessage: '${className} create factory validation failed',
      factory: (validData) => new ${className}(validData),
    });
  }
${query.inGetters}
}
`;
}

function generateQueryOut(
  query: QueryDefinition,
  resourceName: string
): string {
  const className = toPascalCase(query.name) + 'Out';
  const imports = query.outImports || '';

  return `import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';
${imports}

export class ${className} {
  public static schema = ${query.outSchema};

  private constructor(private readonly _data: z.infer<typeof ${className}.schema>) {}

  public static create(data: z.infer<typeof ${className}.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: ${className}.schema,
      failLogMessage: '${className} create factory validation failed',
      factory: (validData) => new ${className}(validData),
    });
  }
${query.outGetters}
}
`;
}

function generateQueryPort(
  query: QueryDefinition,
  resourceName: string
): string {
  const baseName = toPascalCase(query.name);
  const inClass = baseName + 'In';
  const outClass = baseName + 'Out';
  const portName = baseName + 'QueryPrimaryPort';
  const kebabName = query.name;

  return `import { ${inClass} } from './${kebabName}.in';
import { ${outClass} } from './${kebabName}.out';

export interface ${portName} {
  execute(input: ${inClass}): Promise<${outClass}>;
}
`;
}

function generateCommandIn(
  command: CommandDefinition,
  resourceName: string
): string {
  const className = toPascalCase(command.name) + 'CommandIn';
  const imports = command.inImports || '';

  return `import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';
${imports}

export class ${className} {
  public static schema = z.object({${command.inFields}
  });

  private constructor(private readonly _data: z.infer<typeof ${className}.schema>) {}

  public static create(data: z.infer<typeof ${className}.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: ${className}.schema,
      failLogMessage: '${className} create factory validation failed',
      factory: (validData) => new ${className}(validData),
    });
  }
${command.inGetters}
}
`;
}

function generateCommandOut(
  command: CommandDefinition,
  resourceName: string
): string {
  const className = toPascalCase(command.name) + 'CommandOut';
  const imports = command.outImports || '';

  return `import { safeGenericObjectCreate } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { z } from 'zod';
${imports}

export class ${className} {
  public static schema = ${command.outSchema};

  private constructor(private readonly _data: z.infer<typeof ${className}.schema>) {}

  public static create(data: z.infer<typeof ${className}.schema>) {
    return safeGenericObjectCreate({
      data,
      schema: ${className}.schema,
      failLogMessage: '${className} create factory validation failed',
      factory: (validData) => new ${className}(validData),
    });
  }
${command.outGetters}
}
`;
}

function generateCommandPort(
  command: CommandDefinition,
  resourceName: string
): string {
  const baseName = toPascalCase(command.name);
  const inClass = baseName + 'CommandIn';
  const outClass = baseName + 'CommandOut';
  const portName = baseName + 'CommandPrimaryPort';
  const kebabName = command.name;

  return `import { ${inClass} } from './${kebabName}.command.in';
import { ${outClass} } from './${kebabName}.command.out';

export interface ${portName} {
  execute(input: ${inClass}): Promise<${outClass}>;
}
`;
}

function generateQueryIndex(query: QueryDefinition): string {
  const kebabName = query.name;
  return `export * from './${kebabName}.in';
export * from './${kebabName}.out';
export * from './${kebabName}.query.port';
`;
}

function generateCommandIndex(command: CommandDefinition): string {
  const kebabName = command.name;
  return `export * from './${kebabName}.command.in';
export * from './${kebabName}.command.out';
export * from './${kebabName}.command.port';
`;
}

function generateQueriesIndex(queries: QueryDefinition[]): string {
  return queries.map((q) => `export * from './${q.name}';`).join('\n') + '\n';
}

function generateCommandsIndex(commands: CommandDefinition[]): string {
  return commands.map((c) => `export * from './${c.name}';`).join('\n') + '\n';
}

function generateResourceIndex(resource: ResourceDefinition): string {
  const exports: string[] = [];
  if (resource.queries.length > 0) {
    exports.push(`export * from './queries';`);
  }
  if (resource.commands && resource.commands.length > 0) {
    exports.push(`export * from './commands';`);
  }
  return exports.join('\n') + '\n';
}

function generatePrimaryIndex(resources: ResourceDefinition[]): string {
  return (
    resources.map((r) => `export * from './${r.name}';`).join('\n') + '\n'
  );
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main(): void {
  console.log('🚀 Generating Primary Ports for ACMP Connector BC\n');

  // Create primary ports directory
  ensureDir(BC_PATH);

  for (const resource of resources) {
    console.log(`\n📦 Processing resource: ${resource.name}`);

    const resourcePath = path.join(BC_PATH, resource.name);
    ensureDir(resourcePath);

    // Generate queries
    if (resource.queries.length > 0) {
      const queriesPath = path.join(resourcePath, 'queries');
      ensureDir(queriesPath);

      for (const query of resource.queries) {
        const queryPath = path.join(queriesPath, query.name);
        ensureDir(queryPath);

        // Generate .in.ts
        writeFile(
          path.join(queryPath, `${query.name}.in.ts`),
          generateQueryIn(query, resource.name)
        );

        // Generate .out.ts
        writeFile(
          path.join(queryPath, `${query.name}.out.ts`),
          generateQueryOut(query, resource.name)
        );

        // Generate .query.port.ts
        writeFile(
          path.join(queryPath, `${query.name}.query.port.ts`),
          generateQueryPort(query, resource.name)
        );

        // Generate index.ts
        writeFile(
          path.join(queryPath, 'index.ts'),
          generateQueryIndex(query)
        );
      }

      // Generate queries/index.ts
      writeFile(
        path.join(queriesPath, 'index.ts'),
        generateQueriesIndex(resource.queries)
      );
    }

    // Generate commands
    if (resource.commands && resource.commands.length > 0) {
      const commandsPath = path.join(resourcePath, 'commands');
      ensureDir(commandsPath);

      for (const command of resource.commands) {
        const commandPath = path.join(commandsPath, command.name);
        ensureDir(commandPath);

        // Generate .command.in.ts
        writeFile(
          path.join(commandPath, `${command.name}.command.in.ts`),
          generateCommandIn(command, resource.name)
        );

        // Generate .command.out.ts
        writeFile(
          path.join(commandPath, `${command.name}.command.out.ts`),
          generateCommandOut(command, resource.name)
        );

        // Generate .command.port.ts
        writeFile(
          path.join(commandPath, `${command.name}.command.port.ts`),
          generateCommandPort(command, resource.name)
        );

        // Generate index.ts
        writeFile(
          path.join(commandPath, 'index.ts'),
          generateCommandIndex(command)
        );
      }

      // Generate commands/index.ts
      writeFile(
        path.join(commandsPath, 'index.ts'),
        generateCommandsIndex(resource.commands)
      );
    }

    // Generate resource index.ts
    writeFile(
      path.join(resourcePath, 'index.ts'),
      generateResourceIndex(resource)
    );
  }

  // Generate primary/index.ts
  writeFile(path.join(BC_PATH, 'index.ts'), generatePrimaryIndex(resources));

  console.log('\n✅ Generation complete!');
  console.log(`\n📊 Summary:`);
  console.log(`   Resources: ${resources.length}`);
  console.log(
    `   Queries: ${resources.reduce((acc, r) => acc + r.queries.length, 0)}`
  );
  console.log(
    `   Commands: ${resources.reduce((acc, r) => acc + (r.commands?.length || 0), 0)}`
  );
}

main();

