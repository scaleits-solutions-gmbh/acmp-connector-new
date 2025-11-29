import { MssqlUtils } from '@/infra/mssql/client';
import { FindPaginatedAssetsFilters } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';

export async function findAssetCountQueryMethod(filters?: FindPaginatedAssetsFilters): Promise<number> {
  const query = `
      ;WITH TypeTree AS (
        SELECT t.Id FROM [SYS_Assets_Types] t WHERE t.Id = @typeId
        UNION ALL SELECT c.Id FROM [SYS_Assets_Types] c JOIN TypeTree tt ON c.ParentId = tt.Id
      )
      SELECT COUNT(*) as count FROM [SYS_Assets] WHERE (@searchPattern IS NULL OR Name LIKE @searchPattern) AND (@typeId IS NULL OR AssetTypeId IN (SELECT Id FROM TypeTree))
    `;
  const params = { searchPattern: filters?.searchTerm ? `%${filters.searchTerm}%` : null, typeId: filters?.assetType || null };
  return (await MssqlUtils.scalar<number>(query, params)) || 0;
}
