import {
  AcmpClientInstalledSoftwareListItemReadModel,
} from '@scaleits-solutions-gmbh/acmp-connector-lib-global-common-kit';
import { PaginationOption } from '@scaleits-solutions-gmbh/org-lib-backend-common-kit';
import { PaginatedData } from '@scaleits-solutions-gmbh/org-lib-global-common-kit';

export type FindPaginatedClientInstalledSoftwareFilters = {
  searchTerm?: string;
};

/**
 * Query repository for reading client installed software data from ACMP MSSQL database.
 */
export interface ClientInstalledSoftwareQueryRepositorySecondaryPort {
  /**
   * Find paginated list of installed software for a client
   */
  findPaginatedClientInstalledSoftware(clientId: string, pagination: PaginationOption, filters?: FindPaginatedClientInstalledSoftwareFilters): Promise<PaginatedData<AcmpClientInstalledSoftwareListItemReadModel>>;

  /**
   * Count installed software for a client
   */
  findClientInstalledSoftwareCount(clientId: string, filters?: FindPaginatedClientInstalledSoftwareFilters): Promise<number>;
}
