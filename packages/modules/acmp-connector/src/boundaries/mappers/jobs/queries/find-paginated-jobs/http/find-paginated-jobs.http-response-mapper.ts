import { FindPaginatedJobsOut } from 'acmp-connector-bounded-context';
import { GetJobsHttpResponse } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function findPaginatedJobsHttpResponseMapper(response: FindPaginatedJobsOut): GetJobsHttpResponse {
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
