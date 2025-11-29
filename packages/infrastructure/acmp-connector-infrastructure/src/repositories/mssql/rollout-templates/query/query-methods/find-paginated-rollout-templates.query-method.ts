import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';
import { AcmpRolloutTemplateListItemReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { MssqlUtils } from '@/infra/mssql/client';
import { FindPaginatedRolloutTemplatesFilters } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { findRolloutTemplateCountQueryMethod } from './find-rollout-template-count.query-method';

export async function findPaginatedRolloutTemplatesQueryMethod(pagination: PaginationOption, filters?: FindPaginatedRolloutTemplatesFilters): Promise<PaginatedData<AcmpRolloutTemplateListItemReadModel>> {
  const page = pagination.page ?? 1;
  const pageSize = pagination.pageSize ?? 10;

  const query = `
      SELECT TemplateId AS id, Name AS name, OSEdition AS os
      FROM SYS_OSD_RolloutTemplates
      WHERE (@searchPattern IS NULL OR Name LIKE @searchPattern) AND (@os IS NULL OR OSEdition = @os)
      ORDER BY Name ASC OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
    `;
  const offset = (page - 1) * pageSize;
  const params = { searchPattern: filters?.searchTerm ? `%${filters.searchTerm}%` : null, os: filters?.os || null, offset, pageSize };
  const rows = await MssqlUtils.query(query, params);
  const total = await findRolloutTemplateCountQueryMethod(filters);
  const totalPages = Math.ceil(total / pageSize);
  return { data: rows, total, page, pageSize, totalPages };
}
