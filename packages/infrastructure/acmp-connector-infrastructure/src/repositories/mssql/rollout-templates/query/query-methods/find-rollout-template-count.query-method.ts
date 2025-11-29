import { MssqlUtils } from '@/infra/mssql/client';
import { FindPaginatedRolloutTemplatesFilters } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';

export async function findRolloutTemplateCountQueryMethod(filters?: FindPaginatedRolloutTemplatesFilters): Promise<number> {
  const query = `SELECT COUNT(*) as count FROM SYS_OSD_RolloutTemplates WHERE (@searchPattern IS NULL OR Name LIKE @searchPattern) AND (@os IS NULL OR OSEdition = @os)`;
  const params = { searchPattern: filters?.searchTerm ? `%${filters.searchTerm}%` : null, os: filters?.os || null };
  return (await MssqlUtils.scalar<number>(query, params)) || 0;
}
