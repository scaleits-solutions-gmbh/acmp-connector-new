import { FindPaginatedRolloutTemplatesOut } from 'acmp-connector-bounded-context';
import { GetRolloutTemplatesHttpResponse } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function findPaginatedRolloutTemplatesHttpResponseMapper(response: FindPaginatedRolloutTemplatesOut): GetRolloutTemplatesHttpResponse {
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
