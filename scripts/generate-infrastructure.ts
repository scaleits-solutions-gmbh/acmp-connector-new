/**
 * Script to generate infrastructure layer for ACMP Connector
 *
 * Run with: npx tsx scripts/generate-infrastructure.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const INFRA_PATH = 'packages/infrastructure/acmp-connector-infrastructure/src';

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
// MSSQL CLIENT
// ============================================================================

const mssqlClientContent = `import * as sql from 'mssql';

/**
 * MSSQL Connection Configuration Interface
 */
export interface MssqlConfig {
  server: string;
  port: number;
  database: string;
  user: string;
  password: string;
  connectionTimeout: number;
  requestTimeout: number;
  options: {
    encrypt: boolean;
    trustServerCertificate: boolean;
    enableArithAbort: boolean;
  };
  pool: {
    max: number;
    min: number;
    idleTimeoutMillis: number;
  };
}

/**
 * Environment-based configuration with defaults
 */
const getConfigFromEnv = (): MssqlConfig => ({
  server: process.env.DB_SERVER || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433', 10),
  database: process.env.DB_NAME || 'ACMP',
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '',
  connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '60000', 10),
  requestTimeout: parseInt(process.env.DB_REQUEST_TIMEOUT || '30000', 10),
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_CERT !== 'false',
    enableArithAbort: true,
  },
  pool: {
    max: parseInt(process.env.DB_POOL_MAX || '10', 10),
    min: parseInt(process.env.DB_POOL_MIN || '0', 10),
    idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_TIMEOUT || '30000', 10),
  },
});

/**
 * MSSQL Connection Manager Singleton
 */
class MssqlConnectionManager {
  private static instance: MssqlConnectionManager;
  private pool: sql.ConnectionPool | null = null;
  private config: MssqlConfig;
  private isConnected = false;
  private connectionPromise: Promise<void> | null = null;

  private constructor() {
    this.config = getConfigFromEnv();
  }

  public static getInstance(): MssqlConnectionManager {
    if (!MssqlConnectionManager.instance) {
      MssqlConnectionManager.instance = new MssqlConnectionManager();
    }
    return MssqlConnectionManager.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected && this.pool) return;
    if (this.connectionPromise) return this.connectionPromise;

    this.connectionPromise = this.initializeConnection();
    try {
      await this.connectionPromise;
      this.isConnected = true;
    } catch (error) {
      this.connectionPromise = null;
      throw error;
    }
  }

  private async initializeConnection(): Promise<void> {
    this.pool = new sql.ConnectionPool(this.config);
    this.pool.on('close', () => { this.isConnected = false; });
    this.pool.on('error', () => { this.isConnected = false; });
    await this.pool.connect();
  }

  public async getPool(): Promise<sql.ConnectionPool> {
    if (!this.pool || !this.isConnected) await this.connect();
    if (!this.pool) throw new Error('MSSQL connection not established');
    return this.pool;
  }

  public async executeQuery<T = any>(query: string, params?: Record<string, any>): Promise<sql.IResult<T>> {
    const pool = await this.getPool();
    const request = pool.request();
    if (params) {
      Object.entries(params).forEach(([key, value]) => request.input(key, value));
    }
    return request.query<T>(query);
  }

  public async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.close();
      this.isConnected = false;
      this.pool = null;
      this.connectionPromise = null;
    }
  }
}

export const mssqlManager = MssqlConnectionManager.getInstance();

/**
 * Convenience functions for common operations
 */
export const MssqlUtils = {
  async query<T = any>(sqlQuery: string, params?: Record<string, any>): Promise<T[]> {
    const result = await mssqlManager.executeQuery<T>(sqlQuery, params);
    return result.recordset || [];
  },

  async scalar<T = any>(sqlQuery: string, params?: Record<string, any>): Promise<T | null> {
    const result = await mssqlManager.executeQuery<T>(sqlQuery, params);
    const recordset = result.recordset;
    if (!recordset || recordset.length === 0) return null;
    const firstRow = recordset[0] as Record<string, any>;
    const firstKey = Object.keys(firstRow)[0];
    return firstKey !== undefined ? (firstRow[firstKey] as T) : null;
  },
};

export { sql };
`;

// ============================================================================
// QUERY METHOD DEFINITIONS WITH SQL
// ============================================================================

interface QueryMethodDef {
  name: string;
  functionName: string;
  sql: string;
  params: string;
  returnType: string;
  imports: string;
  body: string;
}

// ============================================================================
// CLIENT QUERY METHODS
// ============================================================================

const clientQueryMethods: QueryMethodDef[] = [
  {
    name: 'find-paginated-clients',
    functionName: 'findPaginatedClientsQueryMethod',
    params: 'pagination: PaginationOption, filters?: FindPaginatedClientsFilters',
    returnType: 'Promise<PaginatedData<AcmpClientReadModel>>',
    imports: `import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData, paginateExternalData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';
import { AcmpClientReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { MssqlUtils } from '@/infra/mssql/client';
import { FindPaginatedClientsFilters } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { findClientCountQueryMethod } from './find-client-count.query-method';`,
    sql: `\`
      SELECT
        c.CLIENTID AS id, c.CLIENTNO AS clientNo, cad.ComputerDomainFQDN AS domainFqdn,
        c.COMPUTERNAME AS name, c.TenantId AS tenantId, t.Name AS tenantName,
        d.lastUpdate AS lastUpdate, d.osInstallationDate AS osInstallationDate,
        m.SystemManufacturer AS manufacturer, m.SystemModel AS model,
        cpu.PROCESSORNAME AS cpu, cpu.NumberOfCores AS cpuCoreCount,
        cpu.NumberOfLogicalProcessors AS cpuThreadCount, mem.PHYSICALTOTAL AS ram,
        CASE WHEN bat.BATTERYEXISTS = 1 THEN 'true' ELSE 'false' END AS hasBattery,
        bat.Name AS batteryName, bat.Health AS batteryHealth,
        o.OSSTRING AS osName, o.LegacyOSArchitecture AS osArchitecture,
        o.DisplayVersion AS osDisplayVersion, o.PatchLevel AS osPatchLevel,
        o.LASTLOGGEDONUSER AS lastLoggedOnUser, c.InstalledACMPVersion AS installedAcmpVersion
      FROM CLT_CLIENTS_TABLE AS c
      INNER JOIN SYS_MultiTenancy_Tenants AS t ON c.TenantId = t.Id
      INNER JOIN CLT_HDW_Machine AS m ON c.CLIENTID = m.CLIENTID
      INNER JOIN CLT_OPERATINGSYSTEM AS o ON c.CLIENTID = o.CLIENTID
      INNER JOIN CLT_HDW_CPU AS cpu ON c.CLIENTID = cpu.CLIENTID
      INNER JOIN CLT_HDW_MEMORY AS mem ON c.CLIENTID = mem.CLIENTID
      INNER JOIN CLT_HDW_BATTERY AS bat ON c.CLIENTID = bat.CLIENTID
      INNER JOIN CLT_ActiveDirectory AS cad ON c.CLIENTID = cad.ClientId
      CROSS APPLY (
        SELECT
          DATEADD(DAY, FLOOR(c.LASTUPDATE), DATEADD(SECOND, (c.LASTUPDATE - FLOOR(c.LASTUPDATE)) * 86400, '1899-12-30')) AS lastUpdate,
          DATEADD(DAY, FLOOR(o.InstallDate), DATEADD(SECOND, (o.InstallDate - FLOOR(o.InstallDate)) * 86400, '1899-12-30')) AS osInstallationDate
      ) AS d
      WHERE c.COMPUTERNAME LIKE @searchPattern
        AND (@tenantId IS NULL OR c.TenantId = @tenantId)
      ORDER BY c.CLIENTNO ASC
      OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
    \``,
    body: `const offset = (pagination.page - 1) * pagination.pageSize;
  const params = {
    searchPattern: filters?.searchTerm ? \`%\${filters.searchTerm}%\` : '%',
    tenantId: filters?.tenantId || null,
    offset,
    pageSize: pagination.pageSize,
  };
  const rows = await MssqlUtils.query(query, params);
  const total = await findClientCountQueryMethod(filters);
  const data = rows.map(r => ({
    ...r,
    hasBattery: String(r.hasBattery).toLowerCase() === 'true',
    batteryHealth: r.batteryHealth ? Number(r.batteryHealth) : undefined,
    lastLoggedOnUser: r.lastLoggedOnUser ?? undefined,
  }));
  return paginateExternalData(data, total, pagination.page, pagination.pageSize);`,
  },
  {
    name: 'find-client-by-id',
    functionName: 'findClientByIdQueryMethod',
    params: 'id: string',
    returnType: 'Promise<AcmpClientReadModel | null>',
    imports: `import { AcmpClientReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { MssqlUtils } from '@/infra/mssql/client';`,
    sql: `\`
      SELECT
        c.CLIENTID AS id, c.CLIENTNO AS clientNo, cad.ComputerDomainFQDN AS domainFqdn,
        c.COMPUTERNAME AS name, c.TenantId AS tenantId, t.Name AS tenantName,
        d.lastUpdate, d.osInstallationDate, m.SystemManufacturer AS manufacturer,
        m.SystemModel AS model, cpu.PROCESSORNAME AS cpu, cpu.NumberOfCores AS cpuCoreCount,
        cpu.NumberOfLogicalProcessors AS cpuThreadCount, mem.PHYSICALTOTAL AS ram,
        CASE WHEN bat.BATTERYEXISTS = 1 THEN 'true' ELSE 'false' END AS hasBattery,
        bat.Name AS batteryName, bat.Health AS batteryHealth, o.OSSTRING AS osName,
        o.LegacyOSArchitecture AS osArchitecture, o.DisplayVersion AS osDisplayVersion,
        o.PatchLevel AS osPatchLevel, o.LASTLOGGEDONUSER AS lastLoggedOnUser,
        c.InstalledACMPVersion AS installedAcmpVersion
      FROM CLT_CLIENTS_TABLE AS c
      INNER JOIN SYS_MultiTenancy_Tenants AS t ON c.TenantId = t.Id
      INNER JOIN CLT_HDW_Machine AS m ON c.CLIENTID = m.CLIENTID
      INNER JOIN CLT_OPERATINGSYSTEM AS o ON c.CLIENTID = o.CLIENTID
      INNER JOIN CLT_HDW_CPU AS cpu ON c.CLIENTID = cpu.CLIENTID
      INNER JOIN CLT_HDW_MEMORY AS mem ON c.CLIENTID = mem.CLIENTID
      INNER JOIN CLT_HDW_BATTERY AS bat ON c.CLIENTID = bat.CLIENTID
      INNER JOIN CLT_ActiveDirectory AS cad ON c.CLIENTID = cad.ClientId
      CROSS APPLY (
        SELECT
          DATEADD(DAY, FLOOR(c.LASTUPDATE), DATEADD(SECOND, (c.LASTUPDATE - FLOOR(c.LASTUPDATE)) * 86400, '1899-12-30')) AS lastUpdate,
          DATEADD(DAY, FLOOR(o.InstallDate), DATEADD(SECOND, (o.InstallDate - FLOOR(o.InstallDate)) * 86400, '1899-12-30')) AS osInstallationDate
      ) AS d
      WHERE c.CLIENTID = @id
    \``,
    body: `const rows = await MssqlUtils.query(query, { id });
  const r = rows[0];
  if (!r) return null;
  return {
    ...r,
    hasBattery: String(r.hasBattery).toLowerCase() === 'true',
    batteryHealth: r.batteryHealth ? Number(r.batteryHealth) : undefined,
    lastLoggedOnUser: r.lastLoggedOnUser ?? undefined,
  };`,
  },
  {
    name: 'find-client-count',
    functionName: 'findClientCountQueryMethod',
    params: 'filters?: FindPaginatedClientsFilters',
    returnType: 'Promise<number>',
    imports: `import { MssqlUtils } from '@/infra/mssql/client';
import { FindPaginatedClientsFilters } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';`,
    sql: `\`
      SELECT COUNT(*) as count FROM CLT_CLIENTS_TABLE
      WHERE COMPUTERNAME LIKE @searchPattern
        AND (@tenantId IS NULL OR TenantId = @tenantId)
    \``,
    body: `const params = {
    searchPattern: filters?.searchTerm ? \`%\${filters.searchTerm}%\` : '%',
    tenantId: filters?.tenantId || null,
  };
  return (await MssqlUtils.scalar<number>(query, params)) || 0;`,
  },
];

// Hard Drives
const clientHardDriveQueryMethods: QueryMethodDef[] = [
  {
    name: 'find-paginated-client-hard-drives',
    functionName: 'findPaginatedClientHardDrivesQueryMethod',
    params: 'clientId: string, pagination: PaginationOption',
    returnType: 'Promise<PaginatedData<AcmpClientHardDriveListItemReadModel>>',
    imports: `import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData, paginateExternalData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';
import { AcmpClientHardDriveListItemReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { MssqlUtils } from '@/infra/mssql/client';
import { findClientHardDriveCountQueryMethod } from './find-client-hard-drive-count.query-method';`,
    sql: `\`
      SELECT Model AS model, MediaType AS mediaType, Size AS size
      FROM CLT_HDW_HARDDRIVES WHERE CLIENTID = @clientId
      ORDER BY Model ASC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
    \``,
    body: `const offset = (pagination.page - 1) * pagination.pageSize;
  const rows = await MssqlUtils.query(query, { clientId, offset, pageSize: pagination.pageSize });
  const total = await findClientHardDriveCountQueryMethod(clientId);
  const data = rows.map((r, i) => ({ id: \`\${clientId}:\${r.model}:\${i}\`, ...r }));
  return paginateExternalData(data, total, pagination.page, pagination.pageSize);`,
  },
  {
    name: 'find-client-hard-drive-count',
    functionName: 'findClientHardDriveCountQueryMethod',
    params: 'clientId: string',
    returnType: 'Promise<number>',
    imports: `import { MssqlUtils } from '@/infra/mssql/client';`,
    sql: `\`SELECT COUNT(*) as count FROM CLT_HDW_HARDDRIVES WHERE CLIENTID = @clientId\``,
    body: `return (await MssqlUtils.scalar<number>(query, { clientId })) || 0;`,
  },
];

// Network Cards
const clientNetworkCardQueryMethods: QueryMethodDef[] = [
  {
    name: 'find-paginated-client-network-cards',
    functionName: 'findPaginatedClientNetworkCardsQueryMethod',
    params: 'clientId: string, pagination: PaginationOption',
    returnType: 'Promise<PaginatedData<AcmpClientNetworkCardListItemReadModel>>',
    imports: `import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData, paginateExternalData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';
import { AcmpClientNetworkCardListItemReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { MssqlUtils } from '@/infra/mssql/client';
import { findClientNetworkCardCountQueryMethod } from './find-client-network-card-count.query-method';`,
    sql: `\`
      SELECT Name AS name, IPs AS ip, Mac AS mac, DNSServerIP AS dns, Gateways AS gateway,
        Netmasks AS subnetMask, CASE WHEN UseDHCP = 1 THEN 'DHCP' ELSE 'Static' END AS addressType
      FROM CLT_HDW_NETCARDS WHERE CLIENTID = @clientId
      ORDER BY Name ASC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
    \``,
    body: `const offset = (pagination.page - 1) * pagination.pageSize;
  const rows = await MssqlUtils.query(query, { clientId, offset, pageSize: pagination.pageSize });
  const total = await findClientNetworkCardCountQueryMethod(clientId);
  const data = rows.map((r, i) => ({ id: \`\${clientId}:\${r.name}:\${i}\`, ...r }));
  return paginateExternalData(data, total, pagination.page, pagination.pageSize);`,
  },
  {
    name: 'find-client-network-card-count',
    functionName: 'findClientNetworkCardCountQueryMethod',
    params: 'clientId: string',
    returnType: 'Promise<number>',
    imports: `import { MssqlUtils } from '@/infra/mssql/client';`,
    sql: `\`SELECT COUNT(*) as count FROM CLT_HDW_NETCARDS WHERE CLIENTID = @clientId\``,
    body: `return (await MssqlUtils.scalar<number>(query, { clientId })) || 0;`,
  },
];

// Installed Software
const clientInstalledSoftwareQueryMethods: QueryMethodDef[] = [
  {
    name: 'find-paginated-client-installed-software',
    functionName: 'findPaginatedClientInstalledSoftwareQueryMethod',
    params: 'clientId: string, pagination: PaginationOption, filters?: FindPaginatedClientInstalledSoftwareFilters',
    returnType: 'Promise<PaginatedData<AcmpClientInstalledSoftwareListItemReadModel>>',
    imports: `import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData, paginateExternalData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';
import { AcmpClientInstalledSoftwareListItemReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { MssqlUtils } from '@/infra/mssql/client';
import { FindPaginatedClientInstalledSoftwareFilters } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { findClientInstalledSoftwareCountQueryMethod } from './find-client-installed-software-count.query-method';`,
    sql: `\`
      SELECT s.SWSETUPID AS id, s.NAME AS name, s.VERSION AS version, s.PUBLISHER AS publisher,
        CASE WHEN LEN(cs.INSTALLDATE) = 8 AND cs.INSTALLDATE NOT LIKE '%[^0-9]%'
          THEN TRY_CONVERT(datetime2, cs.INSTALLDATE, 112) ELSE NULL END AS installDate
      FROM SYS_SW_SETUP AS s JOIN CLT_SW_SETUP AS cs ON s.SWSETUPID = cs.SWSETUPID
      WHERE cs.CLIENTID = @clientId AND (@searchPattern IS NULL OR s.NAME LIKE @searchPattern)
      ORDER BY s.NAME ASC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
    \``,
    body: `const offset = (pagination.page - 1) * pagination.pageSize;
  const params = { clientId, offset, pageSize: pagination.pageSize, searchPattern: filters?.searchTerm ? \`%\${filters.searchTerm}%\` : null };
  const rows = await MssqlUtils.query(query, params);
  const total = await findClientInstalledSoftwareCountQueryMethod(clientId, filters);
  const data = rows.map(r => ({ ...r, version: r.version ?? '', publisher: r.publisher ?? '', installDate: r.installDate ? String(r.installDate) : '' }));
  return paginateExternalData(data, total, pagination.page, pagination.pageSize);`,
  },
  {
    name: 'find-client-installed-software-count',
    functionName: 'findClientInstalledSoftwareCountQueryMethod',
    params: 'clientId: string, filters?: FindPaginatedClientInstalledSoftwareFilters',
    returnType: 'Promise<number>',
    imports: `import { MssqlUtils } from '@/infra/mssql/client';
import { FindPaginatedClientInstalledSoftwareFilters } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';`,
    sql: `\`
      SELECT COUNT(*) as count FROM SYS_SW_SETUP s JOIN CLT_SW_SETUP cs ON s.SWSETUPID = cs.SWSETUPID
      WHERE cs.CLIENTID = @clientId AND (@searchPattern IS NULL OR s.NAME LIKE @searchPattern)
    \``,
    body: `const params = { clientId, searchPattern: filters?.searchTerm ? \`%\${filters.searchTerm}%\` : null };
  return (await MssqlUtils.scalar<number>(query, params)) || 0;`,
  },
];

// ============================================================================
// JOBS QUERY METHODS
// ============================================================================

const jobQueryMethods: QueryMethodDef[] = [
  {
    name: 'find-paginated-jobs',
    functionName: 'findPaginatedJobsQueryMethod',
    params: 'pagination: PaginationOption, filters?: FindPaginatedJobsFilters',
    returnType: 'Promise<PaginatedData<AcmpJobReadModel>>',
    imports: `import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData, paginateExternalData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';
import { AcmpJobReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { MssqlUtils } from '@/infra/mssql/client';
import { FindPaginatedJobsFilters } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { findJobCountQueryMethod } from './find-job-count.query-method';`,
    sql: `\`
      SELECT jl.JobId AS id, jl.JobName AS name,
        CASE WHEN jl.JobKind = 4 THEN 'Client Command' WHEN jl.JobKind = 25 THEN 'Rollout' ELSE 'Other' END AS type,
        CASE WHEN jl.Origin = 0 THEN 'Pushed' WHEN jl.Origin = 1 THEN 'Scheduled' ELSE 'Other' END AS origin,
        DATEADD(SECOND, (jl.CreationDate - FLOOR(jl.CreationDate)) * 86400, DATEADD(DAY, FLOOR(jl.CreationDate), '1899-12-30')) AS dateTime
      FROM SYS_Jobs_Logs AS jl
      WHERE jl.JobKind IN (4, 25) AND (@searchPattern IS NULL OR jl.JobName LIKE @searchPattern)
      ORDER BY jl.CreationDate DESC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
    \``,
    body: `const offset = (pagination.page - 1) * pagination.pageSize;
  const params = { searchPattern: filters?.searchTerm ? \`%\${filters.searchTerm}%\` : null, offset, pageSize: pagination.pageSize };
  const rows = await MssqlUtils.query(query, params);
  const total = await findJobCountQueryMethod(filters);
  return paginateExternalData(rows, total, pagination.page, pagination.pageSize);`,
  },
  {
    name: 'find-job-by-id',
    functionName: 'findJobByIdQueryMethod',
    params: 'id: string',
    returnType: 'Promise<AcmpJobReadModel | null>',
    imports: `import { AcmpJobReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { MssqlUtils } from '@/infra/mssql/client';`,
    sql: `\`
      SELECT TOP 1 jl.JobId AS id, jl.JobName AS name,
        CASE WHEN jl.JobKind = 4 THEN 'Client Command' WHEN jl.JobKind = 25 THEN 'Rollout' ELSE 'Other' END AS type,
        CASE WHEN jl.Origin = 0 THEN 'Pushed' WHEN jl.Origin = 1 THEN 'Scheduled' ELSE 'Other' END AS origin,
        DATEADD(SECOND, (jl.CreationDate - FLOOR(jl.CreationDate)) * 86400, DATEADD(DAY, FLOOR(jl.CreationDate), '1899-12-30')) AS dateTime
      FROM SYS_Jobs_Logs AS jl WHERE jl.JobId = @id
    \``,
    body: `const rows = await MssqlUtils.query(query, { id });
  return rows[0] || null;`,
  },
  {
    name: 'find-job-count',
    functionName: 'findJobCountQueryMethod',
    params: 'filters?: FindPaginatedJobsFilters',
    returnType: 'Promise<number>',
    imports: `import { MssqlUtils } from '@/infra/mssql/client';
import { FindPaginatedJobsFilters } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';`,
    sql: `\`
      SELECT COUNT(*) as count FROM SYS_Jobs_Logs
      WHERE JobKind IN (4, 25) AND (@searchPattern IS NULL OR JobName LIKE @searchPattern)
    \``,
    body: `const params = { searchPattern: filters?.searchTerm ? \`%\${filters.searchTerm}%\` : null };
  return (await MssqlUtils.scalar<number>(query, params)) || 0;`,
  },
];

// ============================================================================
// TICKETS QUERY METHODS
// ============================================================================

const ticketQueryMethods: QueryMethodDef[] = [
  {
    name: 'find-paginated-tickets',
    functionName: 'findPaginatedTicketsQueryMethod',
    params: 'pagination: PaginationOption, filters?: FindPaginatedTicketsFilters',
    returnType: 'Promise<PaginatedData<AcmpTicketListItemReadModel>>',
    imports: `import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData, paginateExternalData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';
import { AcmpTicketListItemReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { MssqlUtils } from '@/infra/mssql/client';
import { FindPaginatedTicketsFilters } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { findTicketCountQueryMethod } from './find-ticket-count.query-method';`,
    sql: `\`
      SELECT sht.TicketID AS ticketId, sht.IntTicketID AS intTicketId, sht.Caption AS caption,
        DATEADD(SECOND, (sht.CreationDate - FLOOR(sht.CreationDate)) * 86400, DATEADD(DAY, FLOOR(sht.CreationDate), '1899-12-30')) AS creationDate,
        DATEADD(SECOND, (sht.LastModified - FLOOR(sht.LastModified)) * 86400, DATEADD(DAY, FLOOR(sht.LastModified), '1899-12-30')) AS lastModified,
        shc.CategoryPath_en AS categoryEn, shc.CategoryPath_de AS categoryDe, sht.Priority AS priority,
        sts.Caption_en AS stateEn, sts.Caption_de AS stateDe, shr.FullName AS ticketContact,
        su.USERNAME AS assignee, shi.Caption_en AS impactEn, shi.Caption_de AS impactDe
      FROM dbo.SYS_HD_Tickets AS sht
      LEFT JOIN dbo.SYS_HD_Categories AS shc ON shc.CategoryID = sht.CategoryID
      LEFT JOIN dbo.SYS_HD_Tickets_States AS sts ON sts.StateID = sht.StateID
      LEFT JOIN dbo.SYS_HD_Requester AS shr ON shr.RequesterID = sht.RequesterID
      LEFT JOIN dbo.SYS_USERS AS su ON su.USER_GUID = sht.AssigneeID
      LEFT JOIN dbo.SYS_HD_Impact AS shi ON shi.ImpactID = sht.ImpactID
      WHERE (@searchPattern IS NULL OR sht.Caption LIKE @searchPattern)
      ORDER BY sht.TicketID DESC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
    \``,
    body: `const offset = (pagination.page - 1) * pagination.pageSize;
  const params = { searchPattern: filters?.searchTerm ? \`%\${filters.searchTerm}%\` : null, offset, pageSize: pagination.pageSize };
  const rows = await MssqlUtils.query(query, params);
  const total = await findTicketCountQueryMethod(filters);
  const data = rows.map(r => ({ ...r, categoryEn: r.categoryEn ?? undefined, categoryDe: r.categoryDe ?? undefined, stateEn: r.stateEn ?? undefined, stateDe: r.stateDe ?? undefined, ticketContact: r.ticketContact ?? undefined, assignee: r.assignee ?? undefined, impactEn: r.impactEn ?? undefined, impactDe: r.impactDe ?? undefined }));
  return paginateExternalData(data, total, pagination.page, pagination.pageSize);`,
  },
  {
    name: 'find-ticket-by-id',
    functionName: 'findTicketByIdQueryMethod',
    params: 'id: string',
    returnType: 'Promise<AcmpTicketListItemReadModel | null>',
    imports: `import { AcmpTicketListItemReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { MssqlUtils } from '@/infra/mssql/client';`,
    sql: `\`
      SELECT TOP 1 sht.TicketID AS ticketId, sht.IntTicketID AS intTicketId, sht.Caption AS caption,
        DATEADD(SECOND, (sht.CreationDate - FLOOR(sht.CreationDate)) * 86400, DATEADD(DAY, FLOOR(sht.CreationDate), '1899-12-30')) AS creationDate,
        DATEADD(SECOND, (sht.LastModified - FLOOR(sht.LastModified)) * 86400, DATEADD(DAY, FLOOR(sht.LastModified), '1899-12-30')) AS lastModified,
        shc.CategoryPath_en AS categoryEn, shc.CategoryPath_de AS categoryDe, sht.Priority AS priority,
        sts.Caption_en AS stateEn, sts.Caption_de AS stateDe, shr.FullName AS ticketContact,
        su.USERNAME AS assignee, shi.Caption_en AS impactEn, shi.Caption_de AS impactDe
      FROM dbo.SYS_HD_Tickets AS sht
      LEFT JOIN dbo.SYS_HD_Categories AS shc ON shc.CategoryID = sht.CategoryID
      LEFT JOIN dbo.SYS_HD_Tickets_States AS sts ON sts.StateID = sht.StateID
      LEFT JOIN dbo.SYS_HD_Requester AS shr ON shr.RequesterID = sht.RequesterID
      LEFT JOIN dbo.SYS_USERS AS su ON su.USER_GUID = sht.AssigneeID
      LEFT JOIN dbo.SYS_HD_Impact AS shi ON shi.ImpactID = sht.ImpactID
      WHERE sht.TicketID = @id
    \``,
    body: `const rows = await MssqlUtils.query(query, { id });
  const r = rows[0];
  if (!r) return null;
  return { ...r, categoryEn: r.categoryEn ?? undefined, categoryDe: r.categoryDe ?? undefined, stateEn: r.stateEn ?? undefined, stateDe: r.stateDe ?? undefined, ticketContact: r.ticketContact ?? undefined, assignee: r.assignee ?? undefined, impactEn: r.impactEn ?? undefined, impactDe: r.impactDe ?? undefined };`,
  },
  {
    name: 'find-ticket-details-by-id',
    functionName: 'findTicketDetailsByIdQueryMethod',
    params: 'id: string',
    returnType: 'Promise<AcmpTicketDetailsReadModel | null>',
    imports: `import { AcmpTicketDetailsReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { MssqlUtils } from '@/infra/mssql/client';`,
    sql: `\`
      SELECT TOP 1 sht.TicketID AS ticketId, sht.IntTicketID AS intTicketId, sht.Caption AS caption,
        DATEADD(SECOND, (sht.CreationDate - FLOOR(sht.CreationDate)) * 86400, DATEADD(DAY, FLOOR(sht.CreationDate), '1899-12-30')) AS creationDate,
        DATEADD(SECOND, (sht.LastModified - FLOOR(sht.LastModified)) * 86400, DATEADD(DAY, FLOOR(sht.LastModified), '1899-12-30')) AS lastModified,
        sht.[Description] AS description, sht.HtmlDescription AS htmlDescription,
        shc.CategoryPath_en AS categoryEn, shc.CategoryPath_de AS categoryDe, sht.Priority AS priority,
        sts.Caption_en AS stateEn, sts.Caption_de AS stateDe, sht.Keywords AS keywords,
        shr.FullName AS ticketContact, su.USERNAME AS assignee, shi.Caption_en AS impactEn, shi.Caption_de AS impactDe
      FROM dbo.SYS_HD_Tickets AS sht
      LEFT JOIN dbo.SYS_HD_Categories AS shc ON shc.CategoryID = sht.CategoryID
      LEFT JOIN dbo.SYS_HD_Tickets_States AS sts ON sts.StateID = sht.StateID
      LEFT JOIN dbo.SYS_HD_Requester AS shr ON shr.RequesterID = sht.RequesterID
      LEFT JOIN dbo.SYS_USERS AS su ON su.USER_GUID = sht.AssigneeID
      LEFT JOIN dbo.SYS_HD_Impact AS shi ON shi.ImpactID = sht.ImpactID
      WHERE sht.TicketID = @id
    \``,
    body: `const rows = await MssqlUtils.query(query, { id });
  const r = rows[0];
  if (!r) return null;
  return { ...r, description: r.description ?? undefined, htmlDescription: r.htmlDescription ?? undefined, categoryEn: r.categoryEn ?? undefined, categoryDe: r.categoryDe ?? undefined, stateEn: r.stateEn ?? undefined, stateDe: r.stateDe ?? undefined, keywords: r.keywords ?? undefined, ticketContact: r.ticketContact ?? undefined, assignee: r.assignee ?? undefined, impactEn: r.impactEn ?? undefined, impactDe: r.impactDe ?? undefined };`,
  },
  {
    name: 'find-ticket-count',
    functionName: 'findTicketCountQueryMethod',
    params: 'filters?: FindPaginatedTicketsFilters',
    returnType: 'Promise<number>',
    imports: `import { MssqlUtils } from '@/infra/mssql/client';
import { FindPaginatedTicketsFilters } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';`,
    sql: `\`SELECT COUNT(*) as count FROM dbo.SYS_HD_Tickets WHERE (@searchPattern IS NULL OR Caption LIKE @searchPattern)\``,
    body: `const params = { searchPattern: filters?.searchTerm ? \`%\${filters.searchTerm}%\` : null };
  return (await MssqlUtils.scalar<number>(query, params)) || 0;`,
  },
];

// ============================================================================
// ASSETS QUERY METHODS
// ============================================================================

const assetQueryMethods: QueryMethodDef[] = [
  {
    name: 'find-paginated-assets',
    functionName: 'findPaginatedAssetsQueryMethod',
    params: 'pagination: PaginationOption, filters?: FindPaginatedAssetsFilters',
    returnType: 'Promise<PaginatedData<AcmpAssetListItemReadModel>>',
    imports: `import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData, paginateExternalData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';
import { AcmpAssetListItemReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { MssqlUtils } from '@/infra/mssql/client';
import { FindPaginatedAssetsFilters } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { findAssetCountQueryMethod } from './find-asset-count.query-method';`,
    sql: `\`
      ;WITH TypeTree AS (
        SELECT t.Id FROM [SYS_Assets_Types] t WHERE t.Id = @typeId
        UNION ALL SELECT c.Id FROM [SYS_Assets_Types] c JOIN TypeTree tt ON c.ParentId = tt.Id
      )
      SELECT sa.Id AS id, sa.Name AS assetName, sat.Name AS assetType, sml.Path AS location,
        scc.Path AS costCenter, smd.Name AS department, smcV.Name AS vendor, smcM.Name AS manufacturer,
        smcS.Name AS servicePartner, sas.Caption_en AS stateEn, sas.Caption_de AS stateDe,
        sa.InventoryNumber AS inventoryNumber, sa.SerialNumber AS serialNumber, sa.Model AS model,
        DATEADD(SECOND, (sa.CreationDate - FLOOR(sa.CreationDate)) * 86400, DATEADD(DAY, FLOOR(sa.CreationDate), '1899-12-30')) AS creationDate,
        DATEADD(SECOND, (sa.LastModifiedDate - FLOOR(sa.LastModifiedDate)) * 86400, DATEADD(DAY, FLOOR(sa.LastModifiedDate), '1899-12-30')) AS lastModifiedDate,
        sa.IsLent AS isLent
      FROM [SYS_Assets] sa
      LEFT JOIN SYS_Assets_Types sat ON sat.Id = sa.AssetTypeId
      LEFT JOIN SYS_MasterData_Locations sml ON sml.Id = sa.LocationId
      LEFT JOIN SYS_MasterData_CostCenters scc ON scc.Id = sa.CostCenterId
      LEFT JOIN SYS_MasterData_Departments smd ON smd.Id = sa.DepartmentId
      LEFT JOIN SYS_MasterData_Companies smcV ON smcV.Id = sa.VendorId
      LEFT JOIN SYS_MasterData_Companies smcM ON smcM.Id = sa.ManufacturerId
      LEFT JOIN SYS_MasterData_Companies smcS ON smcS.Id = sa.ServicePartnerId
      LEFT JOIN SYS_Assets_States sas ON sas.Id = sa.AssetStateId
      WHERE (@searchPattern IS NULL OR sa.Name LIKE @searchPattern) AND (@typeId IS NULL OR sa.AssetTypeId IN (SELECT Id FROM TypeTree))
      ORDER BY sa.Name ASC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
    \``,
    body: `const offset = (pagination.page - 1) * pagination.pageSize;
  const params = { searchPattern: filters?.searchTerm ? \`%\${filters.searchTerm}%\` : null, typeId: filters?.assetType || null, offset, pageSize: pagination.pageSize };
  const rows = await MssqlUtils.query(query, params);
  const total = await findAssetCountQueryMethod(filters);
  const data = rows.map(r => ({ ...r, assetType: r.assetType ?? undefined, location: r.location ?? undefined, costCenter: r.costCenter ?? undefined, department: r.department ?? undefined, vendor: r.vendor ?? undefined, manufacturer: r.manufacturer ?? undefined, servicePartner: r.servicePartner ?? undefined, stateEn: r.stateEn ?? undefined, stateDe: r.stateDe ?? undefined, inventoryNumber: r.inventoryNumber ?? undefined, serialNumber: r.serialNumber ?? undefined, model: r.model ?? undefined }));
  return paginateExternalData(data, total, pagination.page, pagination.pageSize);`,
  },
  {
    name: 'find-asset-by-id',
    functionName: 'findAssetByIdQueryMethod',
    params: 'id: string',
    returnType: 'Promise<AcmpAssetListItemReadModel | null>',
    imports: `import { AcmpAssetListItemReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { MssqlUtils } from '@/infra/mssql/client';`,
    sql: `\`
      SELECT TOP 1 sa.Id AS id, sa.Name AS assetName, sat.Name AS assetType, sml.Path AS location,
        scc.Path AS costCenter, smd.Name AS department, smcV.Name AS vendor, smcM.Name AS manufacturer,
        smcS.Name AS servicePartner, sas.Caption_en AS stateEn, sas.Caption_de AS stateDe,
        sa.InventoryNumber AS inventoryNumber, sa.SerialNumber AS serialNumber, sa.Model AS model,
        DATEADD(SECOND, (sa.CreationDate - FLOOR(sa.CreationDate)) * 86400, DATEADD(DAY, FLOOR(sa.CreationDate), '1899-12-30')) AS creationDate,
        DATEADD(SECOND, (sa.LastModifiedDate - FLOOR(sa.LastModifiedDate)) * 86400, DATEADD(DAY, FLOOR(sa.LastModifiedDate), '1899-12-30')) AS lastModifiedDate,
        sa.IsLent AS isLent
      FROM [SYS_Assets] sa
      LEFT JOIN SYS_Assets_Types sat ON sat.Id = sa.AssetTypeId
      LEFT JOIN SYS_MasterData_Locations sml ON sml.Id = sa.LocationId
      LEFT JOIN SYS_MasterData_CostCenters scc ON scc.Id = sa.CostCenterId
      LEFT JOIN SYS_MasterData_Departments smd ON smd.Id = sa.DepartmentId
      LEFT JOIN SYS_MasterData_Companies smcV ON smcV.Id = sa.VendorId
      LEFT JOIN SYS_MasterData_Companies smcM ON smcM.Id = sa.ManufacturerId
      LEFT JOIN SYS_MasterData_Companies smcS ON smcS.Id = sa.ServicePartnerId
      LEFT JOIN SYS_Assets_States sas ON sas.Id = sa.AssetStateId
      WHERE sa.Id = @id
    \``,
    body: `const rows = await MssqlUtils.query(query, { id });
  const r = rows[0];
  if (!r) return null;
  return { ...r, assetType: r.assetType ?? undefined, location: r.location ?? undefined, costCenter: r.costCenter ?? undefined, department: r.department ?? undefined, vendor: r.vendor ?? undefined, manufacturer: r.manufacturer ?? undefined, servicePartner: r.servicePartner ?? undefined, stateEn: r.stateEn ?? undefined, stateDe: r.stateDe ?? undefined, inventoryNumber: r.inventoryNumber ?? undefined, serialNumber: r.serialNumber ?? undefined, model: r.model ?? undefined };`,
  },
  {
    name: 'find-asset-count',
    functionName: 'findAssetCountQueryMethod',
    params: 'filters?: FindPaginatedAssetsFilters',
    returnType: 'Promise<number>',
    imports: `import { MssqlUtils } from '@/infra/mssql/client';
import { FindPaginatedAssetsFilters } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';`,
    sql: `\`
      ;WITH TypeTree AS (
        SELECT t.Id FROM [SYS_Assets_Types] t WHERE t.Id = @typeId
        UNION ALL SELECT c.Id FROM [SYS_Assets_Types] c JOIN TypeTree tt ON c.ParentId = tt.Id
      )
      SELECT COUNT(*) as count FROM [SYS_Assets] WHERE (@searchPattern IS NULL OR Name LIKE @searchPattern) AND (@typeId IS NULL OR AssetTypeId IN (SELECT Id FROM TypeTree))
    \``,
    body: `const params = { searchPattern: filters?.searchTerm ? \`%\${filters.searchTerm}%\` : null, typeId: filters?.assetType || null };
  return (await MssqlUtils.scalar<number>(query, params)) || 0;`,
  },
  {
    name: 'find-asset-types',
    functionName: 'findAssetTypesQueryMethod',
    params: '',
    returnType: 'Promise<AcmpAssetTypeListItemReadModel[]>',
    imports: `import { AcmpAssetTypeListItemReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { MssqlUtils } from '@/infra/mssql/client';`,
    sql: `\`
      ;WITH TypeTree AS (
        SELECT t.Id, t.Name, t.ParentId, CAST(CONVERT(char(36), t.Id) AS varchar(4000)) AS SortPath, CAST(0 AS int) AS Lvl
        FROM [SYS_Assets_Types] AS t WHERE t.ParentId IS NULL
        UNION ALL
        SELECT c.Id, c.Name, c.ParentId, CAST(tt.SortPath + '/' + CONVERT(char(36), c.Id) AS varchar(4000)), tt.Lvl + 1
        FROM [SYS_Assets_Types] AS c JOIN TypeTree AS tt ON c.ParentId = tt.Id
      )
      SELECT Id AS id, Name AS name FROM TypeTree ORDER BY SortPath OPTION (MAXRECURSION 32767)
    \``,
    body: `return MssqlUtils.query(query);`,
  },
];

// ============================================================================
// CLIENT COMMANDS QUERY METHODS
// ============================================================================

const clientCommandQueryMethods: QueryMethodDef[] = [
  {
    name: 'find-paginated-client-commands',
    functionName: 'findPaginatedClientCommandsQueryMethod',
    params: 'pagination: PaginationOption, filters?: FindPaginatedClientCommandsFilters',
    returnType: 'Promise<PaginatedData<AcmpClientCommandReadModel>>',
    imports: `import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData, paginateExternalData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';
import { AcmpClientCommandReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { MssqlUtils } from '@/infra/mssql/client';
import { FindPaginatedClientCommandsFilters } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { findClientCommandCountQueryMethod } from './find-client-command-count.query-method';`,
    sql: `\`
      WITH RankedScripts AS (
        SELECT ScriptID AS id, Description AS name, ScriptVersion AS version,
          ROW_NUMBER() OVER (PARTITION BY ScriptID ORDER BY ScriptVersion DESC) AS rn
        FROM SYS_SCRIPTS WHERE (@searchPattern IS NULL OR Description LIKE @searchPattern)
      )
      SELECT id, name, version FROM RankedScripts WHERE rn = 1
      ORDER BY name ASC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
    \``,
    body: `const offset = (pagination.page - 1) * pagination.pageSize;
  const params = { searchPattern: filters?.searchTerm ? \`%\${filters.searchTerm}%\` : null, offset, pageSize: pagination.pageSize };
  const rows = await MssqlUtils.query(query, params);
  const total = await findClientCommandCountQueryMethod(filters);
  return paginateExternalData(rows, total, pagination.page, pagination.pageSize);`,
  },
  {
    name: 'find-client-command-by-id',
    functionName: 'findClientCommandByIdQueryMethod',
    params: 'id: string',
    returnType: 'Promise<AcmpClientCommandReadModel | null>',
    imports: `import { AcmpClientCommandReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { MssqlUtils } from '@/infra/mssql/client';`,
    sql: `\`
      SELECT TOP 1 ScriptID AS id, Description AS name, ScriptVersion AS version
      FROM SYS_SCRIPTS WHERE ScriptID = @id ORDER BY ScriptVersion DESC
    \``,
    body: `const rows = await MssqlUtils.query(query, { id });
  return rows[0] || null;`,
  },
  {
    name: 'find-client-command-count',
    functionName: 'findClientCommandCountQueryMethod',
    params: 'filters?: FindPaginatedClientCommandsFilters',
    returnType: 'Promise<number>',
    imports: `import { MssqlUtils } from '@/infra/mssql/client';
import { FindPaginatedClientCommandsFilters } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';`,
    sql: `\`
      SELECT COUNT(DISTINCT ScriptID) as count FROM SYS_SCRIPTS
      WHERE (@searchPattern IS NULL OR Description LIKE @searchPattern)
    \``,
    body: `const params = { searchPattern: filters?.searchTerm ? \`%\${filters.searchTerm}%\` : null };
  return (await MssqlUtils.scalar<number>(query, params)) || 0;`,
  },
];

// ============================================================================
// ROLLOUT TEMPLATES QUERY METHODS
// ============================================================================

const rolloutTemplateQueryMethods: QueryMethodDef[] = [
  {
    name: 'find-paginated-rollout-templates',
    functionName: 'findPaginatedRolloutTemplatesQueryMethod',
    params: 'pagination: PaginationOption, filters?: FindPaginatedRolloutTemplatesFilters',
    returnType: 'Promise<PaginatedData<AcmpRolloutTemplateListItemReadModel>>',
    imports: `import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData, paginateExternalData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';
import { AcmpRolloutTemplateListItemReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { MssqlUtils } from '@/infra/mssql/client';
import { FindPaginatedRolloutTemplatesFilters } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { findRolloutTemplateCountQueryMethod } from './find-rollout-template-count.query-method';`,
    sql: `\`
      SELECT TemplateId AS id, Name AS name, OSEdition AS os
      FROM SYS_OSD_RolloutTemplates
      WHERE (@searchPattern IS NULL OR Name LIKE @searchPattern) AND (@os IS NULL OR OSEdition = @os)
      ORDER BY Name ASC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
    \``,
    body: `const offset = (pagination.page - 1) * pagination.pageSize;
  const params = { searchPattern: filters?.searchTerm ? \`%\${filters.searchTerm}%\` : null, os: filters?.os || null, offset, pageSize: pagination.pageSize };
  const rows = await MssqlUtils.query(query, params);
  const total = await findRolloutTemplateCountQueryMethod(filters);
  return paginateExternalData(rows, total, pagination.page, pagination.pageSize);`,
  },
  {
    name: 'find-rollout-template-by-id',
    functionName: 'findRolloutTemplateByIdQueryMethod',
    params: 'id: string',
    returnType: 'Promise<AcmpRolloutTemplateListItemReadModel | null>',
    imports: `import { AcmpRolloutTemplateListItemReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { MssqlUtils } from '@/infra/mssql/client';`,
    sql: `\`SELECT TOP 1 TemplateId AS id, Name AS name, OSEdition AS os FROM SYS_OSD_RolloutTemplates WHERE TemplateId = @id\``,
    body: `const rows = await MssqlUtils.query(query, { id });
  return rows[0] || null;`,
  },
  {
    name: 'find-rollout-template-count',
    functionName: 'findRolloutTemplateCountQueryMethod',
    params: 'filters?: FindPaginatedRolloutTemplatesFilters',
    returnType: 'Promise<number>',
    imports: `import { MssqlUtils } from '@/infra/mssql/client';
import { FindPaginatedRolloutTemplatesFilters } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';`,
    sql: `\`SELECT COUNT(*) as count FROM SYS_OSD_RolloutTemplates WHERE (@searchPattern IS NULL OR Name LIKE @searchPattern) AND (@os IS NULL OR OSEdition = @os)\``,
    body: `const params = { searchPattern: filters?.searchTerm ? \`%\${filters.searchTerm}%\` : null, os: filters?.os || null };
  return (await MssqlUtils.scalar<number>(query, params)) || 0;`,
  },
];

// ============================================================================
// GENERATORS
// ============================================================================

function generateQueryMethod(def: QueryMethodDef): string {
  return `${def.imports}

export async function ${def.functionName}(${def.params}): ${def.returnType} {
  const query = ${def.sql};
  ${def.body}
}
`;
}

function generateQueryMethodIndex(methods: QueryMethodDef[]): string {
  return methods.map(m => `export * from './${m.name}.query-method';`).join('\n') + '\n';
}

// ============================================================================
// REPOSITORY GROUPS
// ============================================================================

interface RepoGroup {
  name: string;
  folder: string;
  queryMethods: QueryMethodDef[];
  hasWriteRepo: boolean;
}

const repoGroups: RepoGroup[] = [
  { name: 'clients', folder: 'clients', queryMethods: [...clientQueryMethods, ...clientHardDriveQueryMethods, ...clientNetworkCardQueryMethods, ...clientInstalledSoftwareQueryMethods], hasWriteRepo: false },
  { name: 'jobs', folder: 'jobs', queryMethods: jobQueryMethods, hasWriteRepo: false },
  { name: 'tickets', folder: 'tickets', queryMethods: ticketQueryMethods, hasWriteRepo: false },
  { name: 'assets', folder: 'assets', queryMethods: assetQueryMethods, hasWriteRepo: false },
  { name: 'client-commands', folder: 'client-commands', queryMethods: clientCommandQueryMethods, hasWriteRepo: true },
  { name: 'rollout-templates', folder: 'rollout-templates', queryMethods: rolloutTemplateQueryMethods, hasWriteRepo: true },
];

// ============================================================================
// MAIN
// ============================================================================

function main(): void {
  console.log('🚀 Generating Infrastructure for ACMP Connector\\n');

  // Create MSSQL client
  console.log('📦 Creating MSSQL client');
  const mssqlPath = path.join(INFRA_PATH, 'infra/mssql');
  ensureDir(mssqlPath);
  writeFile(path.join(mssqlPath, 'client.ts'), mssqlClientContent);
  writeFile(path.join(mssqlPath, 'index.ts'), `export * from './client';\\n`);

  // Create repositories
  for (const group of repoGroups) {
    console.log(`\\n📦 Processing repository: ${group.name}`);
    
    const repoPath = path.join(INFRA_PATH, 'repositories/mssql', group.folder);
    const queryMethodsPath = path.join(repoPath, 'query/query-methods');
    ensureDir(queryMethodsPath);

    // Generate query methods
    for (const method of group.queryMethods) {
      writeFile(path.join(queryMethodsPath, `${method.name}.query-method.ts`), generateQueryMethod(method));
    }
    writeFile(path.join(queryMethodsPath, 'index.ts'), generateQueryMethodIndex(group.queryMethods));
  }

  // Create index files
  const reposPath = path.join(INFRA_PATH, 'repositories');
  ensureDir(reposPath);
  writeFile(path.join(reposPath, 'index.ts'), `export * from './mssql';\\n`);
  writeFile(path.join(reposPath, 'mssql/index.ts'), repoGroups.map(g => `export * from './${g.folder}';`).join('\\n') + '\\n');
  
  for (const group of repoGroups) {
    writeFile(path.join(reposPath, 'mssql', group.folder, 'index.ts'), `export * from './query';\\n`);
    writeFile(path.join(reposPath, 'mssql', group.folder, 'query/index.ts'), `export * from './query-methods';\\n`);
  }

  // Main index
  writeFile(path.join(INFRA_PATH, 'index.ts'), `export * from './infra/mssql';\\nexport * from './repositories';\\n`);

  console.log('\\n✅ Infrastructure generation complete!');
  console.log(`\\n📊 Summary:`);
  console.log(`   Repository Groups: ${repoGroups.length}`);
  console.log(`   Query Methods: ${repoGroups.reduce((a, g) => a + g.queryMethods.length, 0)}`);
}

main();

