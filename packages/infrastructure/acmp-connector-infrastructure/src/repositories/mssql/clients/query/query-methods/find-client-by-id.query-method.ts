import { AcmpClientReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { MssqlUtils } from '@/infra/mssql/client';

export async function findClientByIdQueryMethod(id: string): Promise<AcmpClientReadModel | null> {
  const query = `
      SELECT
        c.CLIENTID AS id, c.CLIENTNO AS clientNo, cad.ComputerDomainFQDN AS domainFqdn,
        c.COMPUTERNAME AS computerName, c.TenantId AS tenantId, t.Name AS tenantName,
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
    `;
  const rows = await MssqlUtils.query(query, { id });
  const r = rows[0];
  if (!r) return null;
  return {
    ...r,
    hasBattery: String(r.hasBattery).toLowerCase() === 'true',
    batteryHealth: r.batteryHealth ? Number(r.batteryHealth) : undefined,
    lastLoggedOnUser: r.lastLoggedOnUser ?? undefined,
  };
}
