import { FindPaginatedTicketsOut } from 'acmp-connector-bounded-context';
import { GetTicketsHttpResponse } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function findPaginatedTicketsHttpResponseMapper(response: FindPaginatedTicketsOut): GetTicketsHttpResponse {
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
