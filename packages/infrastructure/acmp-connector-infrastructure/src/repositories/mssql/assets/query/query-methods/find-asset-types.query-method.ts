import { AcmpAssetTypeListItemReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { MssqlUtils } from '@/infra/mssql/client';

export async function findAssetTypesQueryMethod(): Promise<AcmpAssetTypeListItemReadModel[]> {
  const query = `
      ;WITH TypeTree AS (
        SELECT t.Id, t.Name, t.ParentId, CAST(CONVERT(char(36), t.Id) AS varchar(4000)) AS SortPath, CAST(0 AS int) AS Lvl
        FROM [SYS_Assets_Types] AS t WHERE t.ParentId IS NULL
        UNION ALL
        SELECT c.Id, c.Name, c.ParentId, CAST(tt.SortPath + '/' + CONVERT(char(36), c.Id) AS varchar(4000)), tt.Lvl + 1
        FROM [SYS_Assets_Types] AS c JOIN TypeTree AS tt ON c.ParentId = tt.Id
      )
      SELECT Id AS id, Name AS name FROM TypeTree ORDER BY SortPath OPTION (MAXRECURSION 32767)
    `;
  return MssqlUtils.query(query);
}
