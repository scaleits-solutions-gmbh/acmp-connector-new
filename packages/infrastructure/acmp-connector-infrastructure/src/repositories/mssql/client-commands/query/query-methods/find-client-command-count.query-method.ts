import { MssqlUtils } from '@/infra/mssql/client';
import { FindPaginatedClientCommandsFilters } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';

export async function findClientCommandCountQueryMethod(filters?: FindPaginatedClientCommandsFilters): Promise<number> {
  const query = `
      SELECT COUNT(DISTINCT ScriptID) as count FROM SYS_SCRIPTS
      WHERE (@searchPattern IS NULL OR Description LIKE @searchPattern)
    `;
  const params = { searchPattern: filters?.searchTerm ? `%${filters.searchTerm}%` : null };
  return (await MssqlUtils.scalar<number>(query, params)) || 0;
}
