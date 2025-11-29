import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';
import { AcmpClientHardDriveListItemReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { MssqlUtils } from '@/infra/mssql/client';
import { findClientHardDriveCountQueryMethod } from './find-client-hard-drive-count.query-method';

export async function findPaginatedClientHardDrivesQueryMethod(clientId: string, pagination: PaginationOption): Promise<PaginatedData<AcmpClientHardDriveListItemReadModel>> {
  const page = pagination.page ?? 1;
  const pageSize = pagination.pageSize ?? 10;

  const query = `
      SELECT Model AS model, MediaType AS mediaType, Size AS size
      FROM CLT_HDW_HARDDRIVES WHERE CLIENTID = @clientId
      ORDER BY Model ASC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
    `;
  const offset = (page - 1) * pageSize;
  const rows = await MssqlUtils.query(query, { clientId, offset, pageSize });
  const total = await findClientHardDriveCountQueryMethod(clientId);
  const data = rows.map((r, i) => ({ id: `${clientId}:${r.model}:${i}`, ...r }));
  const totalPages = Math.ceil(total / pageSize);
  return { data, total, page, pageSize, totalPages };
}
