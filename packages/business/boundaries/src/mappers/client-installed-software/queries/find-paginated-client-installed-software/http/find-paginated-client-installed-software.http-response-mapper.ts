import { FindPaginatedClientInstalledSoftwareOut } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { GetClientInstalledSoftwareHttpResponse } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

export function findPaginatedClientInstalledSoftwareHttpResponseMapper(response: FindPaginatedClientInstalledSoftwareOut): GetClientInstalledSoftwareHttpResponse {
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
