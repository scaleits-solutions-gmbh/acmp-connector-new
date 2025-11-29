import { FindPaginatedJobsIn } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { GetJobsHttpRequest } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function findPaginatedJobsHttpRequestMapper(request: GetJobsHttpRequest): FindPaginatedJobsIn {
  return FindPaginatedJobsIn.create({
    paginationOptions: {
      page: request.queryParams.page ?? 1,
      pageSize: request.queryParams.pageSize ?? 10,
    },
    filters: {
      searchTerm: request.queryParams.search,
    },
  });
}
