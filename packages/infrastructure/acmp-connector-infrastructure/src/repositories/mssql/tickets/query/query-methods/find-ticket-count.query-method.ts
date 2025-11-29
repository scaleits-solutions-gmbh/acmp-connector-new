import { MssqlUtils } from '@/infra/mssql/client';
import { FindPaginatedTicketsFilters } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';

export async function findTicketCountQueryMethod(filters?: FindPaginatedTicketsFilters): Promise<number> {
  const query = `SELECT COUNT(*) as count FROM dbo.SYS_HD_Tickets WHERE (@searchPattern IS NULL OR Caption LIKE @searchPattern)`;
  const params = { searchPattern: filters?.searchTerm ? `%${filters.searchTerm}%` : null };
  return (await MssqlUtils.scalar<number>(query, params)) || 0;
}
