import { FindPaginatedClientsOut } from 'acmp-connector-bounded-context';
import { GetClientsHttpResponse } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function findPaginatedClientsHttpResponseMapper(response: FindPaginatedClientsOut): GetClientsHttpResponse {
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
