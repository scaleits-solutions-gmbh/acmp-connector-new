import { FindPaginatedClientNetworkCardsOut } from 'acmp-connector-bounded-context';
import { GetClientNetworkCardsHttpResponse } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function findPaginatedClientNetworkCardsHttpResponseMapper(response: FindPaginatedClientNetworkCardsOut): GetClientNetworkCardsHttpResponse {
  return {
    statusCode: 200,
    body: {
      data: response.data,
      total: response.total,
      page: response.page,
      pageSize: response.pageSize,
      totalPages: response.totalPages,
    },
  };
}
