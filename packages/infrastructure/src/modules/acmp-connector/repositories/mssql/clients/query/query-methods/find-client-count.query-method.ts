import { MssqlUtils } from 'acmp-connector/config/mssql/client';
import { FindPaginatedClientsFilters } from '@repo/modules/acmp-connector';

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
