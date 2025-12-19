import { FindPaginatedAssetsOut } from 'acmp-connector-bounded-context';
import { GetAssetsHttpResponse } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function findPaginatedAssetsHttpResponseMapper(response: FindPaginatedAssetsOut): GetAssetsHttpResponse {
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
