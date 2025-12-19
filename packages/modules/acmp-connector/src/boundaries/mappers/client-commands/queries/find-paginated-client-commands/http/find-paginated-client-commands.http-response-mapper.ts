import { FindPaginatedClientCommandsOut } from 'acmp-connector-bounded-context';
import { GetClientCommandsHttpResponse } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function findPaginatedClientCommandsHttpResponseMapper(response: FindPaginatedClientCommandsOut): GetClientCommandsHttpResponse {
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
