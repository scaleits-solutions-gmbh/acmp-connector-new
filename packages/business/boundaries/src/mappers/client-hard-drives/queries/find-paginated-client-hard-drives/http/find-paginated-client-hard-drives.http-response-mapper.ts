import { FindPaginatedClientHardDrivesOut } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { GetClientHardDrivesHttpResponse } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function findPaginatedClientHardDrivesHttpResponseMapper(response: FindPaginatedClientHardDrivesOut): GetClientHardDrivesHttpResponse {
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
