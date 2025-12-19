import { FindPaginatedClientHardDrivesIn } from 'acmp-connector-bounded-context';
import { GetClientHardDrivesHttpRequest } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function findPaginatedClientHardDrivesHttpRequestMapper(request: GetClientHardDrivesHttpRequest): FindPaginatedClientHardDrivesIn {
  return FindPaginatedClientHardDrivesIn.create({
    clientId: request.pathParams.clientId,
    paginationOptions: {
      page: request.queryParams.page ?? 1,
      pageSize: request.queryParams.pageSize ?? 10,
    },
  });
}
