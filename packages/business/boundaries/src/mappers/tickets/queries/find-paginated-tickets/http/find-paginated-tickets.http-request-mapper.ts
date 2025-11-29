import { FindPaginatedTicketsIn } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { GetTicketsHttpRequest } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function findPaginatedTicketsHttpRequestMapper(request: GetTicketsHttpRequest): FindPaginatedTicketsIn {
  return FindPaginatedTicketsIn.create({
    paginationOptions: {
      page: request.queryParams.page ?? 1,
      pageSize: request.queryParams.pageSize ?? 10,
    },
    filters: {
      searchTerm: request.queryParams.search,
    },
  });
}
