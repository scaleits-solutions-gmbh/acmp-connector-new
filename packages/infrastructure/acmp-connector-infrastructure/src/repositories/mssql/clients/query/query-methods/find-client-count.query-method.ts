import { MssqlUtils } from '@/infra/mssql/client';
import { FindPaginatedClientsFilters } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';

export async function findClientCountQueryMethod(filters?: FindPaginatedClientsFilters): Promise<number> {
  const query = `
      SELECT COUNT(*) as count FROM CLT_CLIENTS_TABLE
      WHERE COMPUTERNAME LIKE @searchPattern
        AND (@tenantId IS NULL OR TenantId = @tenantId)
    `;
  const params = {
    searchPattern: filters?.searchTerm ? `%${filters.searchTerm}%` : '%',
    tenantId: filters?.tenantId || null,
  };
  return (await MssqlUtils.scalar<number>(query, params)) || 0;
}
