import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData, paginateExternalData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';
import { AcmpClientCommandReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { MssqlUtils } from '@/infra/mssql/client';
import { FindPaginatedClientCommandsFilters } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { findClientCommandCountQueryMethod } from './find-client-command-count.query-method';

export async function findPaginatedClientCommandsQueryMethod(pagination: PaginationOption, filters?: FindPaginatedClientCommandsFilters): Promise<PaginatedData<AcmpClientCommandReadModel>> {
  const page = pagination.page ?? 1;
  const pageSize = pagination.pageSize ?? 10;
  
  const query = `
      WITH RankedScripts AS (
        SELECT ScriptID AS id, Description AS name, ScriptVersion AS version,
          ROW_NUMBER() OVER (PARTITION BY ScriptID ORDER BY ScriptVersion DESC) AS rn
        FROM SYS_SCRIPTS WHERE (@searchPattern IS NULL OR Description LIKE @searchPattern)
      )
      SELECT id, name, version FROM RankedScripts WHERE rn = 1
      ORDER BY name ASC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
    `;
  const offset = (page - 1) * pageSize;
  const params = { searchPattern: filters?.searchTerm ? `%${filters.searchTerm}%` : null, offset, pageSize };
  const rows = await MssqlUtils.query(query, params);
  const total = await findClientCommandCountQueryMethod(filters);
  const totalPages = Math.ceil(total / pageSize);
  return { data: rows, total, page, pageSize, totalPages };
}
