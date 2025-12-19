import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';
import { AcmpClientInstalledSoftwareListItemReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { MssqlUtils } from 'acmp-connector/config/mssql/client';
import { FindPaginatedClientInstalledSoftwareFilters } from '@repo/modules/acmp-connector';
import { findClientInstalledSoftwareCountQueryMethod } from './find-client-installed-software-count.query-method';

export async function findPaginatedClientInstalledSoftwareQueryMethod(
  clientId: string,
  pagination: PaginationOption,
  filters?: FindPaginatedClientInstalledSoftwareFilters,
): Promise<PaginatedData<AcmpClientInstalledSoftwareListItemReadModel>> {
  const page = pagination.page ?? 1;
  const pageSize = pagination.pageSize ?? 10;

  const query = `
      SELECT s.SWSETUPID AS id, s.NAME AS name, s.VERSION AS version, s.PUBLISHER AS publisher,
        CASE WHEN LEN(cs.INSTALLDATE) = 8 AND cs.INSTALLDATE NOT LIKE '%[^0-9]%'
          THEN TRY_CONVERT(datetime2, cs.INSTALLDATE, 112) ELSE NULL END AS installDate
      FROM SYS_SW_SETUP AS s JOIN CLT_SW_SETUP AS cs ON s.SWSETUPID = cs.SWSETUPID
      WHERE cs.CLIENTID = @clientId AND (@searchPattern IS NULL OR s.NAME LIKE @searchPattern)
      ORDER BY s.NAME ASC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
    `;
  const offset = (page - 1) * pageSize;
  const params = { clientId, offset, pageSize, searchPattern: filters?.searchTerm ? `%${filters.searchTerm}%` : null };
  const rows = await MssqlUtils.query(query, params);
  const total = await findClientInstalledSoftwareCountQueryMethod(clientId, filters);
  const data = rows.map((r) => ({
    ...r,
    version: r.version ?? '',
    publisher: r.publisher ?? '',
    installDate: r.installDate ?? undefined,
  }));
  const totalPages = Math.ceil(total / pageSize);
  return { data, total, page, pageSize, totalPages };
}
