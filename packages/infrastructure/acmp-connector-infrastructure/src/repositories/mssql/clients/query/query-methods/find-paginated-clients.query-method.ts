import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';
import { AcmpClientReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { MssqlUtils } from '@/infra/mssql/client';
import { FindPaginatedClientsFilters } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { findClientCountQueryMethod } from './find-client-count.query-method';

export async function findPaginatedClientsQueryMethod(pagination: PaginationOption, filters?: FindPaginatedClientsFilters): Promise<PaginatedData<AcmpClientReadModel>> {
  const page = pagination.page ?? 1;
  const pageSize = pagination.pageSize ?? 10;

  const query = `
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
    `;
  const offset = (page - 1) * pageSize;
  const params = {
    searchPattern: filters?.searchTerm ? `%${filters.searchTerm}%` : '%',
    tenantId: filters?.tenantId || null,
    offset,
    pageSize,
  };
  const rows = await MssqlUtils.query(query, params);
  const total = await findClientCountQueryMethod(filters);
  const data = rows.map(r => ({
    ...r,
    hasBattery: String(r.hasBattery).toLowerCase() === 'true',
    batteryHealth: r.batteryHealth ? Number(r.batteryHealth) : undefined,
    lastLoggedOnUser: r.lastLoggedOnUser ?? undefined,
  }));
  const totalPages = Math.ceil(total / pageSize);
  return { data, total, page, pageSize, totalPages };
}
