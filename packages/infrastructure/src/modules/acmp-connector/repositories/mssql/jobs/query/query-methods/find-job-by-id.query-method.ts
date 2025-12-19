import { AcmpJobReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { MssqlUtils } from 'acmp-connector/config/mssql/client';

export async function findJobByIdQueryMethod(id: string): Promise<AcmpJobReadModel | null> {
  const query = `
      SELECT TOP 1 jl.JobId AS id, jl.JobName AS name,
        CASE WHEN jl.JobKind = 4 THEN 'Client Command' WHEN jl.JobKind = 25 THEN 'Rollout' ELSE 'Other' END AS type,
        CASE WHEN jl.Origin = 0 THEN 'Pushed' WHEN jl.Origin = 1 THEN 'Scheduled' ELSE 'Other' END AS origin,
        DATEADD(SECOND, (jl.CreationDate - FLOOR(jl.CreationDate)) * 86400, DATEADD(DAY, FLOOR(jl.CreationDate), '1899-12-30')) AS dateTime
      FROM SYS_Jobs_Logs AS jl WHERE jl.JobId = @id
    `;
  const rows = await MssqlUtils.query(query, { id });
  if (!rows[0]) return null;
  return {
    ...rows[0],
    author: undefined,
    status: 'Unknown',
  };
}
