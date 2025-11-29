import {
  AcmpClientHardDriveListItemReadModel,
} from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';

/**
 * Query repository for reading client hard drive data from ACMP MSSQL database.
 */
export interface ClientHardDriveQueryRepositorySecondaryPort {
  /**
   * Find paginated list of hard drives for a client
   */
  findPaginatedClientHardDrives(clientId: string, pagination: PaginationOption): Promise<PaginatedData<AcmpClientHardDriveListItemReadModel>>;

  /**
   * Count hard drives for a client
   */
  findClientHardDriveCount(clientId: string): Promise<number>;
}
