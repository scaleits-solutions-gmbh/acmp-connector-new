import { MssqlUtils } from 'acmp-connector/config/mssql/client';
import { FindPaginatedJobsFilters } from '@repo/modules/acmp-connector';

export async function findJobCountQueryMethod(filters?: FindPaginatedJobsFilters): Promise<number> {
  const query = `
      SELECT COUNT(*) as count FROM SYS_Jobs_Logs
      WHERE JobKind IN (4, 25) AND (@searchPattern IS NULL OR JobName LIKE @searchPattern)
    `;
  const params = { searchPattern: filters?.searchTerm ? `%${filters.searchTerm}%` : null };
  return (await MssqlUtils.scalar<number>(query, params)) || 0;
}
