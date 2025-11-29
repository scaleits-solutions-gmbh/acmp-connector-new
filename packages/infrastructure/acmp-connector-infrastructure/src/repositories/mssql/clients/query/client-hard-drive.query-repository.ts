import { ClientHardDriveQueryRepositorySecondaryPort } from '@repo/business/bounded-contexts/acmp-connector-bounded-context';
import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';
import { AcmpClientHardDriveListItemReadModel } from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';

import { findPaginatedClientHardDrivesQueryMethod } from './query-methods/find-paginated-client-hard-drives.query-method';
import { findClientHardDriveCountQueryMethod } from './query-methods/find-client-hard-drive-count.query-method';

export class MssqlClientHardDriveQueryRepository implements ClientHardDriveQueryRepositorySecondaryPort {
  /**
   * Find paginated list of hard drives for a client
   */
  async findPaginatedClientHardDrives(
    clientId: string,
    pagination: PaginationOption,
  ): Promise<PaginatedData<AcmpClientHardDriveListItemReadModel>> {
    const data = await findPaginatedClientHardDrivesQueryMethod(clientId, pagination);
    return data;
  }

  /**
   * Count hard drives for a client
   */
  async findClientHardDriveCount(clientId: string): Promise<number> {
    const count = await findClientHardDriveCountQueryMethod(clientId);
    return count;
  }
}
