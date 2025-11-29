import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';
import { AcmpJobReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { MssqlUtils } from '@/infra/mssql/client';
import { FindPaginatedJobsFilters } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { findJobCountQueryMethod } from './find-job-count.query-method';

export async function findPaginatedJobsQueryMethod(pagination: PaginationOption, filters?: FindPaginatedJobsFilters): Promise<PaginatedData<AcmpJobReadModel>> {
  const page = pagination.page ?? 1;
  const pageSize = pagination.pageSize ?? 10;

  const query = `
      SELECT jl.JobId AS id, jl.JobName AS jobName,
        CASE WHEN jl.JobKind = 4 THEN 'Client Command' WHEN jl.JobKind = 25 THEN 'Rollout' ELSE 'Other' END AS kind,
        CASE WHEN jl.Origin = 0 THEN 'Pushed' WHEN jl.Origin = 1 THEN 'Scheduled' ELSE 'Other' END AS origin,
        DATEADD(SECOND, (jl.CreationDate - FLOOR(jl.CreationDate)) * 86400, DATEADD(DAY, FLOOR(jl.CreationDate), '1899-12-30')) AS dateTime
      FROM SYS_Jobs_Logs AS jl
      WHERE jl.JobKind IN (4, 25) AND (@searchPattern IS NULL OR jl.JobName LIKE @searchPattern)
      ORDER BY jl.CreationDate DESC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
    `;
  const offset = (page - 1) * pageSize;
  const params = { searchPattern: filters?.searchTerm ? `%${filters.searchTerm}%` : null, offset, pageSize };
  const rows = await MssqlUtils.query(query, params);
  const total = await findJobCountQueryMethod(filters);
  const totalPages = Math.ceil(total / pageSize);
  return { data: rows, total, page, pageSize, totalPages };
}
