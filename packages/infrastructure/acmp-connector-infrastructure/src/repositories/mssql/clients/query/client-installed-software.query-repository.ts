import {
  ClientInstalledSoftwareQueryRepositorySecondaryPort,
  FindPaginatedClientInstalledSoftwareFilters,
} from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';
import { AcmpClientInstalledSoftwareListItemReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

import { findPaginatedClientInstalledSoftwareQueryMethod } from './query-methods/find-paginated-client-installed-software.query-method';
import { findClientInstalledSoftwareCountQueryMethod } from './query-methods/find-client-installed-software-count.query-method';

export class MssqlClientInstalledSoftwareQueryRepository implements ClientInstalledSoftwareQueryRepositorySecondaryPort {
  /**
   * Find paginated list of installed software for a client
   */
  async findPaginatedClientInstalledSoftware(
    clientId: string,
    pagination: PaginationOption,
    filters?: FindPaginatedClientInstalledSoftwareFilters,
  ): Promise<PaginatedData<AcmpClientInstalledSoftwareListItemReadModel>> {
    const data = await findPaginatedClientInstalledSoftwareQueryMethod(clientId, pagination, filters);
    return data;
  }

  /**
   * Count installed software for a client
   */
  async findClientInstalledSoftwareCount(
    clientId: string,
    filters?: FindPaginatedClientInstalledSoftwareFilters,
  ): Promise<number> {
    const count = await findClientInstalledSoftwareCountQueryMethod(clientId, filters);
    return count;
  }
}
