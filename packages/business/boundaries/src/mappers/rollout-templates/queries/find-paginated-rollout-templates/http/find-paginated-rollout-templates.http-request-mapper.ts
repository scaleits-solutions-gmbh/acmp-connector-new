import { FindPaginatedRolloutTemplatesIn } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { GetRolloutTemplatesHttpRequest } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function findPaginatedRolloutTemplatesHttpRequestMapper(request: GetRolloutTemplatesHttpRequest): FindPaginatedRolloutTemplatesIn {
  return FindPaginatedRolloutTemplatesIn.create({
    paginationOptions: {
      page: request.queryParams.page ?? 1,
      pageSize: request.queryParams.pageSize ?? 10,
    },
    filters: {
      searchTerm: request.queryParams.searchTerm,
    },
  });
}
