import { FindPaginatedAssetsIn } from 'acmp-connector-bounded-context';
import { GetAssetsHttpRequest } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function findPaginatedAssetsHttpRequestMapper(request: GetAssetsHttpRequest): FindPaginatedAssetsIn {
  return FindPaginatedAssetsIn.create({
    paginationOptions: {
      page: request.queryParams.page ?? 1,
      pageSize: request.queryParams.pageSize ?? 10,
    },
    filters: {
      searchTerm: request.queryParams.search,
      assetType: request.queryParams.assetType,
    },
  });
}
