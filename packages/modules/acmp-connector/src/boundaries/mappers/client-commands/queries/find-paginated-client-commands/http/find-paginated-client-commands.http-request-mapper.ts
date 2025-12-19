import { FindPaginatedClientCommandsIn } from 'acmp-connector-bounded-context';
import { GetClientCommandsHttpRequest } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function findPaginatedClientCommandsHttpRequestMapper(request: GetClientCommandsHttpRequest): FindPaginatedClientCommandsIn {
  return FindPaginatedClientCommandsIn.create({
    paginationOptions: {
      page: request.queryParams.page ?? 1,
      pageSize: request.queryParams.pageSize ?? 10,
    },
    filters: {
      searchTerm: request.queryParams.searchTerm,
    },
  });
}
