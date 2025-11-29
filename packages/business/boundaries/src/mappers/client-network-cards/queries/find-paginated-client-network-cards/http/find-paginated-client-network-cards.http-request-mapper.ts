import { FindPaginatedClientNetworkCardsIn } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { GetClientNetworkCardsHttpRequest } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function findPaginatedClientNetworkCardsHttpRequestMapper(request: GetClientNetworkCardsHttpRequest): FindPaginatedClientNetworkCardsIn {
  return FindPaginatedClientNetworkCardsIn.create({
    clientId: request.pathParams.clientId,
    paginationOptions: {
      page: request.queryParams.page ?? 1,
      pageSize: request.queryParams.pageSize ?? 10,
    },
  });
}
