import { MssqlUtils } from '@/infra/mssql/client';
import { FindPaginatedJobsFilters } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';

export async function findJobCountQueryMethod(filters?: FindPaginatedJobsFilters): Promise<number> {
  const query = `
      SELECT COUNT(*) as count FROM SYS_Jobs_Logs
      WHERE JobKind IN (4, 25) AND (@searchPattern IS NULL OR JobName LIKE @searchPattern)
    `;
  const params = { searchPattern: filters?.searchTerm ? `%${filters.searchTerm}%` : null };
  return (await MssqlUtils.scalar<number>(query, params)) || 0;
}
