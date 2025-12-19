import { FindPaginatedClientInstalledSoftwareIn } from 'acmp-connector-bounded-context';
import { GetClientInstalledSoftwareHttpRequest } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function findPaginatedClientInstalledSoftwareHttpRequestMapper(request: GetClientInstalledSoftwareHttpRequest): FindPaginatedClientInstalledSoftwareIn {
  return FindPaginatedClientInstalledSoftwareIn.create({
    clientId: request.pathParams.clientId,
    paginationOptions: {
      page: request.queryParams.page ?? 1,
      pageSize: request.queryParams.pageSize ?? 10,
    },
    filters: {
      searchTerm: request.queryParams.search,
    },
  });
}
