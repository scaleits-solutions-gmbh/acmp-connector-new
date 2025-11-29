import { MssqlUtils } from '@/infra/mssql/client';
import { FindPaginatedClientInstalledSoftwareFilters } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';

export async function findClientInstalledSoftwareCountQueryMethod(clientId: string, filters?: FindPaginatedClientInstalledSoftwareFilters): Promise<number> {
  const query = `
      SELECT COUNT(*) as count FROM SYS_SW_SETUP s JOIN CLT_SW_SETUP cs ON s.SWSETUPID = cs.SWSETUPID
      WHERE cs.CLIENTID = @clientId AND (@searchPattern IS NULL OR s.NAME LIKE @searchPattern)
    `;
  const params = { clientId, searchPattern: filters?.searchTerm ? `%${filters.searchTerm}%` : null };
  return (await MssqlUtils.scalar<number>(query, params)) || 0;
}
